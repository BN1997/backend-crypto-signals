import { Module } from '@nestjs/common';
import { BinanceApi } from './binance/binance.api';
// import { EventsGateway } from './binance/binance2.gateway';
import { BinanceGateway } from './binance/binance.gateway';
import { BinanceController } from './binance/binance.controller';
import { BinanceDataHandler } from './binance/services/data.service';
import { BinanceOrderService } from './binance/services/order.service';
import { BinanceDecision } from './binance/services/decision.service';
import { TradeService } from 'src/models/trades/services/trades.service';
import { TradeRepository } from 'src/models/trades/repositories/trade.repository';
import { TradesModule } from 'src/models/trades/trades.module';

@Module({
   controllers: [BinanceController],
   providers: [
      BinanceApi,
      BinanceDataHandler,
      BinanceOrderService,
      BinanceDecision,
      //EventsGateway,
      BinanceGateway,
   ],
   imports: [TradesModule],
   exports: [BinanceApi],
})
export class ApiModule {}
