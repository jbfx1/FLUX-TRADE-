import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Wallet, 
  LogOut, 
  Menu,
  X,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/trading', icon: TrendingUp, label: 'Trading' },
    { path: '/portfolio', icon: Wallet, label: 'Portfolio' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo">
            <TrendingUp className="logo-icon" />
            <span>FLUX-TRADE</span>
          </Link>
        </div>

        <nav className="nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="user-section">
          <div className="user-info">
            <User className="user-icon" />
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-balance">
                ${user.balance?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
          
          <button onClick={onLogout} className="logout-button">
            <LogOut className="logout-icon" />
          </button>
        </div>

        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div 
          className="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="mobile-nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </motion.div>
      )}
    </header>
  );
};

export default Header;