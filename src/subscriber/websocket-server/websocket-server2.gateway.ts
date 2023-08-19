import * as Websocket from 'ws';
import {
   WebSocketGateway,
   WebSocketServer,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8081, {
   cors: {
      origin: '*',
   },
})
export class WebSocketServerGateway2 implements OnGatewayConnection, OnGatewayDisconnect {
   private readonly logger = new Logger(WebSocketServerGateway2.name);
   @WebSocketServer() 
   public server: Server;
   public ws: Websocket;

   constructor() {
      this.ws = new Websocket(`wss://stream.binance.com:9443/ws/btcusdt@kline_15m/ethusdt@kline_15m`);

      this.ws.onopen = () => {
         console.log('Connected');
      }

      this.ws.onmessage = (event) => {
         const connectedClients = this.server['clients'] || [];

         for (const connectedClient of connectedClients)  {
            connectedClient.send(event.data);
         }    
      }
   }

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
