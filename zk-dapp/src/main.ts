import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  // App config
  app.setGlobalPrefix('api/v1');

  // enable cors
  app.enableCors({
    origin: "*",
    allowedHeaders: "Content-Type",
    methods: "GET,POST"
  });

  // Check if there validation pipe and validate if exists 
  app.useGlobalPipes(new ValidationPipe())

  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 3000;
  await app.listen(3000);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
