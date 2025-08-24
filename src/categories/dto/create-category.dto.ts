import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsHexColor, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
	@ApiProperty({ example: 'Alimentação' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: '#FF6B6B' })
	@IsHexColor()
	color: string;

	@ApiProperty({
		example: 'Gastos com alimentação e bebidas',
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;
}
