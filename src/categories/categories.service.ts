import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
	constructor(private prisma: PrismaService) {}

	async create(createCategoryDto: CreateCategoryDto, userId: string) {
		const existingCategory = await this.prisma.category.findFirst({
			where: {
				name: createCategoryDto.name,
				userId,
			},
		});

		if (existingCategory) {
			throw new ConflictException('Category name already exists');
		}

		return this.prisma.category.create({
			data: {
				...createCategoryDto,
				userId,
			},
			include: {
				_count: {
					select: { expenses: true },
				},
			},
		});
	}

	async findAll(userId: string) {
		return this.prisma.category.findMany({
			where: { userId },
			include: {
				_count: {
					select: { expenses: true },
				},
			},
			orderBy: { name: 'asc' },
		});
	}

	async findOne(id: string, userId: string) {
		const category = await this.prisma.category.findFirst({
			where: { id, userId },
			include: {
				_count: {
					select: { expenses: true },
				},
			},
		});

		if (!category) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}

		return category;
	}

	async update(
		id: string,
		updateCategoryDto: UpdateCategoryDto,
		userId: string
	) {
		await this.findOne(id, userId);

		if (updateCategoryDto.name) {
			const existingCategory = await this.prisma.category.findFirst({
				where: {
					name: updateCategoryDto.name,
					userId,
					NOT: { id },
				},
			});

			if (existingCategory) {
				throw new ConflictException('Category name already exists');
			}
		}

		return this.prisma.category.update({
			where: { id },
			data: updateCategoryDto,
			include: {
				_count: {
					select: { expenses: true },
				},
			},
		});
	}

	async remove(id: string, userId: string) {
		const category = await this.findOne(id, userId);

		if (!category) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}

		const expensesCount = await this.prisma.expense.count({
			where: { categoryId: id },
		});

		if (expensesCount > 0) {
			throw new ConflictException(
				'Cannot delete category that has associated expenses'
			);
		}

		return this.prisma.category.delete({
			where: { id },
		});
	}

	async getCategoriesWithStats(userId: string) {
		const categories = await this.prisma.category.findMany({
			where: { userId },
			include: {
				_count: {
					select: { expenses: true },
				},
				expenses: {
					select: {
						amount: true,
						type: true,
					},
				},
			},
		});

		return categories.map((category) => {
			const totalExpenses = category.expenses
				.filter((expense) => expense.type === 'EXPENSE')
				.reduce((sum, expense) => sum + expense.amount, 0);

			const totalIncome = category.expenses
				.filter((expense) => expense.type === 'INCOME')
				.reduce((sum, expense) => sum + expense.amount, 0);

			const { expenses: _, ...categoryData } = category;

			return {
				...categoryData,
				totalExpenses,
				totalIncome,
				netAmount: totalIncome - totalExpenses,
			};
		});
	}
}
