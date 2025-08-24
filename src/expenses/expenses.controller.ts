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
	Query,
} from '@nestjs/common';
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
	constructor(private readonly expensesService: ExpensesService) {}

	@Post()
	@ApiOperation({ summary: 'Create expense' })
	create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
		return this.expensesService.create(createExpenseDto, req.user.id);
	}

	@Get()
	@ApiOperation({ summary: 'Get all expenses' })
	findAll(@Query() query: ExpenseQueryDto, @Request() req) {
		return this.expensesService.findAll(req.user.id, query);
	}

	@Get('summary')
	@ApiOperation({ summary: 'Get expenses summary' })
	@ApiQuery({ name: 'startDate', required: false, type: Date })
	@ApiQuery({ name: 'endDate', required: false, type: Date })
	getSummary(
		@Query('startDate') startDate?: string,
		@Query('endDate') endDate?: string,
		@Request() req?
	) {
		const start = startDate ? new Date(startDate) : undefined;
		const end = endDate ? new Date(endDate) : undefined;
		return this.expensesService.getExpensesSummary(req.user.id, start, end);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get expense by ID' })
	findOne(@Param('id') id: string, @Request() req) {
		return this.expensesService.findOne(id, req.user.id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update expense' })
	update(
		@Param('id') id: string,
		@Body() updateExpenseDto: UpdateExpenseDto,
		@Request() req
	) {
		return this.expensesService.update(id, updateExpenseDto, req.user.id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete expense' })
	remove(@Param('id') id: string, @Request() req) {
		return this.expensesService.remove(id, req.user.id);
	}
}
