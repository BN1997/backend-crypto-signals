import { Module } from '@nestjs/common';
import { PancakeSwapGateway } from './pancakeswap.gateway';

@Module({
   controllers: [],
   providers: [PancakeSwapGateway],
})
export class PancakeSwapModule {}
