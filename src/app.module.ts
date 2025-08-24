import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';
import { ExternalApiModule } from './external-api/external-api.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 60000, // 1 minute
					limit: 100, // 100 requests per minute
				},
			],
		}),
		PrismaModule,
		AuthModule,
		UsersModule,
		CategoriesModule,
		ExpensesModule,
		ReportsModule,
		ExternalApiModule,
	],
})
export class AppModule {}
