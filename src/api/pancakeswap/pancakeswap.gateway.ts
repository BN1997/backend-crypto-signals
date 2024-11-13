import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(5050, {
   cors: {
      origin: '*',
   },
   namespace: 'BTCUSDT_BINANCE_20M_FULL_VENDIDO',
})
export class PancakeSwapGateway implements OnGatewayInit {
   async afterInit(server: any) {
      console.log('init panckeswap');
   }
}
