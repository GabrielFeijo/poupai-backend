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

	async getBrazilianIndices() {
		try {
			// Simulação de dados de índices brasileiros (IBOVESPA, CDI, IPCA)
			// Em produção, você conectaria com APIs reais como HG Finance, Alpha Vantage, etc.
			const mockData = {
				ibovespa: {
					value: 120000 + Math.random() * 5000,
					change: (Math.random() - 0.5) * 2000,
					changePercent: (Math.random() - 0.5) * 4,
					lastUpdate: new Date().toISOString(),
				},
				cdi: {
					value: 13.75,
					annualRate: 13.75,
					lastUpdate: new Date().toISOString(),
				},
				ipca: {
					monthly: 0.32,
					yearly: 4.68,
					lastUpdate: new Date().toISOString(),
				},
				selic: {
					value: 13.75,
					lastUpdate: new Date().toISOString(),
				},
			};

			return mockData;
		} catch (error) {
			this.logger.error('Failed to fetch Brazilian indices', error);
			return null;
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

	async getFinancialNews() {
		try {
			// Mock data - em produção, conecte com NewsAPI, Financial Times, etc.
			const mockNews = [
				{
					title: 'Mercado financeiro apresenta volatilidade',
					summary:
						'Principais índices apresentaram oscilações significativas...',
					source: 'InfoMoney',
					publishedAt: new Date().toISOString(),
					url: 'https://example.com/news1',
				},
				{
					title: 'Banco Central mantém taxa Selic',
					summary: 'Taxa básica de juros permanece inalterada...',
					source: 'Valor Econômico',
					publishedAt: new Date(Date.now() - 3600000).toISOString(),
					url: 'https://example.com/news2',
				},
				{
					title: 'Dólar opera em alta contra o Real',
					summary: 'Moeda americana se valoriza frente ao real...',
					source: 'G1',
					publishedAt: new Date(Date.now() - 7200000).toISOString(),
					url: 'https://example.com/news3',
				},
			];

			return mockNews;
		} catch (error) {
			this.logger.error('Failed to fetch financial news', error);
			return [];
		}
	}
}
