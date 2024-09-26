import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {

    constructor () {}

    getRMQurl() : string {
        return process.env.RABBITMQ_HOST_URL;
    }

    getMyServiceQueueName() : string {
        return process.env.QUEUE_AUTHUSER_SERVICE || 'temp_queue_1';
    }
    
}