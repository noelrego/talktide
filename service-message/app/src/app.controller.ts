import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { N_MsgPatternMessageService } from '@nn-rego/chatapp-common';
import { ChatHistoryType } from './common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @MessagePattern(N_MsgPatternMessageService.CREATE_MESSAGE)
  async createChat(@Payload() payload: ChatHistoryType) {
    return this.appService.getRecipientListService(payload);
  }

}
