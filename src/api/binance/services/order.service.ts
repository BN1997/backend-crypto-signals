import { Injectable } from "@nestjs/common";
import { BinanceApi } from "../binance.api";
import { Decision } from "./decision.service";

@Injectable()
export class BinanceOrderService {
    constructor(private readonly api: BinanceApi) {
    }

    process(data: Decision) {
        if (data.type == "BUY") {
            this.buy();
            // realizar compra e ordem de venda num valor abaixo (10% - 5%)
        }
        else if(data.type == "SELL") {
            // this.api.orderAsync({
            //     price: data.details.price,
            //     quantity: '0.001',
            //     quoteOrderQty
            // })
            // this.api.order({

            // })

            console.log('SELL')
        }

        return data.details.candles;
    }

    buy() {
        console.log('BUY')

    }

    sell() {
        this.sell();

    }
}