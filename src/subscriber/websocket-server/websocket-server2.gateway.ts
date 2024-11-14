// import * as Websocket from 'ws';
// import {
//    WebSocketGateway,
//    WebSocketServer,
//    OnGatewayConnection,
//    OnGatewayDisconnect,
//    SubscribeMessage,
//    OnGatewayInit,
// } from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
// import { Server, Socket } from 'socket.io';
// import { BaseWebSocketServer } from './baseWebsocketServer';
// import { BinanceApi } from 'src/api/binance/binance.api';
// import { CandleChartInterval } from 'binance-api-node';
// import { RSI, SuperTrend } from '@debut/indicators';
// import { parse } from 'path';

// const BinanceConfigurations = {
//    BINANCE_URL_BTC_USDT: "wss://stream.binance.com:9443/ws/btcusdt@kline_15m/ethusdt@kline_15m",
//  }

//  interface Kline {
//    t: number;  // Open time
//    T: number;  // Close time
//    s: string;  // Symbol
//    i: string;  // Interval
//    o: string;  // Open price
//    c: string;  // Close price
//    h: string;  // High price
//    l: string;  // Low price
//    v: string;  // Volume
//    x: boolean; // Is this the final kline?
//    q: string;  // Quote asset volume
// }

// interface KlineEvent {
//    e: string;  // Event type
//    E: number;  // Event time
//    s: string;  // Symbol
//    k: Kline;   // Kline data

//    R?: string; // RSI
//    T?: string; // Super
// }

// const configuration = {
//    urlBase:'wss://stream.binance.com:9443/ws/',
//    limit: 90,
//    interval: CandleChartInterval.FIFTEEN_MINUTES,
//    symbols: [
//       'btcusdt'
//    ]
// };

// @WebSocketGateway(8081, {
//    cors: {
//       origin: '*',
//    },
// })
// export class BinanceGateway extends BaseWebSocketServer implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

//    private lines: Kline[] = [];
//    private supertrendIndicator: SuperTrend;
//    private rsiIndicator: RSI;

//    private readonly _symbol = configuration.symbols[0];

//    constructor(readonly api: BinanceApi) {
//       const url = configuration.urlBase  + configuration.symbols[0] + `@kline_${configuration.interval}`;
//       super(url);
//    }

//    afterInit(server: any) {
//       this.api.getCandlesAsync({
//          symbol: "BTCUSDT",
//          interval: configuration.interval,
//          limit: configuration.limit
//        })
//       .then(result => this.lines = result.map<Kline>(candle => ({
//             t: candle.openTime, T: candle.closeTime, x: true,
//             c: candle.close, h: candle.high, i: '15m',
//             q: candle.volume, Q: candle.quoteVolume, o: candle.open,
//             s: this._symbol, l: candle.low, v: candle.volume
//          }))
//       );

//       this.recalculate();
//    }

//    recalculate() {
//       this.supertrendIndicator = new SuperTrend(10, 3);
//       this.rsiIndicator = new RSI(14);

//       this.lines.forEach(value => {
//          this.supertrendIndicator.nextValue(parseFloat(value.h), parseFloat(value.l), parseFloat(value.c));
//          this.rsiIndicator.nextValue(parseFloat(value.l));
//       });
//    }

//    onMessage(event: MessageEvent): void {
//       const { data } = event;
//       const kline = JSON.parse(data) as KlineEvent;

//       // Is this the final Kline?
//       if (kline.k.x) {
//          this.lines.shift();
//          this.lines.push(kline.k);
//          this.recalculate();
//       }

//       const supertrend = this.supertrendIndicator.momentValue(
//          parseFloat(kline.k.h),
//          parseFloat(kline.k.l),
//          parseFloat(kline.k.c)
//       );
//       const rsi = this.rsiIndicator.momentValue(
//          parseFloat(kline.k.l)
//       );

//       var _data = {
//          ...kline,
//          rsi,
//          supertrend
//       }

//       // PRIMEIRO BOT
//       // rsi - 0  - 30
//       // ultimo preço comprado 50.000

//       // SEGUNDO BOT
//       // supertrend
//       // cond: criar ordem de venda (STOP)

//       // TERCEIRO BOT
//       // supertrend
//       // cond: criar ordem de venda (alvo)
//       // cond: criar ordem de venda (STOP)

//       this.notifySubscribers(JSON.stringify((_data)));
//    }

//    notifySubscribers(message: any) {
//       const connectedClients = this.getClients();

//       // connectedClients.emit(message);

//       // for (const connectedClient of connectedClients)  {
//       //    console.table(message);
//       //    connectedClient.send(message);
//       // }
//    }

//    onOpen(): void {
//       console.log('open');
//    }
//    async handleConnection(client: Socket, ...args: any[]) {
//       console.log(`[WEBSOCKET-SERVER]: Socket client ${client.id} conectado`);
//    }
//    public handleDisconnect(client: Socket) {
//    }
//    @SubscribeMessage('message')
//    public handleMessage(client: Socket, payload: any): void {
//       console.log(`Messagem ${JSON.stringify(payload)} do socket client: ${client.id}`);
//    }
// }
