import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign } from 'lucide-react';
import './NewLandNFT.scss';

const CreateLandNFT = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    size: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userResult = await AgriLink_backend.getUser();
      if ('ok' in userResult) {
        setUser(userResult.ok);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const result = await AgriLink_backend.createLandNFT({
        owner: user.id,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
        size: parseInt(formData.size, 10),
      });

      if ('ok' in result) {
        setSuccess(result.ok);
        setFormData({ latitude: '', longitude: '', size: '' });
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('An error occurred while creating the Land NFT.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-land-nft-page">
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

      <div className="create-land-nft-content">
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
          <h2>Create New Land NFT</h2>
          {user && (
            <p>Creating Land NFT for: {user.name} (ID: {user.id.toString()})</p>
          )}
          <form className="create-land-nft-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="latitude">Latitude:</label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                required
                step="any"
              />
            </div>
            <div className="form-group">
              <label htmlFor="longitude">Longitude:</label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                required
                step="any"
              />
            </div>
            <div className="form-group">
              <label htmlFor="size">Size (in square meters):</label>
              <input
                type="number"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <button type="submit" className="submit-button" disabled={loading || !user}>
              {loading ? 'Creating...' : 'Create Land NFT'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </main>
      </div>
    </div>
  );
};

export default CreateLandNFT;