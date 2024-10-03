import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnvConfig } from 'src/config';
import { WsMiddleware } from './ws.middleware';
import { ClientJwtData, ClientUserData, CreateMemberType, SocketEvtNames } from 'src/common';
import { ChatGatewayService } from './chatgateway.service';

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

  /**
   * To validate Socker JWT token in Middleware.
   * @param client 
   */
  afterInit(client: Socket) {
    client.use(WsMiddleware() as any);
  }

  handleConnection(client: Socket, ...args: any[]) {

    const authData: ClientJwtData = client['user'] || {};
    console.log('[Connected]: ', authData.authId, authData.userName);

    // Add to active users list
    if (authData) {
      const filterAuthData : ClientJwtData = {
        authId: authData.authId,
        userName: authData.userName,
        fullName: authData.fullName
      }
      this.addUserToList(filterAuthData);
      const loggedInUser = this.getUserInfoByAuthId(authData.authId);
      this.server.emit('USER_LOGGEDIN', loggedInUser);
    }
    
  }

  handleDisconnect(client: Socket) {
    const authData = client['user'];
    console.log('[Disconnected]: ', authData.authId, authData.userName);
    
    // Remove from active users list
    if (authData) {
      this.removeUserFromList(authData.authId);
    }

    // Broadcast and inform all that this user logged out
    this.server.emit('USER_LOGGEDOUT', authData.authId);
  }
  // Client asking for Logged in users
  @SubscribeMessage(SocketEvtNames.REQUEST_LOGGEDINUSERS)
  handleRequestLoggedinUsers (@ConnectedSocket() client: Socket) {
    const clientAuthId = client['user'].authId;
    const cleanedUserInfo = activeLoggedinUsers.filter(
      user => user.authId !== clientAuthId
    );
    client.emit('B_LIN', cleanedUserInfo);
  }

  // Client is chnaging the status
  @SubscribeMessage(SocketEvtNames.CHANGE_USER_STATE)
  handleUserStateChange(@ConnectedSocket() client: Socket, @MessageBody() newState: string) {
    const clientAuth : ClientJwtData = client['user'];
    console.log('CHANGE STATE: ', clientAuth, newState);
    this.updateUserState(clientAuth.authId, newState);
    this.server.emit('USER_CHANGED_STATE', {
      authId: clientAuth.authId,
      userStatus: newState
    });
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

    const result = await this.socketService.getRecipientListService(clientinfo.authId)
    console.log(result);
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


  private getUserInfoByAuthId(id: string) : ClientUserData {
    const res = activeLoggedinUsers.find(user => user.authId === id);
    return res;
  }

  private updateUserState(id: string,  newState: string) {
    console.log('BEFORE STATE CHNAGE: ', activeLoggedinUsers);
    activeLoggedinUsers.map(
      user => {
        if (user.authId == id) {
          user.userStatus = newState
        }
      }
    )

    console.log('AFTER STATE CHNAGE: ', activeLoggedinUsers);

  }



}
