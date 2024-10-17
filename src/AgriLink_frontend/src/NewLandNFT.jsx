import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign } from 'lucide-react';
import './NewLandNFT.scss';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const CreateLandNFT = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
        name: formData.name,
        description: formData.description,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
        size: parseInt(formData.size, 10),
      });

      if ('ok' in result) {
        setSuccess(result.ok);
        setFormData({ name: '', description: '', latitude: '', longitude: '', size: '' });
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
      <Header/>

      <div className="create-land-nft-content">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content">
          <h2>Create New Land NFT</h2>
          {user && (
            <p>Creating Land NFT for: {user.name} (ID: {user.id.toString()})</p>
          )}
          <form className="create-land-nft-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
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