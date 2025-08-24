import {
	Controller,
	Get,
	Query,
	UseGuards,
	Request,
	Res,
	BadRequestException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Get('monthly')
	@ApiOperation({ summary: 'Generate monthly report' })
	@ApiQuery({ name: 'year', type: Number })
	@ApiQuery({ name: 'month', type: Number })
	generateMonthlyReport(
		@Query('year') year: string,
		@Query('month') month: string,
		@Request() req
	) {
		const yearNum = parseInt(year);
		const monthNum = parseInt(month);

		if (!yearNum || !monthNum || monthNum < 1 || monthNum > 12) {
			throw new BadRequestException('Invalid year or month');
		}

		return this.reportsService.generateMonthlyReport(
			req.user.id,
			yearNum,
			monthNum
		);
	}

	@Get('yearly')
	@ApiOperation({ summary: 'Generate yearly report' })
	@ApiQuery({ name: 'year', type: Number })
	generateYearlyReport(@Query('year') year: string, @Request() req) {
		const yearNum = parseInt(year);

		if (!yearNum) {
			throw new BadRequestException('Invalid year');
		}

		return this.reportsService.generateYearlyReport(req.user.id, yearNum);
	}

	@Get('export/csv')
	@ApiOperation({ summary: 'Export expenses to CSV' })
	@ApiQuery({ name: 'startDate', type: String })
	@ApiQuery({ name: 'endDate', type: String })
	async exportCSV(
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Request() req,
		@Res() res: Response
	) {
		if (!startDate || !endDate) {
			throw new BadRequestException('Start date and end date are required');
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		const report = await this.reportsService.generateCSVReport(
			req.user.id,
			start,
			end
		);

		res.setHeader('Content-Type', 'text/csv');
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="${report.filename}"`
		);

		const csvHeader = 'Data,Descrição,Valor,Tipo,Categoria\n';
		const csvRows = report.data
			.map(
				(row) =>
					`${row.date},"${row.description}",${row.amount},${row.type},"${row.category}"`
			)
			.join('\n');

		res.send(csvHeader + csvRows);
	}

	@Get('export/pdf')
	@ApiOperation({ summary: 'Export expenses to PDF' })
	@ApiQuery({ name: 'startDate', type: String })
	@ApiQuery({ name: 'endDate', type: String })
	async exportPDF(
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string,
		@Request() req,
		@Res() res: Response
	) {
		if (!startDate || !endDate) {
			throw new BadRequestException('Start date and end date are required');
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		const report = await this.reportsService.generatePDFReport(
			req.user.id,
			start,
			end
		);

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="${report.filename}"`
		);
		res.send(report.buffer);
	}
}
