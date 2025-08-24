import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';

@Injectable()
export class ExpensesService {
	constructor(private prisma: PrismaService) {}

	async create(createExpenseDto: CreateExpenseDto, userId: string) {
		const category = await this.prisma.category.findFirst({
			where: { id: createExpenseDto.categoryId, userId },
		});

		if (!category) {
			throw new NotFoundException('Category not found or not accessible');
		}

		return this.prisma.expense.create({
			data: {
				...createExpenseDto,
				userId,
			},
			include: {
				category: true,
			},
		});
	}

	async findAll(userId: string, query: ExpenseQueryDto) {
		const {
			page = 1,
			limit = 10,
			startDate,
			endDate,
			categoryId,
			type,
			minAmount,
			maxAmount,
			search,
		} = query;

		const skip = (page - 1) * limit;

		const where: any = { userId };

		if (startDate || endDate) {
			where.date = {};
			if (startDate) where.date.gte = new Date(startDate);
			if (endDate) where.date.lte = new Date(endDate);
		}

		if (categoryId) where.categoryId = categoryId;
		if (type) where.type = type;

		if (minAmount !== undefined || maxAmount !== undefined) {
			where.amount = {};
			if (minAmount !== undefined) where.amount.gte = minAmount;
			if (maxAmount !== undefined) where.amount.lte = maxAmount;
		}

		if (search) {
			where.description = {
				contains: search,
				mode: 'insensitive',
			};
		}

		const [expenses, total] = await Promise.all([
			this.prisma.expense.findMany({
				where,
				include: {
					category: true,
				},
				orderBy: { date: 'desc' },
				skip,
				take: limit,
			}),
			this.prisma.expense.count({ where }),
		]);

		return {
			expenses,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	async findOne(id: string, userId: string) {
		const expense = await this.prisma.expense.findFirst({
			where: { id, userId },
			include: {
				category: true,
			},
		});

		if (!expense) {
			throw new NotFoundException(`Expense with ID ${id} not found`);
		}

		return expense;
	}

	async update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string) {
		await this.findOne(id, userId);

		if (updateExpenseDto.categoryId) {
			const category = await this.prisma.category.findFirst({
				where: { id: updateExpenseDto.categoryId, userId },
			});

			if (!category) {
				throw new NotFoundException('Category not found or not accessible');
			}
		}

		return this.prisma.expense.update({
			where: { id },
			data: updateExpenseDto,
			include: {
				category: true,
			},
		});
	}

	async remove(id: string, userId: string) {
		await this.findOne(id, userId);
		return this.prisma.expense.delete({
			where: { id },
			include: {
				category: true,
			},
		});
	}

	async getExpensesSummary(userId: string, startDate?: Date, endDate?: Date) {
		const where: any = { userId };

		if (startDate || endDate) {
			where.date = {};
			if (startDate) where.date.gte = startDate;
			if (endDate) where.date.lte = endDate;
		}

		const [totalIncome, totalExpenses, expensesByCategory] = await Promise.all([
			this.prisma.expense.aggregate({
				where: { ...where, type: 'INCOME' },
				_sum: { amount: true },
			}),
			this.prisma.expense.aggregate({
				where: { ...where, type: 'EXPENSE' },
				_sum: { amount: true },
			}),
			this.prisma.expense.groupBy({
				by: ['categoryId'],
				where: { ...where, type: 'EXPENSE' },
				_sum: { amount: true },
				_count: true,
			}),
		]);

		const categories = await this.prisma.category.findMany({
			where: {
				id: { in: expensesByCategory.map((e) => e.categoryId) },
				userId,
			},
		});

		const categoryMap = categories.reduce((acc, cat) => {
			acc[cat.id] = cat;
			return acc;
		}, {});

		const expensesByCategoryWithDetails = expensesByCategory.map((item) => ({
			category: categoryMap[item.categoryId],
			total: item._sum.amount || 0,
			count: item._count,
		}));

		return {
			totalIncome: totalIncome._sum.amount || 0,
			totalExpenses: totalExpenses._sum.amount || 0,
			balance:
				(totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
			expensesByCategory: expensesByCategoryWithDetails,
		};
	}
}
