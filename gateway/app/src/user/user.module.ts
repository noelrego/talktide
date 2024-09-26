import { Module } from '@nestjs/common';
import { AuthuserController } from './authuser/authuser.controller';
import { AuthuserService } from './authuser/authuser.service';

@Module({
  controllers: [AuthuserController],
  providers: [AuthuserService]
})
export class UserModule {}
