import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { N_MsgPatternMessageService } from '@nn-rego/chatapp-common';
import { ChatHistoryType } from './common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  // To create chat
  @MessagePattern(N_MsgPatternMessageService.CREATE_MESSAGE)
  async createChat(@Payload() payload: ChatHistoryType) {
    return this.appService.createChatHistoryService(payload);
  }

  // To get chat list
  @MessagePattern(N_MsgPatternMessageService.GET_LISTOF_MESSAGES)
  async getChatHistory(@Payload() payload: number) {
    return this.appService.getChatHistoryListService(payload);
  }

}
