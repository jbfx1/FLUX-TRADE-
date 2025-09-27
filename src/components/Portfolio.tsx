import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Percent, Eye, EyeOff } from 'lucide-react'

const Portfolio = () => {
  const portfolioData = [
    { name: 'BTC', value: 8950.20, percentage: 36.4, color: '#f7931a' },
    { name: 'ETH', value: 5000.00, percentage: 20.3, color: '#627eea' },
    { name: 'SOL', value: 2040.00, percentage: 8.3, color: '#9945ff' },
    { name: 'ADA', value: 1960.00, percentage: 8.0, color: '#0033ad' },
    { name: 'DOT', value: 1440.00, percentage: 5.9, color: '#e6007a' },
    { name: 'Others', value: 5176.69, percentage: 21.1, color: '#6b7280' },
  ]

  const performanceData = [
    { name: 'Jan', value: 4000, profit: 240 },
    { name: 'Feb', value: 3000, profit: 139 },
    { name: 'Mar', value: 2000, profit: 980 },
    { name: 'Apr', value: 2780, profit: 390 },
    { name: 'May', value: 1890, profit: 480 },
    { name: 'Jun', value: 2390, profit: 380 },
    { name: 'Jul', value: 3490, profit: 430 },
  ]

  const holdings = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: '0.2',
      value: 8950.20,
      price: 44751,
      change24h: 2.3,
      allocation: 36.4,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: '2.0',
      value: 5000.00,
      price: 2500,
      change24h: -1.2,
      allocation: 20.3,
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      amount: '20',
      value: 2040.00,
      price: 102,
      change24h: 5.7,
      allocation: 8.3,
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      amount: '4000',
      value: 1960.00,
      price: 0.49,
      change24h: -0.8,
      allocation: 8.0,
    },
    {
      symbol: 'DOT',
      name: 'Polkadot',
      amount: '200',
      value: 1440.00,
      price: 7.2,
      change24h: 3.1,
      allocation: 5.9,
    },
  ]

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-gray-400">Track your investments and asset allocation</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <button className="text-gray-400 hover:text-white">
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Value</p>
            <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-green-400 text-sm">+12.5%</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">24h Change</p>
            <p className="text-2xl font-bold text-green-400">+$2,847.32</p>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Percent className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-green-400 text-sm">+8.3%</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Return</p>
            <p className="text-2xl font-bold text-white">+$4,567.89</p>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-gray-400 text-sm">Assets</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Diversification</p>
            <p className="text-2xl font-bold text-white">{holdings.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset Allocation */}
        <div className="trading-card">
          <h2 className="text-xl font-semibold text-white mb-6">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{item.name}</span>
                </div>
                <span className="text-white text-sm font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="lg:col-span-2 trading-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Holdings</h2>
            <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-200">
              Rebalance
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Asset</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Change</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-white/5 transition-all duration-200">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">{holding.symbol[0]}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{holding.symbol}</p>
                          <p className="text-gray-400 text-sm">{holding.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-white">{holding.amount}</td>
                    <td className="py-4 px-4 text-right text-white">${holding.price.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`flex items-center justify-end ${
                        holding.change24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {holding.change24h > 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(holding.change24h)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-white font-medium">
                      ${holding.value.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300">
                      {holding.allocation}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mt-8 trading-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Portfolio Performance</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-md">1M</button>
            <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">3M</button>
            <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">6M</button>
            <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">1Y</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
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
            <Bar dataKey="profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Portfolio