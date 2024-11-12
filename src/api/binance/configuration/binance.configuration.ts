import { CandleChartInterval } from 'binance-api-node';

export const BinanceConfiguration = {
   urlBase: 'wss://stream.binance.com:9443/ws/',
   limit: 500,
   interval: CandleChartInterval.ONE_MINUTE,
   symbols: ['btcusdt'],
};
