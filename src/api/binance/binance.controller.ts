import { PrivateController } from "@common/controllers/private.controller";
import { BinanceApi } from "./binance.api";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { Account, NewOrderSpot, OrderStatus_LT } from "binance-api-node";

@Controller('api/binance')
export class BinanceController extends PrivateController {
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