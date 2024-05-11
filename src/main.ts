import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/v1';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    credentials: true,
    origin: true
  })

  const config = new DocumentBuilder()
      .setTitle('Sixth Sense API')
      .setVersion('1.0')
      .setBasePath(globalPrefix)
      .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  await app.listen(5005);
}
bootstrap();
