import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { EnvConfig } from '../config';

const jwtService = new JwtService();
const envConfig = new EnvConfig();

type SocketMiddleWare = {
    (client: Socket, next : (err? : Error) => void )
}


export const WsMiddleware = () : SocketMiddleWare => {

    return(client, next) => {

        // Validate JWT and extract authId

        try {
            const token = client.handshake.headers['authorization'].split(' ')[1]; // Bearer {token}
            const res = jwtService.verify(token, {
                secret: envConfig.getJwtSecret(),
                ignoreExpiration: false
            });

            client['user'] = res;

            next();
        } catch (error) {
            next(error);
        }
        
    }
}