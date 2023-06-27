import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from 'libs/interceptor/transform/transform.interceptor';
import { HttpExceptionFilter } from 'libs/filters/http-exception/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.enableCors();
  await app.useGlobalInterceptors(new TransformInterceptor());
  await app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('接口文档描述')
    .setVersion('1.0')
    .addTag('LiveStream')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);
  const PORT = app.get<ConfigService>(ConfigService).get('SEVER_PORT');
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/api-docs`);
}
bootstrap();
