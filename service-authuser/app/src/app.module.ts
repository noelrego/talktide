import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomConfigService } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperClass } from './helper/hash.helper';
import { JwtService } from '@nestjs/jwt';
import { AuthUserRepo, MembersRepo, StatusInfoRepo } from './entity';

const conf = new CustomConfigService();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (c) => ({
        type: 'postgres',
        host: conf.getDbHost(),
        port: conf.getDbPort(),
        username: conf.getDbUser(),
        password: conf.getDbPass(),
        database: conf.getDbNameforService(),
        entities: [AuthUserRepo, StatusInfoRepo, MembersRepo],
        synchronize: false,  // DB alter should not
        migrationsRun: false,
      }),
    }),

    TypeOrmModule.forFeature([
      AuthUserRepo, StatusInfoRepo, MembersRepo
    ])
  ],
  controllers: [AppController],
  providers: [
    {
      provide: CustomConfigService,
      useFactory: () => new CustomConfigService()
    },
  AppService,
  HelperClass,
  JwtService
],
  exports: [CustomConfigService]
})
export class AppModule {}
