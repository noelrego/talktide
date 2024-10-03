import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { N_MsgPatternmessageService } from '@nn-rego/chatapp-common';
import { CreateMemberType } from './common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @MessagePattern(N_MsgPatternmessageService.CREATE_CHAT_MEMBER)
  async createChatMember(@Payload() payload: CreateMemberType) {
    return this.appService.createChatMemberService(payload);
  }
}
