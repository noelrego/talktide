import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomConfigService } from './config/';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(CustomConfigService); // Get ConfigService instance

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.getRMQurl()], // Load URL from ConfigService
      queue: configService.getMyServiceQueueName(), // Load queue name from ConfigService
      queueOptions: {
        durable: false,
      },
    },
  });

  console.log(`AUTH USER SERVICE Running with queue ${configService.getMyServiceQueueName()}`);
  await app.listen();
}

bootstrap();
