import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MsgPatternAuthUserService } from '@nn-rego/chatapp-common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(MsgPatternAuthUserService.GET_ALL_USERS)
  async getAllUser() {
    return this.appService.getAllUserService();
  }

  @MessagePattern(MsgPatternAuthUserService.REGISTER_USER)
  async registerUser(@Payload() payload: any) {
    return this.appService.registerUserService(payload);
  }

  @MessagePattern(MsgPatternAuthUserService.LOGIN_USER)
  loginAuthUser(@Payload() payload: any) {
    return this.appService.loginAuthUserService(payload);
  }
}
