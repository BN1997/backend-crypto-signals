export 
interface Kline {
    t: number;  // Open time
    T: number;  // Close time
    s: string;  // Symbol
    i: string;  // Interval
    o: string;  // Open price
    c: string;  // Close price
    h: string;  // High price
    l: string;  // Low price
    v: string;  // Volume
    x: boolean; // Is this the final kline?
    q: string;  // Quote asset volume
 }