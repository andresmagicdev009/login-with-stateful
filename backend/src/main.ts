import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(
      { whitelist: true, forbidNonWhitelisted: true }
    ));
  
  // Configuracion de Swagger 
  const config = new DocumentBuilder()
    .setTitle('Stateful Auth API')
    .setDescription('Documentacion de la API de autenticacion con estado')
    .setVersion('1.0')
    .addTag('auth') // Agrupa los endpoints bajo la etiqueta auth
    .build();


  const document = SwaggerModule.createDocument(app, config);

  // Montar la interfaz interactiva en la ruta '/api'
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:4200', // Dominio del fornt de Angular 
    credentials: true, // Permitir el envio de cookies en las solicitudes
  })
  await app.listen(3000);
  console.log('Aplicacion corriendo en http://localhost:3000');
  console.log('Documentacion de express-session la API disponible en http://localhost:3000/api');

}
bootstrap();
