import {
	Controller,
	Get,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	findAll() {
		return this.usersService.findAll();
	}

	@Get('me')
	@ApiOperation({ summary: 'Get current user' })
	getMe(@Request() req) {
		return this.usersService.findOne(req.user.id);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID' })
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update user' })
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete user' })
	remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}
}
