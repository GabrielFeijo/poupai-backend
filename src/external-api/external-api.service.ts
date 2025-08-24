import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalApiService {
	private readonly logger = new Logger(ExternalApiService.name);

	constructor(private httpService: HttpService) {}

	async getCurrencyRates() {
		try {
			const response = await firstValueFrom(
				this.httpService.get('https://api.exchangerate-api.com/v4/latest/USD')
			);

			return {
				base: response.data.base,
				date: response.data.date,
				rates: {
					BRL: response.data.rates.BRL,
					EUR: response.data.rates.EUR,
					GBP: response.data.rates.GBP,
					JPY: response.data.rates.JPY,
				},
			};
		} catch (error) {
			this.logger.error('Failed to fetch currency rates', error);
			return {
				base: 'USD',
				date: new Date().toISOString().split('T')[0],
				rates: {
					BRL: 5.2,
					EUR: 0.85,
					GBP: 0.73,
					JPY: 110.0,
				},
			};
		}
	}

	async getCryptoPrices() {
		try {
			const response = await firstValueFrom(
				this.httpService.get(
					'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd,brl'
				)
			);

			return {
				bitcoin: {
					usd: response.data.bitcoin.usd,
					brl: response.data.bitcoin.brl,
				},
				ethereum: {
					usd: response.data.ethereum.usd,
					brl: response.data.ethereum.brl,
				},
				litecoin: {
					usd: response.data.litecoin.usd,
					brl: response.data.litecoin.brl,
				},
				lastUpdate: new Date().toISOString(),
			};
		} catch (error) {
			this.logger.error('Failed to fetch crypto prices', error);
			return {
				bitcoin: { usd: 45000, brl: 234000 },
				ethereum: { usd: 3000, brl: 15600 },
				litecoin: { usd: 100, brl: 520 },
				lastUpdate: new Date().toISOString(),
			};
		}
	}
}
