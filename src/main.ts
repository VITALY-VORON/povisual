import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerAuthMiddleware } from './middleware/swagger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/v1';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    credentials: true,
    origin: true,
  });
  
  app.use(`/${globalPrefix}/docs`, new SwaggerAuthMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('Sixth Sense API')
    .setVersion('1.0')
    .setBasePath(globalPrefix)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  // Применяем Middleware к правильному пути

  await app.listen(5001);
}
bootstrap();
