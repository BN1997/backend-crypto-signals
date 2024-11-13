import { Module } from '@nestjs/common';
import { BinanceModule } from './binance/binance.module';
import { PancakeSwapModule } from './pancakeswap/pancakeswap.module';

@Module({
   imports: [BinanceModule, PancakeSwapModule],
})
export class ApiModule {}
