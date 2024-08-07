import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Set a global prefix for API routes

  // Enable CORS
  app.enableCors({
    origin: [
      'http://127.0.0.1:5500',
      'http://localhost:3001',
      'http://localhost:3000',
    ], // Allow only these origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // If you need to include credentials like cookies
  });

  await app.listen(3000);
}
bootstrap();
