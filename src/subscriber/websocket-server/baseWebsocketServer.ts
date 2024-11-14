import { Server, Socket } from 'socket.io';
import * as Websocket from 'ws';
import {
   WebSocketGateway,
   WebSocketServer,
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
} from '@nestjs/websockets';

export interface Teste {
   onMessage(...args: any[]): any;
   onOpen(): void;
}

export abstract class BaseWebSocketServer implements Teste {
   @WebSocketServer()
   public server: Server;
   public ws: Websocket;

   public url: string;

   constructor(url) {
      this.url = url;
      this.initilizateWebSocket();
   }

   abstract onMessage(event): void;

   abstract onOpen(): void;

   protected initilizateWebSocket() {
      this.ws = new Websocket(this.url);
      this.ws.onopen = () => this.onOpen();
      this.ws.onmessage = (event) => this.onMessage(event);
   }

   protected getClients = () => this.server.sockets;
}
