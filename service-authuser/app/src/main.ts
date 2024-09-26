import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@talktide-broker:5672/'],
        queue: 'talktide_authuser',
        queueOptions: {
          durable: false
        }
      }
    }
  );

  console.log(`AUTH USER SERVICE Running with queue talktide`);
  await app.listen();
}
bootstrap();
