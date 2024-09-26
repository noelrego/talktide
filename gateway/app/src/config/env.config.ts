import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {

    constructor () {}

    getPort() : number {
        return Number(process.env.GATEWAY_PORT) || 8080;
    }

    
}