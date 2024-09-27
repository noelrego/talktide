// src/config/custom-config.service.ts

import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class CustomConfigService {
  constructor() {}

  getRMQurl(): string {
    return process.env.RABBITMQ_HOST_URL;
  }

  getMyServiceQueueName(): string {
    return process.env.QUEUE_AUTHUSER_SERVICE || 'temp_queue_1';
  }

  getDbHost(): string {
    return process.env.POSTGRES_HOST;
  }

  getDbPort(): number {
    return Number(process.env.POSTGRES_PORT) || 5432;
  }

  getDbNameforService(): string {
    return process.env.AUTH_SERVICE_DB;
  }

  getDbUser(): string {
    return process.env.POSTGRES_USER;
  }

  getDbPass(): string {
    return process.env.POSTGRES_PASSWORD;
  }

  createDataSourceOptions = (): DataSourceOptions => {
    return {
      type: 'postgres',
      host: this.getDbHost(),
      port: this.getDbPort(),
      username: this.getDbUser(),
      password: this.getDbPass(),
      database: this.getDbNameforService(),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsRun: false,
    };
  };

  createDataSource = (): DataSource => {
    return new DataSource(this.createDataSourceOptions());
  };
}
