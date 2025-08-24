import { ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsOptional,
	IsString,
	IsNumber,
	IsEnum,
	IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseType } from '@prisma/client';

export class ExpenseQueryDto {
	@ApiPropertyOptional({ example: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	page?: number;

	@ApiPropertyOptional({ example: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	limit?: number;

	@ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
	@IsOptional()
	@IsDateString()
	startDate?: string;

	@ApiPropertyOptional({ example: '2024-12-31T23:59:59.999Z' })
	@IsOptional()
	@IsDateString()
	endDate?: string;

	@ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
	@IsOptional()
	@IsString()
	categoryId?: string;

	@ApiPropertyOptional({ example: 'EXPENSE', enum: ExpenseType })
	@IsOptional()
	@IsEnum(ExpenseType)
	type?: ExpenseType;

	@ApiPropertyOptional({ example: 0 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	minAmount?: number;

	@ApiPropertyOptional({ example: 1000 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	maxAmount?: number;

	@ApiPropertyOptional({ example: 'supermercado' })
	@IsOptional()
	@IsString()
	search?: string;
}
