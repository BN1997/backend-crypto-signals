import { Module } from "@nestjs/common";
import { BinanceApi } from "./binance/binance.api";
import { BinanceGateway } from "./binance/binance.gateway";
import { BinanceController } from "./binance/binance.controller";
import { BinanceDataHandler } from "./binance/services/data.service";
import { BinanceOrderService } from "./binance/services/order.service";
import { BinanceTradingStrategy } from "./binance/services/decision.service";

@Module({
    controllers: [BinanceController],
    providers: [BinanceApi, BinanceDataHandler, BinanceOrderService, BinanceTradingStrategy,
        BinanceGateway
    ],
    exports: [BinanceApi],
 })
 export class ApiModule {}