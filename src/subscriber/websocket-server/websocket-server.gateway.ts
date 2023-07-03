import {
   WebSocketGateway,
   WebSocketServer,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { io } from 'socket.io-client'; // Certifique-se de ter o pacote 'socket.io-client' instalado
import * as Websocket from 'ws';

@WebSocketGateway(8080, {
   cors: {
      origin: '*',
   },
})
export class WebSocketServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
   private readonly logger = new Logger(WebSocketServerGateway.name);
   @WebSocketServer() public server: Server;

   async handleConnection(client: Socket, ...args: any[]) {
      console.log(`[WEBSOCKET-SERVER]: Socket client ${client.id} conectado`);

      const ws = new Websocket(`wss://stream.binance.com:9443/ws/btcusdt@kline_15m`);

      ws.onopen = function () {
         console.log('Connected');

         ws.onmessage = function (event) {
            console.log(event.data);
            client.send(event.data);
         };
      };
   }

   public handleDisconnect(client: Socket) {
      this.logger.log(`[WEBSOCKET-SERVER]: Delete Socket client ${client.id}`);
   }

   @SubscribeMessage('message')
   public handleMessage(client: Socket, payload: any): void {
      console.log(`Messagem ${JSON.stringify(payload)} do socket client: ${client.id}`);
   }
}
