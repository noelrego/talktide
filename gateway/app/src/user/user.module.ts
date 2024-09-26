import { Module } from '@nestjs/common';
import { AuthuserController } from './authuser/authuser.controller';
import { AuthuserService } from './authuser/authuser.service';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { MicroServiceName } from 'src/common';
import { ConfigService } from 'src/config';

@Module({
  imports: [
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
    ])
  ],
  controllers: [AuthuserController],
  providers: [AuthuserService,
  
  ]
})
export class UserModule {}
