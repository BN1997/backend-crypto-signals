import {
   WebSocketServer,
   WebSocketGateway,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
   OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BinanceApi } from 'src/@Application/services/binance/binanceApi.service';
import { RSI, SuperTrend } from '@debut/indicators';
import { BaseWebSocketServer } from '@subscriber/websocket-server/baseWebsocketServer';
import { Kline } from './models/kline.model';
import { binancePipeline } from './pipelines/binance.pipeline';
import { BinanceDataHandler } from './services/data.service';
import { BinanceConfiguration } from './configuration/binance.configuration';
import { BinanceOrderService } from './services/order.service';
import { BinanceDecision } from './services/decision.service';
import { BinanceParseStage } from './pipelines/stages/parse.stage';
import * as Websocket from 'ws';

// flow = Parse > Data handler > Decision (Strategy) > Order

@WebSocketGateway(5050, {
   cors: {
      origin: '*',
   },
   namespace: 'BTCUSDT_BINANCE_20M_FULL_VENDIDO',
})
export class BinanceGateway
   extends BaseWebSocketServer
   implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
   constructor(
      readonly api: BinanceApi,
      readonly data: BinanceDataHandler,
      readonly order: BinanceOrderService,
      readonly algorithm: BinanceDecision,
   ) {
      const url =
         BinanceConfiguration.urlBase +
         BinanceConfiguration.symbols[0] +
         `@kline_${BinanceConfiguration.interval}`;
      super(url);
   }

   async afterInit(server: any) {
      await this.data.initializeAsync();
   }

   async onMessage(event: MessageEvent<string>) {
      const { data } = event;

      const pipeline = binancePipeline
         .appendStage(new BinanceParseStage())
         .appendFunction((kline) => this.data.process(kline.k))
         .appendFunction((kline) => this.algorithm.process(kline))
         .appendFunction(async (decision) => await this.order.process(decision))
         .build();

      const candles = await pipeline(data, {});

      this.notifySubscribers([...candles]);
   }

   notifySubscribers(message: any) {
      const text = JSON.stringify(message);

      this.server.emit('message', text);
   }

   protected notifyAllClients(message: string) {
      this.server.sockets.emit('notification', message);
   }

   onOpen(): void {
      console.log('open');
   }
   async handleConnection(client: Socket, ...args: any[]) {
      console.log(`[WEBSOCKET-SERVER]: Socket client ${client.id} conectado`);
   }

   public handleDisconnect(client: Socket) {}
}
