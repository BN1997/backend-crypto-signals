interface KlineData {
   t: number;
   o: string;
   h: string;
   l: string;
   c: string;
   v: string;
   n: number;
   x: boolean;
}

class SupertrendCalculator {
   private multiplier: number;
   private period: number;
   private atrMultiplier: number;
   private prevATR: number;
   private prevUpperBand: number;
   private prevLowerBand: number;
   private prevClose: number;
   private isInLongTrend: boolean;

   constructor(multiplier = 1.5, period = 14, atrMultiplier = 1.5) {
      this.multiplier = multiplier;
      this.period = period;
      this.atrMultiplier = atrMultiplier;
      this.reset();
   }

   private reset() {
      this.prevATR = 0;
      this.prevUpperBand = 0;
      this.prevLowerBand = 0;
      this.prevClose = 0;
      this.isInLongTrend = false;
   }

   public calculateSupertrend(kline: KlineData): string {
      const atr = this.calculateAverageTrueRange(kline);
      const closePrice = parseFloat(kline.c);

      const upperBand = parseFloat(kline.h) + this.multiplier * atr;
      const lowerBand = parseFloat(kline.l) - this.multiplier * atr;

      const isBullishTrend = closePrice > this.prevUpperBand;
      const isBearishTrend = closePrice < this.prevLowerBand;

      const isBullishTrendNew = isBullishTrend && this.prevClose > this.prevUpperBand;
      const isBearishTrendNew = isBearishTrend && this.prevClose < this.prevLowerBand;

      if (isBullishTrendNew) {
         this.isInLongTrend = true;
      } else if (isBearishTrendNew) {
         this.isInLongTrend = false;
      }

      const supertrend = this.isInLongTrend ? upperBand : lowerBand;

      // Update state for the next iteration
      this.prevATR = atr;
      this.prevUpperBand = upperBand;
      this.prevLowerBand = lowerBand;
      this.prevClose = closePrice;

      return supertrend.toFixed(8);
   }

   private calculateAverageTrueRange(kline: KlineData): number {
      const high = parseFloat(kline.h);
      const low = parseFloat(kline.l);
      const previousClose = this.prevClose;
      const tr1 = high - low;
      const tr2 = Math.abs(high - previousClose);
      const tr3 = Math.abs(low - previousClose);
      const trueRange = Math.max(tr1, tr2, tr3);

      // Calculate Average True Range (ATR) using Wilder's smoothing method
      const atr = (this.prevATR * (this.period - 1) + trueRange) / this.period;

      return atr;
   }
}
