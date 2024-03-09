import { Module } from '@nestjs/common';
import { WebSocketServerGateway } from '@subscriber/websocket-server/websocket-server.gateway';
import { BinanceGateway } from './websocket-server/websocket-server2.gateway';
import { BinanceApi } from 'src/api/binance/binance.api';
import { ApiModule } from 'src/api/api.module';

@Module({
   imports: [ApiModule],
   controllers: [],
   providers: [WebSocketServerGateway,
       BinanceGateway
      ],
   exports: [],
})
export class SubscriberModule {}
