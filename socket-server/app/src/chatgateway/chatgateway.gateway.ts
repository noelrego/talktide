import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnvConfig } from 'src/config';
import { WsMiddleware } from './ws.middleware';
import { ClientUserData } from 'src/common';

const config = new EnvConfig();
const origin = config.getFrontendOrigin();

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
  }

  handleConnection(client: Socket, ...args: any[]) {

    const authData: ClientUserData = client['user'];

    console.log('Handle connection: ', client.id, authData);
  }

  handleDisconnect(client: any) {
    console.log('DIsconnected server: ', client.id);
  }

}
