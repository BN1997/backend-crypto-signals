import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/repositories/base.repository';
import { Trade } from '../entities/trade.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TradeRepository extends BaseRepository<Trade> {
   constructor(
      @InjectRepository(Trade)
      protected readonly repository: Repository<Trade>,
   ) {
      super(repository);
   }

   establishAllRelationships() {
      return this;
   }
}
