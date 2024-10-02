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

  @WebSocketServer() server: Server<any, any>;

  constructor() { }

  /**
   * To validate Socker JWT token in Middleware.
   * @param client 
   */
  afterInit(client: Socket) {
    //TO DO: Use middleware for JWT
    client.use(WsMiddleware() as any);
    console.log('Inital User List: ', activeLoggedinUsers);
  }

  handleConnection(client: Socket, ...args: any[]) {

    const authData: ClientJwtData = client['user'] || {};
    // Add to active users list
    if (authData) {
      const filterAuthData : ClientJwtData = {
        authId: authData.authId,
        userName: authData.userName,
        fullName: authData.fullName
      }
      this.addUserToList(filterAuthData);
    }

    // Filter connected user from avilable list
    // const connectAuthId: string = client['user'].authId;

    // const filterUserInfo = activeLoggedinUsers.filter(
    //   user => user.authId === connectAuthId
    // );
    // this.server.emit('B_LIN', filterUserInfo);
    
  }

  handleDisconnect(client: Socket) {
    console.log('DIsconnected server: ', client['user'].authId);
    const authData = client['user'] || {};
  
    // Add to active users list
    if (authData) {
      this.removeUserFromList(authData.authId);
    }

    // Filter the data for same user
    const clientAuthId = client['user'].authId;
    console.log('------------------------------------------')
    console.log('COnnetd user: ', clientAuthId);
    console.log('BREFORE LIST: ', activeLoggedinUsers);
    const cleanedUserInfo = activeLoggedinUsers.filter(
      user => user.authId !== clientAuthId
    );
    console.log('AFTER LIST: ', cleanedUserInfo);
    console.log('------------------------------------------')

    
    // client.emit('B_LIN', cleanedUserInfo);
  }


  private addUserToList(authData: ClientJwtData): void {
    const isUserPresent = activeLoggedinUsers.some(item => item.authId === authData.authId);


    if (!isUserPresent) {
      const newUser: ClientUserData = {
        ...authData, // spread the authData properties (authId, userName, fullName)
        userStatus: 'available' // or some other default status
      };
      activeLoggedinUsers.push(newUser);
    }
  }

  private removeUserFromList(authId: string): void {
    console.log('To remove auth id:', authId);
    const index = activeLoggedinUsers.findIndex(item => item.authId === authId);
    activeLoggedinUsers.splice(index, 1);
  }


  // Client asking for Logged in users
  
  @SubscribeMessage(SocketEvtNames.REQUEST_LOGGEDINUSERS)
  handleRequestLoggedinUsers (@ConnectedSocket() client: Socket) {
    const clientAuthId = client['user'].authId;

    // Filter out this client user info;
    console.log('------------------------------------------')
    console.log('COnnetd user: ', clientAuthId);
    console.log('BREFORE LIST: ', activeLoggedinUsers);
    const cleanedUserInfo = activeLoggedinUsers.filter(
      user => user.authId !== clientAuthId
    );
    console.log('AFTER LIST: ', cleanedUserInfo);
    console.log('------------------------------------------')


    client.emit('B_LIN', cleanedUserInfo);
  }

}
