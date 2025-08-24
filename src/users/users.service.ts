import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto) {
		try {
			const user = await this.prisma.user.create({
				data: createUserDto,
				select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			return user;
		} catch (error) {
			if (error.code === 'P2002') {
				throw new ConflictException('Email already exists');
			}
			throw error;
		}
	}

	async findAll() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				password: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return user;
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id);

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		const updatedUser = await this.prisma.user.update({
			where: { id },
			data: updateUserDto,
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return updatedUser;
	}

	async remove(id: string) {
		await this.findOne(id);
		return this.prisma.user.delete({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
			},
		});
	}
}
