import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsNumber,
	IsDateString,
	IsEnum,
	IsNotEmpty,
} from 'class-validator';
import { ExpenseType } from '@prisma/client';

export class CreateExpenseDto {
	@ApiProperty({ example: 'Compra no supermercado' })
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({ example: 150.5 })
	@IsNumber()
	amount: number;

	@ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
	@IsDateString()
	date: string;

	@ApiProperty({ example: 'EXPENSE', enum: ExpenseType })
	@IsEnum(ExpenseType)
	type: ExpenseType;

	@ApiProperty({ example: '507f1f77bcf86cd799439011' })
	@IsString()
	@IsNotEmpty()
	categoryId: string;
}
