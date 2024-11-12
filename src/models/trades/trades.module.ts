import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { TradesController } from './trades.controller';
import { TradeService } from './services/trades.service';
import { TradeRepository } from './repositories/trade.repository';

@Module({
   imports: [TypeOrmModule.forFeature([Trade])],
   controllers: [TradesController],
   providers: [TradeService, TradeRepository],
   exports: [TradeService],
})
export class TradesModule {}
