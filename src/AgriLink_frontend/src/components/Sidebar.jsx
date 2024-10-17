import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, Briefcase, DollarSign, MapPin } from 'lucide-react';
import './Sidebar.scss';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>AgriLink</h2>
        <button className="close-sidebar" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard"><Home size={18} /> Dashboard</Link>
        <Link to="/projects"><Briefcase size={18} /> My Projects</Link>
        <Link to="/investments"><DollarSign size={18} /> My Investments</Link>
        <Link to="/land-nfts"><MapPin size={18} /> My Land NFTs</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
