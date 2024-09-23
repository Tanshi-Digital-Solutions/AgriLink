// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign } from 'lucide-react';
import './Dashboard.scss';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [landNFTs, setLandNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      setBalance(Number(balanceResult.ok));
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

      <div className="dashboard-content">
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
          <h2>Welcome, {user?.name}</h2>
          <div className="dashboard-cards">
            <div className="card">
              <h3><DollarSign size={18} /> Account Balance</h3>
              <p className="balance">{balance} ZMW</p>
              <button onClick={() => navigate('/deposit')} className="card-link">Deposit</button>
            </div>
            <div className="card">
              <h3><Briefcase size={18} /> Investments</h3>
              <p>{investments.length} active</p>
              <button onClick={() => navigate('/investments')} className="card-link">View Details</button>
            </div>
            <div className="card">
              <h3><FileText size={18} /> Projects</h3>
              <p>{projects.length} ongoing</p>
              <button onClick={() => navigate('/projects')} className="card-link">View Details</button>
            </div>
            <div className="card">
              <h3><MapPin size={18} /> Land NFTs</h3>
              <p>{landNFTs.length} owned</p>
              <button onClick={() => navigate('/land-nfts')} className="card-link">View Details</button>
            </div>
          </div>

          <section className="recent-activity">
            <h3>Recent Activity</h3>
            {/* Add recent activity list here */}
          </section>

          <section className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="quick-actions-buttons">
              <button onClick={() => navigate('/investments/new')}>New Investment</button>
              <button onClick={() => navigate('/projects/new')}>New Project</button>
              <button onClick={() => navigate('/land-nfts/marketplace')}>Browse Land NFTs</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;