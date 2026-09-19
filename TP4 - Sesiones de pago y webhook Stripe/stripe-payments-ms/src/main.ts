import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 1. Activamos rawBody para que el webhook de Stripe pueda leer el cuerpo crudo y verificar la firma
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // 2. Configuramos el ValidationPipe global con las reglas de seguridad exigidas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 3. Levantamos el servidor en el puerto sugerido (3003)
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Microservicio corriendo en http://localhost:${port}`);
}
bootstrap();