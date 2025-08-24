import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/register (POST)', () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send({
				email: 'test@example.com',
				name: 'Test User',
				password: 'password123',
			})
			.expect(201);
	});

	it('/auth/login (POST)', async () => {
		// First register a user
		await request(app.getHttpServer()).post('/auth/register').send({
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		});

		return request(app.getHttpServer())
			.post('/auth/login')
			.send({
				email: 'test@example.com',
				password: 'password123',
			})
			.expect(201)
			.expect((res) => {
				expect(res.body).toHaveProperty('access_token');
				expect(res.body).toHaveProperty('user');
			});
	});
});
