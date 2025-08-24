import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as puppeteer from 'puppeteer';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable()
export class ReportsService {
	constructor(
		private prisma: PrismaService,
		private expensesService: ExpensesService
	) {}

	async generateMonthlyReport(userId: string, year: number, month: number) {
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0, 23, 59, 59);

		const [expenses, summary] = await Promise.all([
			this.prisma.expense.findMany({
				where: {
					userId,
					date: {
						gte: startDate,
						lte: endDate,
					},
				},
				include: {
					category: true,
				},
				orderBy: { date: 'desc' },
			}),
			this.expensesService.getExpensesSummary(userId, startDate, endDate),
		]);

		return {
			period: {
				month,
				year,
				startDate,
				endDate,
			},
			summary,
			expenses,
			totalTransactions: expenses.length,
		};
	}

	async generateYearlyReport(userId: string, year: number) {
		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31, 23, 59, 59);

		const monthlyData = await Promise.all(
			Array.from({ length: 12 }, async (_, index) => {
				const month = index + 1;
				const monthStart = new Date(year, index, 1);
				const monthEnd = new Date(year, index + 1, 0, 23, 59, 59);

				const summary = await this.expensesService.getExpensesSummary(
					userId,
					monthStart,
					monthEnd
				);

				return {
					month,
					monthName: monthStart.toLocaleString('pt-BR', { month: 'long' }),
					...summary,
				};
			})
		);

		const yearSummary = await this.expensesService.getExpensesSummary(
			userId,
			startDate,
			endDate
		);

		return {
			year,
			summary: yearSummary,
			monthlyData,
		};
	}

	async generateCSVReport(userId: string, startDate: Date, endDate: Date) {
		const expenses = await this.prisma.expense.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			include: {
				category: true,
			},
			orderBy: { date: 'desc' },
		});

		const csvData = expenses.map((expense) => ({
			date: expense.date.toISOString().split('T')[0],
			description: expense.description,
			amount: expense.amount,
			type: expense.type === 'INCOME' ? 'Receita' : 'Despesa',
			category: expense.category.name,
		}));

		const filename = `financial_report_${
			startDate.toISOString().split('T')[0]
		}_${endDate.toISOString().split('T')[0]}.csv`;

		return {
			data: csvData,
			filename,
		};
	}

	async generatePDFReport(userId: string, startDate: Date, endDate: Date) {
		const [expenses, summary] = await Promise.all([
			this.prisma.expense.findMany({
				where: {
					userId,
					date: {
						gte: startDate,
						lte: endDate,
					},
				},
				include: {
					category: true,
				},
				orderBy: { date: 'desc' },
			}),
			this.expensesService.getExpensesSummary(userId, startDate, endDate),
		]);

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { name: true, email: true },
		});

		const htmlContent = this.generateReportHTML(
			user,
			expenses,
			summary,
			startDate,
			endDate
		);

		const browser = await puppeteer.launch({
			headless: 'new',
		});
		const page = await browser.newPage();
		await page.setContent(htmlContent);
		const pdfBuffer = await page.pdf({
			format: 'A4',
			margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
		});
		await browser.close();

		const filename = `financial_report_${
			startDate.toISOString().split('T')[0]
		}_${endDate.toISOString().split('T')[0]}.pdf`;

		return {
			buffer: pdfBuffer,
			filename,
		};
	}

	private generateReportHTML(
		user: any,
		expenses: any[],
		summary: any,
		startDate: Date,
		endDate: Date
	): string {
		return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório Financeiro</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .expenses-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .expenses-table th, .expenses-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          .expenses-table th { background-color: #f8f9fa; }
          .income { color: #28a745; }
          .expense { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório Financeiro</h1>
          <p><strong>Usuário:</strong> ${user.name} (${user.email})</p>
          <p><strong>Período:</strong> ${startDate.toLocaleDateString(
						'pt-BR'
					)} a ${endDate.toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div class="summary">
          <h2>Resumo Financeiro</h2>
          <p><strong>Total de Receitas:</strong> <span class="income">R$ ${summary.totalIncome.toFixed(
						2
					)}</span></p>
          <p><strong>Total de Despesas:</strong> <span class="expense">R$ ${summary.totalExpenses.toFixed(
						2
					)}</span></p>
          <p><strong>Saldo:</strong> <span class="${
						summary.balance >= 0 ? 'income' : 'expense'
					}">R$ ${summary.balance.toFixed(2)}</span></p>
        </div>

        <h2>Transações</h2>
        <table class="expenses-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${expenses
							.map(
								(expense) => `
              <tr>
                <td>${expense.date.toLocaleDateString('pt-BR')}</td>
                <td>${expense.description}</td>
                <td>${expense.category.name}</td>
                <td>${expense.type === 'INCOME' ? 'Receita' : 'Despesa'}</td>
                <td class="${expense.type.toLowerCase()}">R$ ${expense.amount.toFixed(
									2
								)}</td>
              </tr>
            `
							)
							.join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
	}
}
