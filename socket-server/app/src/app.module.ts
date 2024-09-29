import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfig } from './config';
import { ChatSocketGateway } from './chatgateway/chatgateway.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EnvConfig, ChatSocketGateway],
})
export class AppModule {}
