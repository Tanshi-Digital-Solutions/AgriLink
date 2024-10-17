import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import landImage from './land.png';
import './LandNFTs.scss';
import AddButton from './components/Button';

const formatDate = (timestamp) => {
  if (typeof timestamp === 'bigint') {
    timestamp = Number(timestamp) / 1000000;
  } else if (typeof timestamp === 'number') {
    timestamp = timestamp;
  } else if (typeof timestamp === 'string') {
    timestamp = Date.parse(timestamp);
  }

  const date = new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', timestamp);
    return 'Invalid Date';
  }
  
  return date.toLocaleDateString();
};

const formatStatus = (status) => {
  if (typeof status === 'object') {
    // If status is an object, it's likely an enum. Return the key of the object.
    return Object.keys(status)[0];
  }
  return status.toString();
};

const LandNFTsGrid = () => {
  const [landNFTs, setLandNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLandNFTs();
  }, []);

  const fetchLandNFTs = async () => {
    try {
      setLoading(true);
      const nftsResult = await AgriLink_backend.getAllLandNFTs();
      setLandNFTs(nftsResult);
    } catch (error) {
      console.error('Error fetching land NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNFTClick = (nftId) => {
    navigate(`/land-nfts/${nftId}`);
  };

  if (loading) {
    return <div className="loading">Loading land NFTs...</div>;
  }

  return (
    <div className="land-nfts-page">
      <header className="dashboard-header">
        <div className="header-content">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <h1>AgriLink</h1>
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/dashboard"><Home size={18} /> Dashboard</Link>
            <Link to="/projects"><Briefcase size={18} /> Projects</Link>
            <Link to="/feed"><FileText size={18} /> Feed</Link>
            <Link to="/land-nfts"><MapPin size={18} /> Land NFTs</Link>
            <Link to="/contact"><Users size={18} /> Contact Us</Link>
          </nav>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="land-nfts-content">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>AgriLink</h2>
            <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
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

        <main className="main-content">
          <h2>Available Land NFTs</h2>
          <div className="land-nfts-grid">
            {landNFTs.map((nft) => (
              <div key={nft.id} className="land-nft-card" onClick={() => handleNFTClick(nft.id)}>
                <img src={landImage} alt={nft.name} className="land-nft-image" />
                <h3>{nft.name}</h3>
                <p className="land-nft-description">{nft.description}</p>
                <div className="land-nft-details">
                  <p><strong>NFT ID:</strong> {nft.id}</p>
                  <p><MapPin size={16} /> <strong>Location:</strong> {`${nft.location.latitude}, ${nft.location.longitude}`}</p>
                  <p><strong>Size:</strong> {nft.size} sq meters</p>
                  <p><strong>Status:</strong> {formatStatus(nft.status)}</p>
                </div>
                <button className="view-details-button">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    <AddButton/>  
    </div>
  );
};

export default LandNFTsGrid;