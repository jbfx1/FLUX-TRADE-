import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Search, Filter, Star, Activity } from 'lucide-react'

const Markets = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('volume')

  const categories = [
    { id: 'all', label: 'All Markets' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'defi', label: 'DeFi' },
    { id: 'layer1', label: 'Layer 1' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'nft', label: 'NFT' },
  ]

  const marketData = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 44800,
      change24h: 2.3,
      volume: 28500000000,
      marketCap: 875000000000,
      category: 'layer1',
      isFavorite: true,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2500,
      change24h: -1.2,
      volume: 15200000000,
      marketCap: 300000000000,
      category: 'layer1',
      isFavorite: true,
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 102,
      change24h: 5.7,
      volume: 2100000000,
      marketCap: 45000000000,
      category: 'layer1',
      isFavorite: false,
    },
    {
      symbol: 'UNI',
      name: 'Uniswap',
      price: 6.8,
      change24h: 3.2,
      volume: 180000000,
      marketCap: 5200000000,
      category: 'defi',
      isFavorite: false,
    },
    {
      symbol: 'AAVE',
      name: 'Aave',
      price: 85,
      change24h: -2.1,
      volume: 120000000,
      marketCap: 1200000000,
      category: 'defi',
      isFavorite: true,
    },
    {
      symbol: 'AXS',
      name: 'Axie Infinity',
      price: 8.5,
      change24h: 7.3,
      volume: 95000000,
      marketCap: 950000000,
      category: 'gaming',
      isFavorite: false,
    },
    {
      symbol: 'SAND',
      name: 'The Sandbox',
      price: 0.45,
      change24h: -3.8,
      volume: 78000000,
      marketCap: 850000000,
      category: 'gaming',
      isFavorite: false,
    },
    {
      symbol: 'APE',
      name: 'ApeCoin',
      price: 1.2,
      change24h: 4.5,
      volume: 145000000,
      marketCap: 720000000,
      category: 'nft',
      isFavorite: false,
    },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
    return `$${num.toFixed(2)}`
  }

  const filteredMarkets = marketData
    .filter(market => {
      const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
                             (selectedCategory === 'favorites' && market.isFavorite) ||
                             market.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume - a.volume
        case 'marketCap':
          return b.marketCap - a.marketCap
        case 'change':
          return Math.abs(b.change24h) - Math.abs(a.change24h)
        case 'price':
          return b.price - a.price
        default:
          return 0
      }
    })

  const topGainers = marketData
    .filter(market => market.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 3)

  const topLosers = marketData
    .filter(market => market.change24h < 0)
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Markets</h1>
        <p className="text-gray-400">Explore cryptocurrency markets and trading opportunities</p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-green-400 text-sm">+2.3%</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Market Cap</p>
            <p className="text-2xl font-bold text-white">$1.65T</p>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-blue-400 text-sm">24h</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-white">$89.2B</p>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-gray-400 text-sm">BTC</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">BTC Dominance</p>
            <p className="text-2xl font-bold text-white">52.8%</p>
          </div>
        </div>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="trading-card">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            Top Gainers
          </h2>
          <div className="space-y-3">
            {topGainers.map((market, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">{market.symbol[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{market.symbol}</p>
                    <p className="text-gray-400 text-sm">{market.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${market.price}</p>
                  <p className="text-green-400 text-sm">+{market.change24h}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trading-card">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
            Top Losers
          </h2>
          <div className="space-y-3">
            {topLosers.map((market, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">{market.symbol[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{market.symbol}</p>
                    <p className="text-gray-400 text-sm">{market.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${market.price}</p>
                  <p className="text-red-400 text-sm">{market.change24h}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="trading-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-white">All Markets</h2>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="volume">Volume</option>
              <option value="marketCap">Market Cap</option>
              <option value="change">24h Change</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Change</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Volume</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Market Cap</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkets.map((market, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-white/5 transition-all duration-200">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <button className="text-gray-400 hover:text-yellow-400 mr-2">
                        <Star className={`w-4 h-4 ${market.isFavorite ? 'fill-current text-yellow-400' : ''}`} />
                      </button>
                      <span className="text-gray-300">{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">{market.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{market.symbol}</p>
                        <p className="text-gray-400 text-sm">{market.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-white font-medium">
                    ${market.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`flex items-center justify-end ${
                      market.change24h > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {market.change24h > 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(market.change24h)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    {formatNumber(market.volume)}
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    {formatNumber(market.marketCap)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button className="px-4 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-all duration-200 text-sm">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Markets