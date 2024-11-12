import { Injectable } from '@nestjs/common';
import { BinanceApi } from '../binance.api';
import { BinanceConfiguration } from '../configuration/binance.configuration';
import { RSI, SuperTrend } from '@debut/indicators';
import { KlineEvent } from '../models/kline-event.model';
import { Kline } from '../models/kline.model';
import { StrategyResult } from '../models/result.model';

// salvar redis cache
// manipular dados

const RsiConfiguration = {
   period: 14,
};

export const SupertrendConfiguration = {
   period: 10,
   multiplier: 3,
};

@Injectable()
export class BinanceDataHandler {
   private rsi: RSI;
   private supertrend: SuperTrend;

   private lines: Kline[] = [];
   private candles: any[];

   constructor(readonly api: BinanceApi) {}

   process(data: Kline): StrategyResult {
      // Is this the final Kline?
      if (data.x) {
         this.lines.shift();
      } else {
         this.lines.pop();
      }

      this.lines.push(data);

      this.recalculate();

      const supertrend = this.supertrend.momentValue(
         parseFloat(data.h),
         parseFloat(data.l),
         parseFloat(data.c),
      );

      const rsi = this.rsi.momentValue(parseFloat(data.l));

      return { rsi, supertrend, candles: this.candles };
   }

   recalculate() {
      this.candles = [];

      this.supertrend = new SuperTrend(
         SupertrendConfiguration.period,
         SupertrendConfiguration.multiplier,
      );
      this.rsi = new RSI(RsiConfiguration.period);

      this.getLines().forEach((value) => {
         this.candles.push({
            kline: value,
            supertrend: this.supertrend.nextValue(
               parseFloat(value.h),
               parseFloat(value.l),
               parseFloat(value.c),
            ),
            rsi: this.rsi.nextValue(parseFloat(value.l)),
         });
      });
   }

   async initializeAsync() {
      const result = await this.api.getCandlesAsync({
         symbol: 'BTCUSDT',
         interval: BinanceConfiguration.interval,
         limit: BinanceConfiguration.limit,
      });

      this.lines = result.map<Kline>((candle) => ({
         t: candle.openTime,
         T: candle.closeTime,
         x: true,
         c: candle.close,
         h: candle.high,
         i: '15m',
         q: candle.volume,
         Q: candle.quoteVolume,
         o: candle.open,
         s: '',
         l: candle.low,
         v: candle.volume,
      }));

      this.recalculate();
   }

   getCandles() {
      return this.candles;
   }

   getLines() {
      return this.lines;
   }
}
