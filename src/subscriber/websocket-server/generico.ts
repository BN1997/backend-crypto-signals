import {
   WebSocketGateway,
   WebSocketServer,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
   OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as Websocket from 'ws';

function createWebSocketGateway<T>(port: number) {
   @WebSocketGateway(port, {
      cors: {
         origin: '*',
      },
   })
   class CustomWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
      readonly client: WebSocket;

      constructor() {
         this.client = new Websocket(`wss://stream.binance.com:9443/ws/btcusdt@kline_15m`);

         this.client.onopen = function () {
            console.log('Connecteds');
         };

         this.client.onmessage = function (e) {
            console.log('e', e);
         };
      }

      afterInit(server: any) {}

      private readonly logger = new Logger(CustomWebSocketGateway.name);
      @WebSocketServer() public server: Server;

      async handleConnection(client: Socket, ...args: any[]) {
         console.log(`[WEBSOCKET-SERVER]: Socket client ${client.id} conectado`);
      }

      public handleDisconnect(client: Socket) {
         this.logger.log(`[WEBSOCKET-SERVER]: Delete Socket client ${client.id}`);
      }

      @SubscribeMessage('message')
      public handleMessage(client: Socket, payload: any): void {
         console.log(`Messagem ${JSON.stringify(payload)} do socket client: ${client.id}`);
      }
   }

   return CustomWebSocketGateway;
}
