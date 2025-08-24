import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
	let service: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: {
						findByEmail: jest.fn(),
						create: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('validateUser', () => {
		it('should return user data without password when credentials are valid', async () => {
			const user = {
				id: '1',
				email: 'test@example.com',
				name: 'Test User',
				password: 'hashedPassword',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);

			const result = await service.validateUser('test@example.com', 'password');

			expect(result).toEqual({
				id: '1',
				email: 'test@example.com',
				name: 'Test User',
			});
		});

		it('should return null when credentials are invalid', async () => {
			jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

			const result = await service.validateUser('test@example.com', 'password');

			expect(result).toBeNull();
		});
	});
});
