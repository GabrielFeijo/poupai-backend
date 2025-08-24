import { INestApplication } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
	const swaggerUser = process.env.SWAGGER_USER as string;
	const swaggerPassword = process.env.SWAGGER_PASSWORD as string;

	if (process.env.NODE_ENV !== 'development') {
		app.use(
			['/docs', '/docs-json'],
			basicAuth({
				challenge: true,
				users: {
					[swaggerUser || 'admin']: swaggerPassword || 'admin',
				},
			})
		);
	}

	const config = new DocumentBuilder()
		.setTitle('PoupAí API')
		.setDescription('API para sistema de análise financeira')
		.setVersion('1.0')
		.setContact(
			'Gabriel Feijó',
			'https://github.com/GabrielFeijo',
			'feijo6622@gmail.com'
		)
		.setLicense('MIT', 'https://opensource.org/licenses/MIT')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth'
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('/docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			displayRequestDuration: true,
			filter: false,
			showRequestHeaders: true,
			showCommonExtensions: true,
		},
		customSiteTitle: 'PlanejAí API',
		customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #155dfc; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
    `,
	});
};
