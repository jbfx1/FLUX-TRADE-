import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = ({ user }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
    fetchMarketData();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`/api/portfolio/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPortfolio(response.data.portfolio || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await axios.get('/api/market-data');
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, holding) => {
      const currentPrice = marketData[holding.symbol]?.price || holding.avgPrice;
      return total + (holding.quantity * currentPrice);
    }, 0);
  };

  const calculateTotalGainLoss = () => {
    return portfolio.reduce((total, holding) => {
      const currentPrice = marketData[holding.symbol]?.price || holding.avgPrice;
      const currentValue = holding.quantity * currentPrice;
      const costBasis = holding.quantity * holding.avgPrice;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const getHoldingData = () => {
    return portfolio.map(holding => {
      const currentPrice = marketData[holding.symbol]?.price || holding.avgPrice;
      const currentValue = holding.quantity * currentPrice;
      const costBasis = holding.quantity * holding.avgPrice;
      const gainLoss = currentValue - costBasis;
      const gainLossPercent = (gainLoss / costBasis) * 100;

      return {
        ...holding,
        currentPrice,
        currentValue,
        costBasis,
        gainLoss,
        gainLossPercent
      };
    });
  };

  const getPieChartData = () => {
    const holdings = getHoldingData();
    return holdings.map(holding => ({
      name: holding.symbol,
      value: holding.currentValue,
      color: holding.gainLoss >= 0 ? '#10b981' : '#ef4444'
    }));
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

  const totalValue = calculatePortfolioValue();
  const totalGainLoss = calculateTotalGainLoss();
  const totalGainLossPercent = user.balance > 0 ? (totalGainLoss / (user.balance + totalValue)) * 100 : 0;
  const holdings = getHoldingData();
  const pieData = getPieChartData();

  const stats = [
    {
      title: 'Total Value',
      value: formatPrice(totalValue),
      icon: Wallet,
      color: '#00d4ff'
    },
    {
      title: 'Total Gain/Loss',
      value: formatPrice(totalGainLoss),
      icon: totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      color: totalGainLoss >= 0 ? '#10b981' : '#ef4444'
    },
    {
      title: 'Available Balance',
      value: formatPrice(user.balance || 0),
      icon: DollarSign,
      color: '#f59e0b'
    },
    {
      title: 'Total Return',
      value: `${totalGainLossPercent >= 0 ? '+' : ''}${totalGainLossPercent.toFixed(2)}%`,
      icon: BarChart3,
      color: totalGainLossPercent >= 0 ? '#10b981' : '#ef4444'
    }
  ];

  if (isLoading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Portfolio Overview</h1>
          <p>Track your investments and performance</p>
        </motion.div>
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

      <div className="portfolio-content">
        <motion.div
          className="holdings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Your Holdings</h2>
          {holdings.length > 0 ? (
            <div className="holdings-table">
              <div className="table-header">
                <span>Symbol</span>
                <span>Quantity</span>
                <span>Avg Price</span>
                <span>Current Price</span>
                <span>Value</span>
                <span>Gain/Loss</span>
              </div>
              {holdings.map((holding, index) => (
                <motion.div
                  key={holding.symbol}
                  className="table-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="symbol">{holding.symbol}</span>
                  <span className="quantity">{holding.quantity.toFixed(4)}</span>
                  <span className="avg-price">{formatPrice(holding.avgPrice)}</span>
                  <span className="current-price">{formatPrice(holding.currentPrice)}</span>
                  <span className="value">{formatPrice(holding.currentValue)}</span>
                  <div className="gain-loss">
                    <div className="gain-loss-container">
                      {getChangeIcon(holding.gainLossPercent)}
                      {formatChange(holding.gainLossPercent)}
                    </div>
                    <div className="gain-loss-amount">
                      {formatPrice(holding.gainLoss)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-portfolio">
              <Activity className="empty-icon" />
              <h3>No Holdings Yet</h3>
              <p>Start trading to build your portfolio</p>
            </div>
          )}
        </motion.div>

        {holdings.length > 0 && (
          <motion.div
            className="charts-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2>Portfolio Distribution</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #4a5568',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => [formatPrice(value), 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;