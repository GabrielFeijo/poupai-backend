import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
		credentials: true,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	);

	const port = process.env.PORT || 3333;
	await app.listen(port);

	console.log(`🚀 Server running on http://localhost:${port}`);
	console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
