import { Injectable } from "@nestjs/common";

@Injectable()
export class EnvConfig {

    constructor () {}

    getSocketGatewayPort(): number {
        return Number(process.env.SOCKET_SERVER_PORT) || 8082;
    }

    getJwtSecret() {
        return process.env.JWT_SECRET;
    }

    getFrontendOrigin() {
        return process.env.FRONTEND_ORIGIN;
    }
}