import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/env.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [
    {
      provide: ConfigService,
      useFactory: () => new ConfigService()
    },
    AppService],
  exports: [ConfigService]
})
export class AppModule {}
