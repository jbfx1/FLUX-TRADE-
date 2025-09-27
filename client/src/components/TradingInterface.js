import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import './TradingInterface.css';

const TradingInterface = ({ user }) => {
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('marketData', (data) => {
      setMarketData(data);
      
      if (data[selectedSymbol]) {
        setPrice(data[selectedSymbol].price.toFixed(2));
        
        // Generate chart data
        setChartData(prev => {
          const newData = {
            time: new Date().toLocaleTimeString(),
            price: data[selectedSymbol].price
          };
          return [...prev.slice(-19), newData];
        });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => socket.close();
  }, [selectedSymbol]);

  const handleTrade = async () => {
    if (!quantity || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsTrading(true);
    try {
      const response = await axios.post('/api/trade', {
        symbol: selectedSymbol,
        type: tradeType,
        quantity: parseFloat(quantity),
        price: parseFloat(price)
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${selectedSymbol}`);
        setQuantity('');
        // Update user balance in parent component if needed
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trade failed');
    } finally {
      setIsTrading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return (
      <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <ArrowUpRight className="change-icon" /> : <ArrowDownRight className="change-icon" />;
  };

  const symbols = Object.keys(marketData);
  const selectedData = marketData[selectedSymbol];

  return (
    <div className="trading-interface">
      <div className="trading-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Trading Interface</h1>
          <p>Trade cryptocurrencies with real-time data</p>
        </motion.div>
        
        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>{isConnected ? 'Live Data' : 'Connecting...'}</span>
        </div>
      </div>

      <div className="trading-content">
        <div className="trading-left">
          <motion.div
            className="chart-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="chart-header">
              <div className="symbol-selector">
                <select 
                  value={selectedSymbol} 
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="symbol-select"
                >
                  {symbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>
              
              {selectedData && (
                <div className="price-info">
                  <span className="current-price">{formatPrice(selectedData.price)}</span>
                  <div className="change-container">
                    {getChangeIcon(selectedData.change)}
                    {formatChange(selectedData.change)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#a0aec0"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#a0aec0"
                    fontSize={12}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #4a5568',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#00d4ff" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#00d4ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="trading-right">
          <motion.div
            className="trade-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Place Order</h2>
            
            <div className="trade-type-selector">
              <button
                className={`trade-type ${tradeType === 'buy' ? 'active buy' : ''}`}
                onClick={() => setTradeType('buy')}
              >
                <TrendingUp className="trade-icon" />
                Buy
              </button>
              <button
                className={`trade-type ${tradeType === 'sell' ? 'active sell' : ''}`}
                onClick={() => setTradeType('sell')}
              >
                <TrendingDown className="trade-icon" />
                Sell
              </button>
            </div>

            <div className="trade-form">
              <div className="form-group">
                <label>Symbol</label>
                <select 
                  value={selectedSymbol} 
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="form-input"
                >
                  {symbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  step="0.0001"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Price per Unit</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="trade-summary">
                <div className="summary-row">
                  <span>Total Cost</span>
                  <span>
                    {quantity && price ? formatPrice(quantity * price) : '$0.00'}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Available Balance</span>
                  <span>{formatPrice(user.balance || 0)}</span>
                </div>
              </div>

              <button
                className={`trade-button ${tradeType}`}
                onClick={handleTrade}
                disabled={isTrading || !quantity || !price}
              >
                {isTrading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedSymbol}`}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="market-overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2>Market Overview</h2>
            <div className="market-list">
              {Object.entries(marketData).map(([symbol, data]) => (
                <div 
                  key={symbol} 
                  className={`market-item ${symbol === selectedSymbol ? 'active' : ''}`}
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  <div className="market-symbol">
                    <span className="symbol">{symbol}</span>
                    <span className="volume">Vol: ${(data.volume / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="market-price">
                    <span className="price">{formatPrice(data.price)}</span>
                    <div className="change-container">
                      {getChangeIcon(data.change)}
                      {formatChange(data.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;