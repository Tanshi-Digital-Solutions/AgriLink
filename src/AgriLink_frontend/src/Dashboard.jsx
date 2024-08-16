import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import './Dashboard.scss'

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [landNFTs, setLandNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userResult = await AgriLink_backend.getUser();
      if ('ok' in userResult) {
        const userData = userResult.ok;
        setUser(userData);
        await Promise.all([
          fetchBalance(userData.id),
          fetchInvestments(userData.id),
          fetchProjects(userData.id),
          fetchLandNFTs(userData.id)
        ]);
      } else {
        // Handle the case where the user is not logged in
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    const balanceResult = await AgriLink_backend.getBalance();
    if ('ok' in balanceResult) {
      setBalance(Number(balanceResult.ok)); // Convert BigInt to Number
    }
  };

  const fetchInvestments = async (userId) => {
    const investmentsResult = await AgriLink_backend.getUserInvestments(userId);
    setInvestments(investmentsResult);
  };

  const fetchProjects = async (userId) => {
    const projectsResult = await AgriLink_backend.getUserProjects(userId);
    setProjects(projectsResult);
  };

  const fetchLandNFTs = async (userId) => {
    const landNFTsResult = await AgriLink_backend.getUserLandNFTs(userId);
    setLandNFTs(landNFTsResult);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <nav className="dashboard-nav">
          <Link to="/investments">Investments</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/land-nfts">Land NFTs</Link>
        </nav>
      </header>
      <div className="dashboard-content">
        <div className="dashboard-summary">
          <div className="summary-card">
            <h2>Account Balance</h2>
            <p>{balance} ZMW</p>
          </div>
          <div className="summary-card">
            <h2>Investments</h2>
            <p>{investments.length} active</p>
            <Link to="/investments">View Details</Link>
          </div>
          <div className="summary-card">
            <h2>Projects</h2>
            <p>{projects.length} ongoing</p>
            <Link to="/projects">View Details</Link>
          </div>
          <div className="summary-card">
            <h2>Land NFTs</h2>
            <p>{landNFTs.length} owned</p>
            <Link to="/land-nfts">View Details</Link>
          </div>
        </div>
        <div className="dashboard-details">
          <section className="recent-activity">
            <h2>Recent Activity</h2>
            {/* Add recent activity list here */}
          </section>
          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <button onClick={() => navigate('/investments/new')}>New Investment</button>
            <button onClick={() => navigate('/projects/new')}>New Project</button>
            <button onClick={() => navigate('/land-nfts/marketplace')}>Browse Land NFTs</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
