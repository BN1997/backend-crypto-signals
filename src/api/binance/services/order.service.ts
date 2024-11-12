import { Injectable, OnModuleInit } from '@nestjs/common';
import { BinanceApi } from '../binance.api';
import { Decision } from './decision.service';
import { TradeService } from 'src/models/trades/services/trades.service';
import { TradeCreateDto } from 'src/models/trades/dtos/create.dto';
import { Exchange } from 'src/models/trades/enums/exchange.enum';

@Injectable()
export class BinanceOrderService implements OnModuleInit {
   private isBought = false;
   private isSold = false;

   constructor(private readonly api: BinanceApi, private readonly tradeService: TradeService) {}

   onModuleInit() {
      this.configureAsync();
   }

   async configureAsync() {
      const lastTrade = await this.tradeService.getLastAsync(Exchange.Binance);

      const type = lastTrade?.details['type'] ?? 'HOLD';
      this.isBought = type == 'BUY';
      this.isSold = type == 'SELL';
   }

   async process(data: Decision) {
      const { type, details } = data;

      if (type == 'BUY' && !this.isBought) {
         this.log(data);
         await this.buy(data);
         this.isBought = true;
         this.isSold = false;
      } else if (type == 'SELL' && !this.isSold) {
         this.log(data);
         await this.sell(data);
         this.isSold = true;
         this.isBought = false;
      }
      // this.log(data);

      return details.candles;
   }

   log(data) {
      console.log(JSON.stringify({ datetime: new Date().toLocaleDateString(), ...data }));
   }

   async buy(data) {
      await this.tradeService.createTradeAsync({
         details: data,
         exchange: Exchange.Binance,
      });

      console.log('BUY'); // realizar compra e ordem de venda num valor abaixo (10% - 5%)
   }

   async sell(data) {
      await this.tradeService.createTradeAsync({
         details: data,
         exchange: Exchange.Binance,
      });

      console.log('SELL');
      // this.api. ({
      //     price: data.details.price,
      //     quantity: '0.001',
      //     quoteOrderQty
      // })
      // this.api.order({

      // })
   }
}
