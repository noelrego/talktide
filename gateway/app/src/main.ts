import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService =  app.get(ConfigService);
  const port = configService.getPort();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: [configService.getFrontendOrigin()],
  })
  await app.listen(port);

  console.log(`GATEWAY running on port ${port} started at ${new Date()}`);
}
bootstrap();
