import { RSI, SuperTrend } from '@debut/indicators';
import { KlineEvent } from '../models/kline-event.model';
import { Kline } from '../models/kline.model';
import { Injectable, ParseFloatPipe } from '@nestjs/common';
import { BinanceDataHandler } from './data.service';
import { StrategyResult } from '../models/result.model';

type Action = 'BUY' | 'SELL' | 'HOLD';

export interface Decision {
   type: Action;
   details?: StrategyResult;
}

@Injectable()
export class BinanceDecision {
   process(result: StrategyResult): Decision {
      const { rsi, supertrend } = result;

      let decision: Action = 'HOLD';

      if (rsi >= 50 && supertrend.direction == 1) {
         decision = 'BUY';
      } else if (rsi <= 50 && supertrend.direction == -1) {
         decision = 'SELL';
      } else {
         decision = 'HOLD';
      }

      // console.log("strategy", decision, rsi, supertrend)

      return {
         type: decision,
         details: result,
      };
   }
}
