import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnvConfig } from 'src/config';
import { WsMiddleware } from './ws.middleware';
import { ChatHistoryType, ClientJwtData, ClientUserData, CreateMemberType, SockerUpdateType, SocketEvtNames } from 'src/common';
import { ChatGatewayService } from './chatgateway.service';
import { N_SocketUpdateAction } from '@nn-rego/chatapp-common';

const config = new EnvConfig();
const origin = config.getFrontendOrigin();

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: origin,
    method: ['GET', 'POST', 'OPTIONS']
  }
})
export class ChatSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private socketService: ChatGatewayService
  ) { }


  afterInit(client: Socket) {
    
    // Use JWT middleware
    client.use(WsMiddleware() as any);

  }



  async handleConnection(client: Socket, ...args: any[]) {

    const authData: ClientJwtData = client['user'] || {};

    //Update in DB with status [login & available]
    const updatingData : SockerUpdateType = {
      clientId: client.id,
      authId: authData.authId
    }
    await this.socketService.socketUpadteUserStatus(N_SocketUpdateAction.CONNECTED, updatingData);
    
    // Update user logged in status to all other recipient
    // const loggedinMember = await this.socketService.getMemberInfo(authData.authId).catch(e => e);
    // console.log('[SOMEONE LOGIN ] memebr info: ', loggedinMember);
    this.server.emit('SOMEONE_LOGGEDIN', authData.authId);

  }



  handleDisconnect(client: Socket) {

    const authData : ClientJwtData = client['user'];

    //Update in DB with status [logout & offline
    const updatingData : SockerUpdateType = {
      clientId: client.id,
      authId: authData.authId
    }
    this.socketService.socketUpadteUserStatus(N_SocketUpdateAction.DISCONNECTED, updatingData);
    // Broadcast and inform all that this user logged out
    this.server.emit('SOMEONE_LOGGEDOUT', authData.authId);
  }

  

  // Client is chnaging the status
  @SubscribeMessage(SocketEvtNames.CHANGE_USER_STATE)
  async handleUserStateChange(@ConnectedSocket() client: Socket, @MessageBody() newState: string) {
    const clientAuth: ClientJwtData = client['user'];
    //Update in DB with status [login & available]
    const updatingData : SockerUpdateType = {
      clientId: client.id,
      authId: clientAuth.authId,
      newStatus: newState
    }
    await this.socketService.socketUpadteUserStatus(N_SocketUpdateAction.STATUS_UPDATE, updatingData);

    this.server.emit('USER_CHANGED_STATUS', { authId: clientAuth.authId, newStatus: newState});
  
  }



  // // Client asking for Logged in users
  // @SubscribeMessage(SocketEvtNames.REQUEST_LOGGEDINUSERS)
  // async handleRequestLoggedinUsers(@ConnectedSocket() client: Socket) {
    
  //   const clientAuthId = client['user'].authId;
  //   const list = await this.socketService.requestAvailableUsers(clientAuthId);
  //   console.log('LIST: ', list);
    
  // }


  // To create members like chat history
  @SubscribeMessage(SocketEvtNames.CREATE_MEMBER_BY_AVAILABLE_LIST)
  async handleCreateMember(@ConnectedSocket() client: Socket, @MessageBody() members: CreateMemberType) {
    const r = await this.socketService.createChatMembersService(members);
    this.server.to(members.clientId).emit('CREATED_CHAT_MEMBER');
    this.server.to(client.id).emit('CREATED_CHAT_MEMBER_SELF');
  }



  // Get Participient list
  @SubscribeMessage(SocketEvtNames.GET_RECIPIENT_LIST)
  async handleGetRecipientList(@ConnectedSocket() client: Socket) {
    const clientinfo: ClientJwtData = client['user'];

    const result = await this.socketService.getRecipientListService(clientinfo.authId);

    if (result.resData.length > 0) {
    } else {}
  }


  // To create a chat 
  @SubscribeMessage(SocketEvtNames.CHAT_SENT)
  handleChatSent(@ConnectedSocket() client: Socket, @MessageBody() chatHistory: ChatHistoryType) {
    console.log('[CHAT HISTORY] ', chatHistory);
    this.socketService.createChatHistory(chatHistory).catch(err=> err);
    this.server.to(chatHistory.clientId).emit('CHAT_NOTIFY', chatHistory);
  }

}
