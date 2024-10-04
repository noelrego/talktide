import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { N_MsgPatternmessageService } from '@nn-rego/chatapp-common';
import { CreateMemberType } from './common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @MessagePattern(N_MsgPatternmessageService.GET_CHAT_MEMBERS_LIST)
  async getRecipientList(@Payload() authId: string) {
    return this.appService.getRecipientListService(authId);
  }
}
