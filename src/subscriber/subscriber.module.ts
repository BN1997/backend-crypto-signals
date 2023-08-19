import { Module } from '@nestjs/common';
import { WebSocketServerGateway } from '@subscriber/websocket-server/websocket-server.gateway';
import { WebSocketServerGateway2 } from './websocket-server/websocket-server2.gateway';

@Module({
   imports: [],
   controllers: [],
   providers: [WebSocketServerGateway,
       WebSocketServerGateway2
      ],
   exports: [],
})
export class SubscriberModule {}
