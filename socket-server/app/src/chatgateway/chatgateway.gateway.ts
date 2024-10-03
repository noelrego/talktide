import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnvConfig } from 'src/config';
import { WsMiddleware } from './ws.middleware';
import { ClientJwtData, ClientUserData, CreateMemberType, SockerUpdateType, SocketEvtNames } from 'src/common';
import { ChatGatewayService } from './chatgateway.service';
import { N_SocketUpdateAction } from '@nn-rego/chatapp-common';

const config = new EnvConfig();
const origin = config.getFrontendOrigin();

// Redis mimic

const activeLoggedinUsers: ClientUserData[] = [];

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



  handleConnection(client: Socket, ...args: any[]) {

    const authData: ClientJwtData = client['user'] || {};

    //Update in DB with status [login & available]
    const updatingData : SockerUpdateType = {
      authId: authData.authId
    }
    this.socketService.socketUpadteUserStatus(N_SocketUpdateAction.CONNECTED, updatingData);

    // Add to active users list
    if (authData) {
      const filterAuthData: ClientJwtData = {
        authId: authData.authId,
        userName: authData.userName,
        fullName: authData.fullName
      }
      this.addUserToList(filterAuthData);
      const loggedInUser = this.getUserInfoByAuthId(authData.authId);
      // this.server.emit('USER_LOGGEDIN', loggedInUser);
    }

  }



  handleDisconnect(client: Socket) {

    const authData : ClientJwtData = client['user'];

    //Update in DB with status [logout & offline]
    const updatingData : SockerUpdateType = {
      authId: authData.authId
    }
    this.socketService.socketUpadteUserStatus(N_SocketUpdateAction.DISCONNECTED, updatingData);
    // Broadcast and inform all that this user logged out
    // this.server.emit('USER_LOGGEDOUT', authData.authId);
  }

  

  // Client is chnaging the status
  @SubscribeMessage(SocketEvtNames.CHANGE_USER_STATE)
  handleUserStateChange(@ConnectedSocket() client: Socket, @MessageBody() newState: string) {
    
    const clientAuth: ClientJwtData = client['user'];
    //Update in DB with status [login & available]
    const updatingData : SockerUpdateType = {
      authId: clientAuth.authId,
      newStatus: newState
    }
    this.socketService.socketUpadteUserStatus(N_SocketUpdateAction.STATUS_UPDATE, updatingData);
  
  }



  // Client asking for Logged in users
  @SubscribeMessage(SocketEvtNames.REQUEST_LOGGEDINUSERS)
  handleRequestLoggedinUsers(@ConnectedSocket() client: Socket) {
    
    const clientAuthId = client['user'].authId;
    const cleanedUserInfo = activeLoggedinUsers.filter(
      user => user.authId !== clientAuthId
    );
    // client.emit('B_LIN', cleanedUserInfo);
  }



  



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

      const filterMember = this.transformMembers(result.resData, clientinfo.authId);
      console.log(filterMember);
    } else {}
  }



  /**
   * Helper functions
   */
  private addUserToList(authData: ClientJwtData): void {
    const isUserPresent = activeLoggedinUsers.some(item => item.authId === authData.authId);
    if (!isUserPresent) {
      const newUser: ClientUserData = {
        ...authData,
        userStatus: 'available'
      };
      activeLoggedinUsers.push(newUser);
    }
  }


  private removeUserFromList(authId: string): void {
    const index = activeLoggedinUsers.findIndex(item => item.authId === authId);
    activeLoggedinUsers.splice(index, 1);
  }



  private getUserInfoByAuthId(id: string): ClientUserData {
    const res = activeLoggedinUsers.find(user => user.authId === id);
    return res;
  }


  private updateUserState(id: string, newState: string) {
    activeLoggedinUsers.map(
      user => {
        if (user.authId == id) {
          user.userStatus = newState
        }
      }
    )

  }

  /**
  * Helper function
  */
  private transformMembers(arr: any, id: string) {
    return arr.map(item => {
      const removeSelfId = item.chatMembers.filter(member => member !== id);
      return {
        memberId: item.id.toString(),
        chatMembers: removeSelfId.join(', '),
        roomName: item.roomName
      }
    });
  }



}
