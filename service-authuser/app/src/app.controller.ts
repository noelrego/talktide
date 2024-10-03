import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { N_MsgPatternAuthUserService, N_SocketUpdateAction } from '@nn-rego/chatapp-common';
import { AuthLoginType, CheckUserNameType, RegisterUserType, SockerUpdateType } from './common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @MessagePattern(N_MsgPatternAuthUserService.CHECK_USERNAME)
  async checkUserName(@Payload() payload: CheckUserNameType) {
    return this.appService.checkUserNameService(payload);
  }


  @MessagePattern(N_MsgPatternAuthUserService.GET_ALL_USERS)
  async getAllUser() {
    return this.appService.getAllUserService();
  }


  @MessagePattern(N_MsgPatternAuthUserService.REGISTER_USER)
  async registerUser(@Payload() payload: RegisterUserType) {
    return this.appService.registerUserService(payload);
  }


  @MessagePattern(N_MsgPatternAuthUserService.LOGIN_USER)
  loginAuthUser(@Payload() payload: AuthLoginType) {
    return this.appService.loginAuthUserService(payload);
  }

  // Socket update action
  @MessagePattern(N_MsgPatternAuthUserService.SOCKET_UPDATE_USER_STATUS)
  updateSocketStatusToUser (@Payload() 
  payload: {action: N_SocketUpdateAction, data: SockerUpdateType} ) {
    return this.appService.updateSocketStatusToUserService(payload);
  }
}
