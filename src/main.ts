import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupSwagger } from './setupSwagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: ['http://localhost:5173', 'http://localhost:3000'],
		credentials: true,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	);

	setupSwagger(app);

	const port = process.env.PORT || 3333;
	await app.listen(port);

	console.log(`🚀 Server running on http://localhost:${port}`);
	console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
