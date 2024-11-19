import { Module } from '@nestjs/common';
import { BinanceController } from 'src/@Application/controllers/binance.controller';
import { BinanceApi } from 'src/@Application/services/binance/binanceApi.service';
//import { BinanceApi } from './binance.api';
import { BinanceDataHandler } from './services/data.service';
import { BinanceOrderService } from './services/order.service';
import { BinanceDecision } from './services/decision.service';
import { BinanceGateway } from './binance.gateway';
import { TradesModule } from 'src/models/trades/trades.module';

@Module({
   controllers: [BinanceController],
   providers: [BinanceApi, BinanceDataHandler, BinanceOrderService, BinanceDecision, BinanceGateway],
   imports: [TradesModule],
   exports: [BinanceApi],
})
export class BinanceModule {}
