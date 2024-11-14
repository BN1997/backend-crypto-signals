import { IStage } from '@common/pipelines/base.pipeline';
import { KlineEvent } from '../../models/kline-event.model';

export class BinanceParseStage implements IStage<string, {}, KlineEvent> {
   transform(input: string, config: {}): KlineEvent {
      return JSON.parse(input) as KlineEvent;
   }
}
