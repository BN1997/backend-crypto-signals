type StageFunction<Input, Config extends Record<string, any>, Output> = (
   state: Input,
   config: Config,
) => Output;

export interface IStage<Input, Config extends Record<string, any>, Output> {
   transform(input: Input, config: Config): Output;
}

export class PipelineBuilder<Input, Config extends Record<string, any>, Output> {
   private readonly stages: Array<StageFunction<any, Config, any>>;

   public constructor(stages: Array<StageFunction<any, Config, any>>) {
      this.stages = stages;
   }

   static new<Input>(): PipelineBuilder<Input, {}, Input> {
      return new PipelineBuilder([]);
   }

   appendFunction<NewConfig extends Record<string, any>, NewOutput>(
      newStage: StageFunction<Output, NewConfig, NewOutput>,
   ): PipelineBuilder<Input, Config & NewConfig, NewOutput> {
      const newStages: Array<StageFunction<any, Config & NewConfig, any>> = this.stages.slice();
      newStages.push(newStage);
      return new PipelineBuilder<Input, Config & NewConfig, NewOutput>(newStages);
   }

   appendStage<NewConfig extends Record<string, any>, NewOutput>(
      newStage: IStage<Output, NewConfig, NewOutput>,
   ): PipelineBuilder<Input, Config & NewConfig, NewOutput> {
      const newStages: Array<StageFunction<any, Config & NewConfig, any>> = this.stages.slice();
      newStages.push(newStage.transform);
      return new PipelineBuilder<Input, Config & NewConfig, NewOutput>(newStages);
   }

   build(): StageFunction<Input, Config, Output> {
      return (input: Input, config: Config) =>
         this.stages.reduce((state, stage) => stage(state, config), input);
   }
}

// SPEC.TS

function reverse(input: string) {
   return input.split('').reverse().join('');
}

function toInt(input: string, config: { radix: number }) {
   return parseInt(input, config.radix);
}

function multiply(input: number, config: { multiplicand: number }) {
   return input * config.multiplicand;
}

const pipeline = PipelineBuilder.new<string>()
   .appendFunction(reverse)
   .appendFunction(toInt)
   .appendFunction(multiply)
   .build();

const output: number = pipeline('532', {
   radix: 10,
   multiplicand: 5,
});
