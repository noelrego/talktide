import { Module } from '@nestjs/common';
import { ConfigService } from './config/env.config';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard, AtStrategy } from './jwt';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UserModule, MessageModule],
  controllers: [],
  providers: [
    AtStrategy,
    {
      provide: ConfigService,
      useFactory: () => new ConfigService()
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ],
  exports: [ConfigService]
})
export class AppModule {}
