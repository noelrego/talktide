import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfig } from './config';
import { ChatSocketGateway } from './chatgateway/chatgateway.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroServiceName } from './common';
import { ChatGatewayService } from './chatgateway/chatgateway.service';

@Module({
  imports: [
    // Auth User service
    ClientsModule.register([
      {
        name: MicroServiceName.AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_HOST_URL],
          queue: process.env.QUEUE_AUTHUSER_SERVICE,
          queueOptions: {
            durable: false
          }
        }
      }
    ]),

    // Message Service
    ClientsModule.register([
      {
        name: MicroServiceName.MESSAGE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_HOST_URL],
          queue: process.env.QUEUE_MESSAGE_SERVICE,
          queueOptions: {
            durable: false
          }
        }
      }
    ]),

  ],
  controllers: [AppController],
  providers: [AppService, EnvConfig, ChatSocketGateway, ChatGatewayService],
})
export class AppModule {}
