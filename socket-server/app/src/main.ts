import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = app.get(EnvConfig);
  app.enableCors({
    credentials: true,
    origin: [config.getFrontendOrigin()]
  });
  
  await app.listen(config.getSocketGatewayPort());
  console.log(`S O C K E T  S E R V E R  on port ${config.getSocketGatewayPort()}`)
}
bootstrap();
