import EventEmitter from 'events';
import { createDerivWebSocket, fetchHistoricalTicks, TickMessage } from './derivClient';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const timeframes = [60, 300, 900];

class Datafeed extends EventEmitter {
  private candles: Record<string, Candle[]> = {};
  private ws?: ReturnType<typeof createDerivWebSocket>;

  async initialise(symbol = 'R_100') {
    await this.bootstrap(symbol);
    this.subscribe(symbol);
  }

  async bootstrap(symbol: string) {
    const now = Math.floor(Date.now() / 1000);
    const { history } = await fetchHistoricalTicks(symbol, now - 86400, now);

    timeframes.forEach((frame) => {
      this.candles[this.key(symbol, frame)] = this.aggregate(history.times, history.prices, frame);
    });
  }

  private subscribe(symbol: string) {
    this.ws = createDerivWebSocket(symbol);
    this.ws.on('message', (raw: WebSocket.RawData) => {
      const message = JSON.parse(raw.toString()) as TickMessage;
      if (!message.tick) return;
      this.handleTick(symbol, message.tick.quote, message.tick.epoch);
    });

    this.ws.on('close', () => {
      setTimeout(() => this.subscribe(symbol), 1000);
    });
  }

  private handleTick(symbol: string, price: number, epoch: number) {
    timeframes.forEach((frame) => {
      const key = this.key(symbol, frame);
      const candles = this.candles[key] ?? [];
      const lastCandle = candles[candles.length - 1];
      const bucket = Math.floor(epoch / frame) * frame;

      if (!lastCandle || lastCandle.time !== bucket) {
        const candle: Candle = {
          time: bucket,
          open: price,
          high: price,
          low: price,
          close: price,
          volume: 1
        };
        this.candles[key] = [...candles, candle].slice(-1000);
      } else {
        lastCandle.high = Math.max(lastCandle.high, price);
        lastCandle.low = Math.min(lastCandle.low, price);
        lastCandle.close = price;
        lastCandle.volume += 1;
      }
    });
    this.emit('tick', { symbol, price, epoch });
  }

  private aggregate(times: number[], prices: number[], frame: number): Candle[] {
    const buckets = new Map<number, Candle>();
    times.forEach((timestamp, index) => {
      const price = prices[index];
      const bucket = Math.floor(timestamp / frame) * frame;
      const candle = buckets.get(bucket);
      if (!candle) {
        buckets.set(bucket, {
          time: bucket,
          open: price,
          high: price,
          low: price,
          close: price,
          volume: 1
        });
      } else {
        candle.high = Math.max(candle.high, price);
        candle.low = Math.min(candle.low, price);
        candle.close = price;
        candle.volume += 1;
      }
    });
    return Array.from(buckets.values()).sort((a, b) => a.time - b.time);
  }

  getHistory(symbol: string, timeframe: number, from: number, to: number) {
    const key = this.key(symbol, timeframe);
    const candles = (this.candles[key] ?? []).filter((candle) => candle.time >= from && candle.time <= to);
    return candles;
  }

  seed(symbol: string, times: number[], prices: number[]) {
    timeframes.forEach((frame) => {
      this.candles[this.key(symbol, frame)] = this.aggregate(times, prices, frame);
    });
  }

  private key(symbol: string, timeframe: number) {
    return `${symbol}_${timeframe}`;
  }
}

export const datafeed = new Datafeed();

export async function createDatafeed() {
  await datafeed.initialise();
}
