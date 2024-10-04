import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnvConfig } from 'src/config';
import { WsMiddleware } from './ws.middleware';
import { ClientJwtData, ClientUserData, CreateMemberType, SockerUpdateType, SocketEvtNames } from 'src/common';
import { ChatGatewayService } from './chatgateway.service';
import { N_SocketUpdateAction } from '@nn-rego/chatapp-common';

const config = new EnvConfig();
const origin = config.getFrontendOrigin();

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
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
    const loggedinMember = await this.socketService.getMemberInfo(authData.authId).catch(e => e);
    console.log('[SOMEONE LOGIN ] memebr info: ', loggedinMember);
    this.server.emit('SOMEONE_LOGGEDIN', loggedinMember);

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
  handleUserStateChange(@ConnectedSocket() client: Socket, @MessageBody() newState: string) {
    const clientAuth: ClientJwtData = client['user'];
    //Update in DB with status [login & available]
    const updatingData : SockerUpdateType = {
      clientId: client.id,
      authId: clientAuth.authId,
      newStatus: newState
    }
    this.socketService.socketUpadteUserStatus(N_SocketUpdateAction.STATUS_UPDATE, updatingData);
  
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
  handleCreateMember(@ConnectedSocket() client: Socket, @MessageBody() members: CreateMemberType) {
    this.socketService.createChatMembersService(members);
  }



  // Get Participient list
  @SubscribeMessage(SocketEvtNames.GET_RECIPIENT_LIST)
  async handleGetRecipientList(@ConnectedSocket() client: Socket) {
    const clientinfo: ClientJwtData = client['user'];

    const result = await this.socketService.getRecipientListService(clientinfo.authId);

    if (result.resData.length > 0) {
    } else {}
  }

}
