import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomConfigService } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,  // DB alter should not
        migrationsRun: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: CustomConfigService,
      useFactory: () => new CustomConfigService()
  },AppService],
  exports: [CustomConfigService]
})
export class AppModule {}
