import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	@ApiOperation({ summary: 'Create category' })
	create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
		return this.categoriesService.create(createCategoryDto, req.user.id);
	}

	@Get()
	@ApiOperation({ summary: 'Get all categories' })
	findAll(@Request() req) {
		return this.categoriesService.findAll(req.user.id);
	}

	@Get('stats')
	@ApiOperation({ summary: 'Get categories with statistics' })
	getCategoriesWithStats(@Request() req) {
		return this.categoriesService.getCategoriesWithStats(req.user.id);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get category by ID' })
	findOne(@Param('id') id: string, @Request() req) {
		return this.categoriesService.findOne(id, req.user.id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update category' })
	update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@Request() req
	) {
		return this.categoriesService.update(id, updateCategoryDto, req.user.id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete category' })
	remove(@Param('id') id: string, @Request() req) {
		return this.categoriesService.remove(id, req.user.id);
	}
}
