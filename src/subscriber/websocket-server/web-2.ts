import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    OnGatewayInit
 } from '@nestjs/websockets';
 import { Logger } from '@nestjs/common';
 import { Server, Socket } from 'socket.io';
 import * as Websocket from 'ws';
 

@WebSocketGateway(8082, {
    cors: {
       origin: '*',
    },
 })
 export class WebSocketServerGateway2 implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
 
    readonly client: WebSocket;
 
    constructor() {
       this.client = new Websocket(`wss://stream.binance.com:9443/ws/btcusdt@kline_15m`);
 
       this.client.onopen = function () {
          console.log('Connected');
       };
    }
    
    afterInit(server: any) {
    }
 
 
    private readonly logger = new Logger(WebSocketServerGateway2.name);
 
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
 