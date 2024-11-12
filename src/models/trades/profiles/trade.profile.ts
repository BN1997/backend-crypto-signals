import { mapFrom, Mapper, ProfileBase } from '@nartc/automapper';
import { Trade } from '../entities/trade.entity';
import { TradeViewDto } from '../dtos/view.dto';

export class TradeProfile extends ProfileBase {
   constructor() {
      super();

      Mapper.createMap(Trade, TradeViewDto)
         .forMember(
            (dest) => dest.id,
            mapFrom((src) => src.id),
         )
         .forMember(
            (dest) => dest.details,
            mapFrom((src) => JSON.stringify(src.details)),
         );
   }
}
