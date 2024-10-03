import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnvConfig } from 'src/config';
import { WsMiddleware } from './ws.middleware';
import { ClientJwtData, ClientUserData, SocketEvtNames } from 'src/common';

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

  constructor() { }

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


  // Client asking for Logged in users
  @SubscribeMessage(SocketEvtNames.REQUEST_LOGGEDINUSERS)
  handleRequestLoggedinUsers (@ConnectedSocket() client: Socket) {
    const clientAuthId = client['user'].authId;
    const cleanedUserInfo = activeLoggedinUsers.filter(
      user => user.authId !== clientAuthId
    );
    client.emit('B_LIN', cleanedUserInfo);
  }


}
