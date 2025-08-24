import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = await bcrypt.hash('password123', 10);

	const user = await prisma.user.upsert({
		where: { email: 'demo@example.com' },
		update: {},
		create: {
			email: 'demo@example.com',
			name: 'Demo User',
			password: hashedPassword,
		},
	});

	const categories = await Promise.all([
		prisma.category.upsert({
			where: { id: '68aa240fd763de8560cdf396' },
			update: {},
			create: {
				name: 'Alimentação',
				color: '#FF6B6B',
				description: 'Gastos com comida e bebidas',
				userId: user.id,
			},
		}),
		prisma.category.upsert({
			where: { id: '68aa242df2bafe487b6128c2' },
			update: {},
			create: {
				name: 'Transporte',
				color: '#4ECDC4',
				description: 'Gastos com transporte',
				userId: user.id,
			},
		}),
		prisma.category.upsert({
			where: { id: '68aa243181c1dbea1df3d959' },
			update: {},
			create: {
				name: 'Lazer',
				color: '#45B7D1',
				description: 'Gastos com entretenimento',
				userId: user.id,
			},
		}),
	]);

	const expenses = [
		{
			description: 'Supermercado',
			amount: 120.5,
			date: new Date('2024-01-15'),
			type: 'EXPENSE' as const,
			categoryId: categories[0].id,
			userId: user.id,
		},
		{
			description: 'Salário',
			amount: 5000.0,
			date: new Date('2024-01-01'),
			type: 'INCOME' as const,
			categoryId: categories[0].id,
			userId: user.id,
		},
		{
			description: 'Gasolina',
			amount: 80.0,
			date: new Date('2024-01-10'),
			type: 'EXPENSE' as const,
			categoryId: categories[1].id,
			userId: user.id,
		},
	];

	await Promise.all(
		expenses.map((expense) => prisma.expense.create({ data: expense }))
	);

	console.log('Database has been seeded!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
