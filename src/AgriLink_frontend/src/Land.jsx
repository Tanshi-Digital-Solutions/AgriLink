import React, { useState, useEffect } from 'react';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import './LandNFTs.css';

const LandNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const result = await AgriLink_backend.getAllLandNFTs();
      setNfts(result);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setError('Failed to fetch NFTs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await AgriLink_backend.createLandNFT({
        owner: null, // This will be set by the backend
        location: { latitude: parseFloat(location.split(',')[0]), longitude: parseFloat(location.split(',')[1]) },
        size: parseInt(size)
      });

      if ('ok' in result) {
        setSuccess('NFT created successfully!');
        fetchNFTs();
        setLocation('');
        setSize('');
      } else {
        setError('Error creating NFT: ' + result.err);
      }
    } catch (error) {
      console.error('NFT creation error:', error);
      setError('An error occurred during NFT creation');
    }
  };

  return (
    <div className="land-nfts-container">
      <h1>Land NFTs</h1>
      
      <form className="nft-form" onSubmit={handleSubmit}>
        <h2>Create New Land NFT</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="form-group">
          <label htmlFor="location">Location (latitude,longitude):</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 40.7128,-74.0060"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="size">Size (in square meters):</label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="create-button">Create NFT</button>
      </form>

      <div className="nft-list">
        <h2>Your Land NFTs</h2>
        {nfts.length === 0 ? (
          <p>No NFTs found. Create your first one!</p>
        ) : (
          <div className="nft-grid">
            {nfts.map((nft) => (
              <div key={nft.id} className="nft-card">
                <h3>NFT ID: {nft.id}</h3>
                <p>Location: {nft.location.latitude}, {nft.location.longitude}</p>
                <p>Size: {nft.size} sq m</p>
                <p>Status: {Object.keys(nft.status)[0]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandNFTs;