import { RSI, SuperTrend } from "@debut/indicators";
import { KlineEvent } from "../models/kline-event.model";
import { Kline } from "../models/kline.model";
import { Injectable, ParseFloatPipe } from "@nestjs/common";
import { BinanceDataHandler } from "./data.service";

type Action =  'BUY' | 'SELL' | 'HOLD';

export interface Decision {
    type: Action;
    details?: any;
  }

const RsiConfiguration = {
    period: 14
}

const SupertrendConfiguration = {
    period: 10,
    multiplier: 3
}

@Injectable()
export class BinanceTradingStrategy {

    private rsi: RSI;
    private supertrend: SuperTrend;

    private superCandles: any[];
    private rsiCandles: number[];

    constructor(readonly data: BinanceDataHandler) {}

    recalculate() {
        this.superCandles = [];
        this.rsiCandles = [];

        this.supertrend = new SuperTrend(SupertrendConfiguration.period, SupertrendConfiguration.multiplier);
        this.rsi = new RSI(RsiConfiguration.period);

        this.data.getCandles()
            .forEach(value => {
                this.superCandles.push(
                    this.supertrend.nextValue(parseFloat(value.h), parseFloat(value.l), parseFloat(value.c))
                );

                this.rsiCandles.push(
                    this.rsi.nextValue(parseFloat(value.l))
                );
        });
    }

    process(data: Kline): Decision {

        this.recalculate();

        const supertrend = this.supertrend.momentValue(
            parseFloat(data.h),
            parseFloat(data.l),
            parseFloat(data.c)
        );

        const rsi = this.rsi.momentValue(
            parseFloat(data.l)
        );

        let decision: Action = "HOLD";

        if (rsi >= 50 && supertrend.direction == 1) {
            decision = "BUY";
        }
        else if(rsi <= 50 && supertrend.direction == -1) {
            decision = "SELL";
        }
        else {
            decision = "HOLD";
        }

        return {
            type: decision,
            details: {
                rsi,
                supertrend,
                candles: this.data.getCandles()
                    .map((candle, i) => ({ 
                        ...candle,
                        supertrend: this.superCandles[i]?.direction,
                        rsi: this.rsiCandles[i]
                    }))
            }
        }
    }
}