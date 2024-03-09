import {
   WebSocketGateway,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
   OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BinanceApi } from 'src/api/binance/binance.api';
import { RSI, SuperTrend } from '@debut/indicators';
import { BaseWebSocketServer } from '@subscriber/websocket-server/baseWebsocketServer';
import { Kline } from './models/kline.model';
import { binancePipeline } from './pipelines/binance.pipeline';
import { BinanceDataHandler } from './services/data.service';
import { BinanceConfiguration } from './configuration/binance.configuration';
import { BinanceOrderService } from './services/order.service';
import { BinanceTradingStrategy } from './services/decision.service';
import { BinanceParseStage } from './pipelines/stages/parse.stage';

// flow = Parse > Data handler > Decision (Strategy) > Order 

@WebSocketGateway(8031, {
   cors: {
      origin: '*',
   },
})
export 
class BinanceGateway extends BaseWebSocketServer implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
   constructor(
      readonly api: BinanceApi,
      readonly data: BinanceDataHandler,
      readonly order: BinanceOrderService,
      readonly algorithm: BinanceTradingStrategy
   ) {
      super(BinanceConfiguration.urlBase  + BinanceConfiguration.symbols[0] + `@kline_${BinanceConfiguration.interval}`);
   }

   async afterInit(server: any) {
      this.data.initializeAsync().then(() =>
         this.algorithm.recalculate()
      );
   }

   onMessage(event: MessageEvent<string>): void {   
      const { data } = event;

      const pipeline = binancePipeline
         .appendStage(new BinanceParseStage())
         .appendFunction((kline) =>
            this.data.process(kline.k)
         )
         .appendFunction((kline) => 
            this.algorithm.process(kline)
         ) 
         .appendFunction((decision) => 
            this.order.process(decision)
         )
         .build();

      const candles = pipeline(data, {});
       
      this.notifySubscribers([ ...candles ]);
   }

   notifySubscribers(message: any) {
      const text = JSON.stringify(message);
      const connectedClients = this.getClients() as any; 
      
      for (const connectedClient of connectedClients)  {
         console.table(text);
         connectedClient.send(text);
      }   
   }

   onOpen(): void {
      console.log('open');
   }
   async handleConnection(client: Socket, ...args: any[]) {
      console.log(`[WEBSOCKET-SERVER]: Socket client ${client.id} conectado`);
   }
   public handleDisconnect(client: Socket) {
   }
   @SubscribeMessage('message')
   public handleMessage(client: Socket, payload: any): void {
      console.log(`Messagem ${JSON.stringify(payload)} do socket client: ${client.id}`);
   }
}
