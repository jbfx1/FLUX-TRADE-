import type { LibrarySymbolInfo, ResolutionString } from '../types/tradingview';
import { getHistory } from '../services/datafeed';

const configuration = {
  supported_resolutions: ['1', '5', '15'],
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true
};

const defaultSymbol: LibrarySymbolInfo = {
  name: 'R_100',
  ticker: 'R_100',
  description: 'Random 100 Index',
  type: 'index',
  session: '24x7',
  timezone: 'Etc/UTC',
  exchange: 'Deriv',
  minmov: 1,
  pricescale: 100,
  has_intraday: true,
  supported_resolutions: configuration.supported_resolutions,
  volume_precision: 0,
  data_status: 'streaming'
};

class FluxTraderDatafeed {
  onReady(callback: (config: typeof configuration) => void) {
    setTimeout(() => callback(configuration), 0);
  }

  resolveSymbol(symbolName: string, onResolve: (symbol: LibrarySymbolInfo) => void, onError: (reason: string) => void) {
    if (!symbolName) {
      onError('Symbol not found');
      return;
    }
    onResolve({ ...defaultSymbol, name: symbolName, ticker: symbolName });
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    { from, to }: { from: number; to: number },
    onResult: (bars: any[], meta: { noData: boolean }) => void,
    onError: (error: string) => void
  ) {
    try {
      const timeframe = resolution === '1' ? 60 : resolution === '5' ? 300 : 900;
      const { candles } = await getHistory(symbolInfo.ticker, timeframe, from, to);
      const bars = candles.map((candle) => ({
        time: candle.time * 1000,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume
      }));
      onResult(bars, { noData: bars.length === 0 });
    } catch (error: any) {
      onError(error?.message ?? 'Failed to load history');
    }
  }

  subscribeBars() {}
  unsubscribeBars() {}
}

// @ts-expect-error - assign to window for TradingView
window.FluxTraderDatafeed = new FluxTraderDatafeed();
