import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
	imports: [PrismaModule, ExpensesModule],
	controllers: [ReportsController],
	providers: [ReportsService],
})
export class ReportsModule {}
