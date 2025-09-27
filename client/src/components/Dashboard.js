import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [marketData, setMarketData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('marketData', (data) => {
      setMarketData(data);
      
      // Generate chart data for BTC
      if (data.BTC) {
        setChartData(prev => {
          const newData = {
            time: new Date().toLocaleTimeString(),
            price: data.BTC.price
          };
          return [...prev.slice(-19), newData];
        });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => socket.close();
  }, []);

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

  const stats = [
    {
      title: 'Total Balance',
      value: formatPrice(user.balance || 0),
      icon: DollarSign,
      color: '#00d4ff'
    },
    {
      title: 'Portfolio Value',
      value: formatPrice(user.balance || 0),
      icon: BarChart3,
      color: '#10b981'
    },
    {
      title: '24h Change',
      value: '+2.5%',
      icon: Activity,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Welcome back, {user.name}!</h1>
          <p>Here's your trading overview</p>
        </motion.div>
        
        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>{isConnected ? 'Live Data' : 'Connecting...'}</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                <Icon />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <motion.div
          className="chart-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="chart-header">
            <h2>BTC Price Chart</h2>
            <div className="chart-controls">
              <button className="chart-button active">1H</button>
              <button className="chart-button">4H</button>
              <button className="chart-button">1D</button>
            </div>
          </div>
          
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
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

        <motion.div
          className="market-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Market Overview</h2>
          <div className="market-list">
            {Object.entries(marketData).map(([symbol, data]) => (
              <div key={symbol} className="market-item">
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
  );
};

export default Dashboard;