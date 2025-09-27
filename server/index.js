const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
const users = [
  {
    id: 1,
    email: 'demo@fluxtrade.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Demo User',
    balance: 10000,
    portfolio: []
  }
];

// Mock trading data
let tradingData = {
  BTC: { price: 43250.50, change: 2.5, volume: 1250000000 },
  ETH: { price: 2650.75, change: -1.2, volume: 850000000 },
  ADA: { price: 0.485, change: 5.8, volume: 320000000 },
  SOL: { price: 98.25, change: 3.2, volume: 450000000 },
  DOT: { price: 6.85, change: -0.8, volume: 180000000 }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      balance: user.balance
    }
  });
});

app.get('/api/market-data', (req, res) => {
  res.json(tradingData);
});

app.get('/api/portfolio/:userId', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  res.json({
    balance: user.balance,
    portfolio: user.portfolio
  });
});

app.post('/api/trade', authenticateToken, (req, res) => {
  const { symbol, type, quantity, price } = req.body;
  const userId = req.user.id;
  
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const totalCost = quantity * price;
  
  if (type === 'buy') {
    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    user.balance -= totalCost;
    
    const existingHolding = user.portfolio.find(p => p.symbol === symbol);
    if (existingHolding) {
      existingHolding.quantity += quantity;
      existingHolding.avgPrice = (existingHolding.avgPrice * (existingHolding.quantity - quantity) + totalCost) / existingHolding.quantity;
    } else {
      user.portfolio.push({ symbol, quantity, avgPrice: price });
    }
  } else if (type === 'sell') {
    const existingHolding = user.portfolio.find(p => p.symbol === symbol);
    if (!existingHolding || existingHolding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient holdings' });
    }
    
    user.balance += totalCost;
    existingHolding.quantity -= quantity;
    
    if (existingHolding.quantity === 0) {
      user.portfolio = user.portfolio.filter(p => p.symbol !== symbol);
    }
  }

  res.json({
    success: true,
    balance: user.balance,
    portfolio: user.portfolio
  });
});

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial market data
  socket.emit('marketData', tradingData);
  
  // Simulate real-time price updates
  const interval = setInterval(() => {
    Object.keys(tradingData).forEach(symbol => {
      const change = (Math.random() - 0.5) * 0.02; // ±1% change
      tradingData[symbol].price *= (1 + change);
      tradingData[symbol].change = change * 100;
    });
    
    socket.emit('marketData', tradingData);
  }, 2000);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});