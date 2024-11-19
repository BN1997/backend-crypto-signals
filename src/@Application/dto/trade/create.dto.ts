//import { Exchange } from '../enums/exchange.enum';

export enum Exchange {
   Default = 1,
   Binance = 2,
   BingX = 3,
}

export class TradeCreateDto {
   details: Record<string, any>;
   exchange: Exchange;
}
