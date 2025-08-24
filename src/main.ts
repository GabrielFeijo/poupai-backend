import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

	const config = new DocumentBuilder()
		.setTitle('Financial Analysis API')
		.setDescription('API para sistema de análise financeira')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	const port = process.env.PORT || 3001;
	await app.listen(port);

	console.log(`🚀 Server running on http://localhost:${port}`);
	console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
