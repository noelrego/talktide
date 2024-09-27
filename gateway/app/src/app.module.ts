import { Module } from '@nestjs/common';
import { ConfigService } from './config/env.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [
    {
      provide: ConfigService,
      useFactory: () => new ConfigService()
    },
  ],
  exports: [ConfigService]
})
export class AppModule {}
