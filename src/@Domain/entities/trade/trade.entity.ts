import { BaseDto } from 'src/@Application/dto/base/base.dto';
import { Exchange } from 'src/@Domain/enums/exchange.enum';
import { BaseEntity } from 'src/@Domain/entities/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Trade extends BaseEntity {
   @Column({
      type: 'enum',
      enum: Exchange,
      default: Exchange.Binance,
   })
   exchange: Exchange;

   @Column('json')
   details: Record<string, any>;
}
