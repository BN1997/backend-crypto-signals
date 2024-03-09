import { Injectable } from "@nestjs/common";
import { BinanceApi } from "../binance.api";
import { Kline } from "../models/kline.model";
import { BinanceConfiguration } from "../configuration/binance.configuration";

// salvar redis cache
// manipular dados

@Injectable() 
export class BinanceDataHandler {
  private lines: Kline[] = [];

  constructor(readonly api: BinanceApi) {
    
  }

    process(data: Kline) {

    // Is this the final Kline?
    if (data.x) {
      this.lines.shift();
    }
    else {
      this.lines.pop();
    }

    this.lines.push(data);

    return data;
  }

  async initializeAsync() {
    const result = await this.api.getCandlesAsync({
      symbol: "BTCUSDT",
      interval: BinanceConfiguration.interval,
      limit: BinanceConfiguration.limit 
    });

    this.lines = result.map<Kline>(candle => ({
         t: candle.openTime,
         T: candle.closeTime,
         x: true,
         c: candle.close,
         h: candle.high,
         i: '15m',
         q: candle.volume,
         Q: candle.quoteVolume,
         o: candle.open,
         s: "",
         l: candle.low,
         v: candle.volume
      }));
  }

  getCandles() {
    return this.lines;
  }
}