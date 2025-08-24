import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'John Doe' })
	@IsString()
	name: string;

	@ApiProperty({ example: 'password123', minimum: 6 })
	@IsString()
	@MinLength(6)
	password: string;
}
