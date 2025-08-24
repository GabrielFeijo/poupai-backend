import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExternalApiService } from './external-api.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('external-api')
@Controller('external-api')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExternalApiController {
	constructor(private readonly externalApiService: ExternalApiService) {}

	@Get('currencies')
	@ApiOperation({ summary: 'Get currency exchange rates' })
	async getCurrencyRates() {
		return await this.externalApiService.getCurrencyRates();
	}

	@Get('crypto')
	@ApiOperation({ summary: 'Get cryptocurrency prices' })
	getCryptoPrices() {
		return this.externalApiService.getCryptoPrices();
	}
}
