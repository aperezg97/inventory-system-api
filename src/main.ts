import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
require('dotenv').config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/cert/key.pem'),
    cert: fs.readFileSync('./src/cert/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventory System API')
    .setDescription('TODO - API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = Number.parseInt(process.env.APP_PORT as string);
  console.log('Running on: https://localhost:' + port);
  console.log('Running on: https://localhost:' + port + '/swagger');
  await app.listen(port);
}
bootstrap();
