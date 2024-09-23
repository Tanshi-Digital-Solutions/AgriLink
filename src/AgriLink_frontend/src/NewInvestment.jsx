import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { CreditCard, ArrowLeft, Menu, LogOut } from 'lucide-react';
import './NewInvestment.scss';

const NewInvestment = () => {
  const [investmentData, setInvestmentData] = useState({
    projectId: '',
    amount: '',
    duration: '',
    expectedReturn: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvestmentData({ ...investmentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await AgriLink_backend.createInvestment({
        projectId: investmentData.projectId,
        amount: BigInt(parseFloat(investmentData.amount) * 100), // Convert to cents
        duration: BigInt(parseInt(investmentData.duration)),
        expectedReturn: parseFloat(investmentData.expectedReturn),
      });

      if ('ok' in result) {
        setSuccess(true);
        // Reset form after successful submission
        setInvestmentData({
          projectId: '',
          amount: '',
          duration: '',
          expectedReturn: '',
        });
      } else {
        throw new Error(result.err);
      }
    } catch (err) {
      setError(err.message || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="new-investment-page">
      <header className="dashboard__header">
        <div className="logo">AgriLink</div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
        <nav className={`desktop-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/investments">Investments</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/land-nfts">Land NFTs</Link>
        </nav>
        <div className="user-menu">
          <button className="logout-btn" onClick={() => navigate('/login')}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="new-investment__main">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <h1>Create New Investment</h1>

        <form onSubmit={handleSubmit} className="investment-form">
          <div className="form-group">
            <label htmlFor="projectId">Project ID</label>
            <input
              type="text"
              id="projectId"
              name="projectId"
              value={investmentData.projectId}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Investment Amount (ZMW)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={investmentData.amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (days)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={investmentData.duration}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expectedReturn">Expected Return (%)</label>
            <input
              type="number"
              id="expectedReturn"
              name="expectedReturn"
              value={investmentData.expectedReturn}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Investment created successfully!</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Investment'}
            <CreditCard size={20} />
          </button>
        </form>
      </main>
    </div>
  );
};

export default NewInvestment;