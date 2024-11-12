import { PrivateController } from '@common/controllers/private.controller';
import { Controller, Get } from '@nestjs/common';
import { TradeService } from './services/trades.service';
import { Mapper } from '@nartc/automapper';
import { Trade } from './entities/trade.entity';
import { TradeViewDto } from './dtos/view.dto';

@Controller('api/trades')
export class TradesController extends PrivateController {
   constructor(private readonly tradeService: TradeService) {
      super();
   }

   @Get()
   async findAll(): Promise<TradeViewDto[]> {
      const trades = await this.tradeService.findAll();
      const dto = await Mapper.mapArrayAsync(trades, TradeViewDto, Trade);

      return dto;
   }
}
