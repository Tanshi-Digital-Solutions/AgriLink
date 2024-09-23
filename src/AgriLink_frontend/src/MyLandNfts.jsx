import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import './LandNFTs.scss';

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

const NFTsGrid = () => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const nftsResult = await AgriLink_backend.getUserLandNFTs();
      const convertedNFTs = await Promise.all(nftsResult.map(async (nft) => {
        let ownerName = 'Unknown';
        try {
          const userResult = await AgriLink_backend.getUser(nft.owner);
          if (userResult.ok) {
            ownerName = userResult.ok.name;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
        return {
          ...nft,
          createdAt: formatDate(nft.createdAt),
          ownerName
        };
      }));
      setNFTs(convertedNFTs);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNFTClick = (nftId) => {
    navigate(`/nfts/${nftId}`);
  };

  if (loading) {
    return <div className="loading">Loading NFTs...</div>;
  }

  return (
    <div className="nfts-page">
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
            <Link to="/nfts"><MapPin size={18} /> NFTs</Link>
            <Link to="/contact"><Users size={18} /> Contact Us</Link>
          </nav>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="nfts-content">
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
          <h2>Land NFTs</h2>
          <div className="nfts-grid">
            {nfts.map((nft) => (
              <div key={nft.id} className="nft-card" onClick={() => handleNFTClick(nft.id)}>
                <h3>{nft.name}</h3>
                <p className="nft-description">{nft.description}</p>
                <div className="nft-details">
                  <p><strong>NFT ID:</strong> {nft.id}</p>
                  <p><MapPin size={16} /> <strong>Location:</strong> {nft.location}</p>
                  <p><Calendar size={16} /> <strong>Created:</strong> {nft.createdAt}</p>
                  <p><Users size={16} /> <strong>Owner:</strong> {nft.ownerName}</p>
                </div>
                <button className="view-details-button">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NFTsGrid;