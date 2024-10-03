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
    return process.env.QUEUE_MESSAGE_SERVICE || 'temp_queue_2';
  }

  getDbHost(): string {
    return process.env.POSTGRES_HOST;
  }

  getDbPort(): number {
    return Number(process.env.POSTGRES_PORT) || 5432;
  }

  getDbNameforService(): string {
    return process.env.MESSAGE_SERVICE_DB;
  }

  getDbUser(): string {
    return process.env.POSTGRES_USER;
  }

  getDbPass(): string {
    return process.env.POSTGRES_PASSWORD;
  }

  getJwtSecret(): string {
    return process.env.JWT_SECRET;
  }
}
