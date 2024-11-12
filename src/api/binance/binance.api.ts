import Binance, {
   Account,
   CandleChartResult,
   CandlesOptions,
   Binance as IBinance,
   NewOrderSpot,
} from 'binance-api-node';
import { Injectable } from '@nestjs/common';

// Authenticated client, can make signed calls
@Injectable()
export class BinanceApi {
   private readonly client: IBinance;

   constructor() {
      this.client = Binance({
         apiKey: 'LTktwoC5j6ao47P90bdfhnBrcO8PAw0vVe2Dx9sQEcONiLI8I1TB8qOzJUvu8MRF',
         apiSecret: 'AOV0Us4dWlp8hN2tgf3Yrd4w2Ydc9xdSKtQhXCjThKEXLEXRjb7oNIiiwBV3T9nJ',
         getTime: () => 10000,
      });
   }

   public getAccountInfo(): Promise<Account> {
      return this.client.accountInfo({ useServerTime: true });
   }

   public orderAsync(options: NewOrderSpot) {
      return this.client.order(options);
   }

   public getCandlesAsync(options: CandlesOptions): Promise<CandleChartResult[]> {
      return this.client.candles(options);
   }

   // public getOrderBook(symbol: string, limit: number): Promise<BinanceOrderBook> {
   // return this.client.getOrder(symbol, limit);
   // }

   // public getTicker(symbol: string): Promise<BinanceTicker> {
   // return this.client.getTicker(symbol);
   // }

   // public getTrades(symbol: string, limit: number): Promise<BinanceTrades> {
   // return this.client.getTrades(symbol, limit);
   // }

   // public placeOrder(symbol: string, side: BinanceSide, quantity: number, price: number): Promise<BinanceOrder> {
   // return this.client.placeOrder(symbol, side, quantity, price);
   // }

   // public cancelOrder(orderId: string): Promise<void> {
   // return this.client.cancelOrder(orderId);
   // }

   // public getOpenOrders(symbol: string): Promise<BinanceOpenOrders> {
   // return this.client.getOpenOrders(symbol);
   // }

   // public getClosedOrders(symbol: string, limit: number): Promise<BinanceClosedOrders> {
   // return this.client.getClosedOrders(symbol, limit);
   // }

   // public getDepositAddress(asset: string): Promise<BinanceDepositAddress> {
   // return this.client.getDepositAddress(asset);
   // }

   // public getWithdrawalHistory(asset: string, limit: number): Promise<BinanceWithdrawalHistory> {
   // return this.client.getWithdrawalHistory(asset, limit);
   // }

   // public getDepositHistory(asset: string, limit: number): Promise<BinanceDepositHistory> {
   // return this.client.getDepositHistory(asset, limit);
   // }
}
