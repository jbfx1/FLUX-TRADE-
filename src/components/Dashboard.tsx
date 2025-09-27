import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const Dashboard = () => {
  // Mock data for charts
  const portfolioData = [
    { name: 'Jan', value: 4000, pnl: 240 },
    { name: 'Feb', value: 3000, pnl: 139 },
    { name: 'Mar', value: 2000, pnl: 980 },
    { name: 'Apr', value: 2780, pnl: 390 },
    { name: 'May', value: 1890, pnl: 480 },
    { name: 'Jun', value: 2390, pnl: 380 },
    { name: 'Jul', value: 3490, pnl: 430 },
  ]

  const marketData = [
    { name: '00:00', btc: 43000, eth: 2400, sol: 95 },
    { name: '04:00', btc: 43200, eth: 2420, sol: 97 },
    { name: '08:00', btc: 42800, eth: 2380, sol: 93 },
    { name: '12:00', btc: 44100, eth: 2450, sol: 98 },
    { name: '16:00', btc: 44500, eth: 2480, sol: 101 },
    { name: '20:00', btc: 44200, eth: 2465, sol: 99 },
    { name: '24:00', btc: 44800, eth: 2500, sol: 102 },
  ]

  const topAssets = [
    { symbol: 'BTC', name: 'Bitcoin', price: 44800, change: 2.3, value: 8950.20 },
    { symbol: 'ETH', name: 'Ethereum', price: 2500, change: -1.2, value: 5000.00 },
    { symbol: 'SOL', name: 'Solana', price: 102, change: 5.7, value: 2040.00 },
    { symbol: 'ADA', name: 'Cardano', price: 0.48, change: -0.8, value: 960.00 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.2, change: 3.1, value: 1440.00 },
  ]

  const stats = [
    {
      title: 'Total Balance',
      value: '$24,567.89',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Daily P&L',
      value: '+$1,234.56',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Active Positions',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Activity,
    },
    {
      title: 'Win Rate',
      value: '68.4%',
      change: '+2.1%',
      trend: 'up',
      icon: Users,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Trading Dashboard</h1>
        <p className="text-gray-400">Monitor your portfolio performance and market trends</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="trading-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Performance Chart */}
        <div className="lg:col-span-2 trading-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Portfolio Performance</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-md">1D</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">1W</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">1M</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">1Y</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Assets */}
        <div className="trading-card">
          <h2 className="text-xl font-semibold text-white mb-6">Top Assets</h2>
          <div className="space-y-4">
            {topAssets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">{asset.symbol[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{asset.symbol}</p>
                    <p className="text-gray-400 text-sm">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${asset.price.toLocaleString()}</p>
                  <p className={`text-sm ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change > 0 ? '+' : ''}{asset.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="mt-8 trading-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Market Overview</h2>
          <div className="text-sm text-gray-400">Last 24 hours</div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#ffffff'
              }} 
            />
            <Line type="monotone" dataKey="btc" stroke="#f7931a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="eth" stroke="#627eea" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sol" stroke="#9945ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard