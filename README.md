# FLUX-TRADE - Professional Trading Platform

A modern, real-time cryptocurrency trading platform built with React and Node.js.

## 🚀 Features

- **Real-time Trading**: Live price updates and market data
- **Interactive Charts**: Beautiful charts with Recharts library
- **Portfolio Management**: Track your investments and performance
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Dark theme with smooth animations
- **WebSocket Integration**: Real-time data streaming
- **Authentication**: Secure user login system

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Recharts (for charts)
- Framer Motion (for animations)
- Socket.io Client
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- Socket.io
- JWT Authentication
- CORS enabled

## 📦 Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## 🎯 Usage

1. **Access the application:**
   - Open your browser and go to `http://localhost:3000`
   - The backend API runs on `http://localhost:5000`

2. **Login with demo credentials:**
   - Email: `demo@fluxtrade.com`
   - Password: `password`

3. **Explore the platform:**
   - **Dashboard**: View market overview and your portfolio stats
   - **Trading**: Buy and sell cryptocurrencies with real-time data
   - **Portfolio**: Track your holdings and performance

## 📱 Features Overview

### Dashboard
- Real-time market data
- Interactive price charts
- Portfolio statistics
- Live connection status

### Trading Interface
- Real-time price updates
- Buy/Sell functionality
- Market overview
- Order placement

### Portfolio
- Holdings tracking
- Performance metrics
- Portfolio distribution charts
- Gain/Loss calculations

## 🔧 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production

### Project Structure

```
flux-trade/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   └── package.json
└── package.json           # Root package.json
```

## 🌟 Key Components

- **Login**: Secure authentication with demo credentials
- **Header**: Navigation with user info and balance
- **Dashboard**: Market overview with real-time charts
- **TradingInterface**: Buy/sell functionality with live data
- **Portfolio**: Holdings management and performance tracking

## 🎨 Design Features

- Dark theme with gradient backgrounds
- Smooth animations with Framer Motion
- Responsive design for all screen sizes
- Professional trading platform aesthetics
- Real-time data indicators

## 📊 Real-time Data

The platform uses WebSocket connections to provide:
- Live price updates every 2 seconds
- Real-time market data
- Instant trade execution feedback
- Live portfolio value updates

## 🔒 Security

- JWT-based authentication
- Secure API endpoints
- Input validation
- CORS protection

## 🚀 Production Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   cd server && npm start
   ```

## 📝 Notes

- This is a demo platform with simulated trading data
- All prices and market data are generated for demonstration
- No real money or actual trading occurs
- Perfect for learning and portfolio demonstration

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License.