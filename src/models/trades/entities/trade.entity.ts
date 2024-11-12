import { CoreEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Exchange } from '../enums/exchange.enum';

@Entity()
export class Trade extends CoreEntity {
   @Column({
      type: 'enum',
      enum: Exchange,
      default: Exchange.Binance,
   })
   exchange: Exchange;

   @Column('json')
   details: Record<string, any>;
}
