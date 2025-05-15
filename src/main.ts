import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { DatabaseService } from 'src/modules/database/database.service';
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
  await app.listen(port).then(async () => {
    console.log('Running on: https://localhost:' + port);
    console.log('Running on: https://localhost:' + port + '/swagger');
    try {
      console.log('Connecting to database:');
      const dbService = new DatabaseService();
      const result = await dbService.checkDatabaseHealth();
      console.log('Connnected - ', {
        status: result,
        exception: null,
        datetime: new Date().toISOString(),
      });
    } catch(ex) {
      console.log({
        status: 'error',
        exception: ex,
        datetime: new Date().toISOString(),
      });
    }
  });
}
bootstrap();
