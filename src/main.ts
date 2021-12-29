import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
const serverConfig = config.get('server');

const port = process.env.PORT || serverConfig.port || 3000;

async function bootstrap() {
  const logger = new Logger('main: bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: serverConfig.loggerLevel,
    cors: serverConfig.cors,
  });
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('API doc')
        .setDescription('description')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    ),
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
