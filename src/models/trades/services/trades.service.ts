import { Injectable } from '@nestjs/common';
import { TradeRepository } from '../repositories/trade.repository';
import { Trade } from '../entities/trade.entity';
import { DeepPartial, IsNull, Not } from 'typeorm';
import { TradeCreateDto } from '../dtos/create.dto';
import { Exchange } from '../enums/exchange.enum';

@Injectable()
export class TradeService {
   constructor(protected readonly tradeRepository: TradeRepository) {}

   async findAll(): Promise<Trade[]> {
      return await this.tradeRepository.getAllAsync();
   }

   async createTradeAsync(dto: DeepPartial<TradeCreateDto>): Promise<Trade> {
      const trade = this.tradeRepository.create();

      trade.createdAt = new Date();
      trade.details = dto.details;
      trade.exchange = dto.exchange;

      await this.tradeRepository.createEntityAsync(trade);
      return trade;
   }

   async getLastAsync(exchange: Exchange): Promise<Trade> {
      if (!(await this.tradeRepository.countAsync({ exchange }))) {
         return null;
      }

      return this.tradeRepository.getByAsync(
         {},
         {
            where: { exchange },
            order: { createdAt: 'DESC' },
         },
      );
   }
}
