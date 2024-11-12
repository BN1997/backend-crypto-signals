import { Exchange } from '../enums/exchange.enum';

export class TradeCreateDto {
   details: Record<string, any>;
   exchange: Exchange;
}
