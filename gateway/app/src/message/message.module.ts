import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroServiceName } from 'src/common';

@Module({
  imports: [
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
    ])
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
