import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const Trading = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [orderType, setOrderType] = useState('market')
  const [tradeType, setTradeType] = useState('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  const tradingPairs = [
    { pair: 'BTC/USDT', price: 44800, change: 2.3 },
    { pair: 'ETH/USDT', price: 2500, change: -1.2 },
    { pair: 'SOL/USDT', price: 102, change: 5.7 },
    { pair: 'ADA/USDT', price: 0.48, change: -0.8 },
    { pair: 'DOT/USDT', price: 7.2, change: 3.1 },
  ]

  const priceData = [
    { time: '09:00', price: 44200 },
    { time: '09:30', price: 44350 },
    { time: '10:00', price: 44100 },
    { time: '10:30', price: 44450 },
    { time: '11:00', price: 44600 },
    { time: '11:30', price: 44800 },
    { time: '12:00', price: 44750 },
    { time: '12:30', price: 44900 },
    { time: '13:00', price: 44800 },
  ]

  const recentTrades = [
    { price: 44800, amount: 0.025, type: 'buy', time: '13:45:23' },
    { price: 44750, amount: 0.050, type: 'sell', time: '13:45:18' },
    { price: 44780, amount: 0.012, type: 'buy', time: '13:45:15' },
    { price: 44720, amount: 0.033, type: 'sell', time: '13:45:10' },
    { price: 44800, amount: 0.018, type: 'buy', time: '13:45:05' },
  ]

  const openOrders = [
    { pair: 'BTC/USDT', type: 'Limit Buy', amount: 0.025, price: 44500, status: 'Open' },
    { pair: 'ETH/USDT', type: 'Stop Loss', amount: 1.5, price: 2400, status: 'Open' },
    { pair: 'SOL/USDT', type: 'Limit Sell', amount: 10, price: 105, status: 'Partial' },
  ]

  const selectedPairData = tradingPairs.find(pair => pair.pair === selectedPair)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Trading</h1>
        <p className="text-gray-400">Execute trades and manage your positions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Trading Pairs */}
        <div className="trading-card">
          <h2 className="text-lg font-semibold text-white mb-4">Markets</h2>
          <div className="space-y-2">
            {tradingPairs.map((pair, index) => (
              <button
                key={index}
                onClick={() => setSelectedPair(pair.pair)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                  selectedPair === pair.pair 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{pair.pair}</p>
                    <p className="text-gray-400 text-sm">${pair.price.toLocaleString()}</p>
                  </div>
                  <div className={`text-sm ${pair.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pair.change > 0 ? '+' : ''}{pair.change}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price Chart */}
        <div className="lg:col-span-2 trading-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{selectedPair}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-2xl font-bold text-white">
                  ${selectedPairData?.price.toLocaleString()}
                </span>
                <span className={`flex items-center text-sm ${
                  selectedPairData && selectedPairData.change > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedPairData && selectedPairData.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {selectedPairData?.change}%
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-md">1H</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">4H</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">1D</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">1W</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Form */}
        <div className="trading-card">
          <div className="flex mb-4">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-2 px-4 rounded-l-lg transition-all duration-200 ${
                tradeType === 'buy' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-2 px-4 rounded-r-lg transition-all duration-200 ${
                tradeType === 'sell' 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sell
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Order Type</label>
              <select 
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop">Stop Loss</option>
              </select>
            </div>

            {orderType === 'limit' && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">Price (USDT)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
              <div className="flex space-x-2 mt-2">
                <button className="flex-1 py-1 px-2 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">25%</button>
                <button className="flex-1 py-1 px-2 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">50%</button>
                <button className="flex-1 py-1 px-2 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">75%</button>
                <button className="flex-1 py-1 px-2 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600">100%</button>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Available:</span>
                <span className="text-white">$12,450.00</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-400">Total:</span>
                <span className="text-white">$0.00</span>
              </div>
            </div>

            <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              tradeType === 'buy' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}>
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Trades & Open Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Trades */}
        <div className="trading-card">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Trades</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 text-sm text-gray-400 border-b border-gray-700 pb-2">
              <span>Price</span>
              <span>Amount</span>
              <span>Type</span>
              <span>Time</span>
            </div>
            {recentTrades.map((trade, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 text-sm py-2 hover:bg-white/5 rounded">
                <span className="text-white">${trade.price.toLocaleString()}</span>
                <span className="text-gray-300">{trade.amount}</span>
                <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                  {trade.type.toUpperCase()}
                </span>
                <span className="text-gray-400">{trade.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Orders */}
        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Open Orders</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {openOrders.map((order, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{order.pair}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'Open' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>{order.type}</span>
                    <span>{order.amount} @ ${order.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trading