import { Kline } from "./kline.model";

export  
interface KlineEvent {
   e: string;  // Event type
   E: number;  // Event time
   s: string;  // Symbol
   k: Kline;   // Kline data

   R?: string; // RSI
   T?: string; // Super
}
