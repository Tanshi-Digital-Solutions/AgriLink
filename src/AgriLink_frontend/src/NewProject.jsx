import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { User, LogOut, Home, Sprout, Menu } from 'lucide-react';
import './NewProject.scss';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await AgriLink_backend.createProject(
        name,
        description,
        BigInt(parseFloat(fundingGoal) * 100), // Convert to cents
        BigInt(new Date(startDate).getTime() * 1000000), // Convert to nanoseconds
        BigInt(new Date(endDate).getTime() * 1000000) // Convert to nanoseconds
      );

      if ('ok' in result) {
        navigate('/dashboard');
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="create-project">
      <header className="create-project__header">
        <div className="logo">AgriLink</div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
        <nav className={`desktop-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <a href="/dashboard">Dashboard</a>
          <a href="/investments">Investments</a>
          <a href="/projects">Projects</a>
          <a href="/land-nfts">Land NFTs</a>
        </nav>
        <div className="user-menu">
          <span>John Doe</span>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="create-project__main">
        <h1>Create New Project</h1>
        <form onSubmit={handleSubmit} className="create-project-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="fundingGoal">Funding Goal (ZMW)</label>
            <input
              type="number"
              id="fundingGoal"
              value={fundingGoal}
              onChange={(e) => setFundingGoal(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateProject;