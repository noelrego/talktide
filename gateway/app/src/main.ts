import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { ValidationPipe } from '@nestjs/common';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true});

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  
  const configService =  app.get(ConfigService);
  const port = configService.getPort();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: [configService.getFrontendOrigin()],
  })
  await app.listen(port);

  
}
bootstrap();
