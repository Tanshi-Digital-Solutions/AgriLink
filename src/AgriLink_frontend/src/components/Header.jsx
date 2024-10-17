import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users } from 'lucide-react';
import './Header.scss';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <Link to="/dashboard" className="header-title">
          <h1>AgriLink</h1>
        </Link>
        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/dashboard"><Home size={18} /> Dashboard</Link>
          <Link to="/projects"><Briefcase size={18} /> Projects</Link>
          <Link to="/feed"><FileText size={18} /> Feed</Link>
          <Link to="/land-nfts"><MapPin size={18} /> NFTs</Link>
          <Link to="/contact"><Users size={18} /> Contact Us</Link>
        </nav>
        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
