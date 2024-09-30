import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnvConfig } from 'src/config';
import { WsMiddleware } from './ws.middleware';
import { ClientUserData } from 'src/common';

const config = new EnvConfig();
const origin = config.getFrontendOrigin();

// Redis mimic

const activeLoggedinUsers: ClientUserData[] = [];

@WebSocketGateway({
  namespace: '/chat',
  cros: {
    origin: origin
  }
})
export class ChatSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() server: Server<any, any>;

  constructor () {}

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

    const authData: ClientUserData = client['user'] || {};

    // Add to active users list
    if (authData) {
      this.addUserToList(authData);
    }

    console.log(activeLoggedinUsers);

    // FIlter the user data for same user
    this.server.emit('B_LIN', activeLoggedinUsers);
  }

  handleDisconnect(client: any) {
    console.log('DIsconnected server: ', client.id);
    const authData: ClientUserData = client['user'] || {};

    // Add to active users list
    if (authData) {
      this.removeUserFromList(authData.authId);

    }

    // Filter the data for same user
    const activeUsersList = activeLoggedinUsers.filter(item => item.authId !== authData.authId);
    const dataToFrontend = {
      theUserLoggedOut: authData.authId,
      remainingUsers: activeLoggedinUsers
    }
    this.server.emit('B_LOUT', dataToFrontend);
  }


  private addUserToList(authData: ClientUserData) : void {
    const isUserPresent = activeLoggedinUsers.some(item => item.authId === authData.authId);

    if(!isUserPresent) {
      activeLoggedinUsers.push(authData);
    }
  }

  private removeUserFromList(authId: number) : void {
    console.log('To remove auth id:', authId);
    const index = activeLoggedinUsers.findIndex(item => item.authId === authId);
    activeLoggedinUsers.splice(index, 1);

    console.log('After upadte: ', activeLoggedinUsers);
  }

}
