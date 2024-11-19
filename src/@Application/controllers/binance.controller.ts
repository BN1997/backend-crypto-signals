import { PublicController } from 'src/@Application/controllers/abstract/public.controller';
import { BinanceApi } from 'src/@Application/services/binance/binanceApi.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Account, NewOrderSpot, OrderStatus_LT } from 'binance-api-node';

@Controller('api/binance')
export class BinanceController extends PublicController {
   constructor(private readonly api: BinanceApi) {
      super();
   }

   @Get('info')
   async getWallet(): Promise<Account> {
      return await this.api.getAccountInfo();
   }

   @Post()
   async order(@Body() orderDto: NewOrderSpot): Promise<boolean> {
      const order = await this.api.orderAsync(orderDto);

      return order.status == 'NEW';
   }
}
