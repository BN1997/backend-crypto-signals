import { Kline } from './kline.model';
import { SuperTrendResult } from './supertrend.model';

export interface StrategyResult {
   supertrend: SuperTrendResult;
   rsi: number;

   candles: KlineResult[];
}

export interface KlineResult extends Kline {
   supertrend: SuperTrendResult;
   rsi: number;
}
