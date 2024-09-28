import { Injectable } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";

@Injectable()
export class ConfigService {

    constructor () {}

    getPort() : number {
        return Number(process.env.GATEWAY_PORT) || 8080;
    }

    getFrontendOrigin() : string {
        return 'http://localhost:4200'  // Demo purpose
    }

    getRMQurl() : string {
        return process.env.RABBITMQ_HOST_URL;
    }

    getJwtSecret() : string {
        return process.env.JET_SECRET;
    }

    getAuthUserServiceProxy() : any {
        return {
            transport: Transport.RMQ,
            options: {
                url: [this.getRMQurl()],
                queue: process.env.QUEUE_AUTHUSER_SERVICE || 'temp_queue_1',
                queueOptions: {
                    durable: false
                }
            }
        }
    }

    getMessageServiceProxy() : any {
        return {
            transport: Transport.RMQ,
            options: {
                url: [this.getRMQurl()],
                queue: process.env.QUEUE_MESSAGE_SERVICE || 'temp_queue_2',
                queueOptions: {
                    durable: false
                }
            }
        }
    }

    
}