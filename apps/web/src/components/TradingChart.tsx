import { useEffect, useRef, useState } from 'react';
import type { ChartSettings } from '../types/chart';

interface TradingChartProps {
  symbol: string;
}

declare global {
  interface Window {
    TradingView?: any;
  }
}

const defaultSettings: ChartSettings = {
  interval: '1',
  range: '1D',
  theme: 'dark'
};

export default function TradingChart({ symbol }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  useEffect(() => {
    if (window.TradingView) {
      setIsLibraryLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = '/vendor/tradingview/charting_library/charting_library.js';
    script.async = true;
    script.onload = () => setIsLibraryLoaded(true);
    script.onerror = () => setIsLibraryLoaded(false);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLibraryLoaded || !containerRef.current || !window.TradingView) {
      return;
    }

    const widget = new window.TradingView.widget({
      autosize: true,
      symbol,
      interval: defaultSettings.interval,
      container: containerRef.current,
      datafeed: window.FluxTraderDatafeed,
      library_path: '/vendor/tradingview/',
      theme: defaultSettings.theme,
      locale: 'en',
      timezone: 'Etc/UTC',
      custom_css_url: '/styles/tradingview-overrides.css',
      disabled_features: ['header_symbol_search', 'symbol_search_hot_key'],
      enabled_features: ['study_templates']
    });

    return () => widget.remove?.();
  }, [isLibraryLoaded, symbol]);

  if (!isLibraryLoaded) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-2xl bg-slate-900/60">
        <div>
          <p className="text-sm font-medium text-white">TradingView library not found.</p>
          <p className="mt-2 text-xs text-slate-400">
            Place the licensed library under <code>public/vendor/tradingview</code> to load the real chart widget.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-[480px] w-full" />;
}
