import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Investments.scss';
import AddButton from './components/Button';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const UserInvestments = () => {
  const [user, setUser] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  }, [user]);

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

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const investmentsResult = await AgriLink_backend.getUserInvestments(user.id);
      setInvestments(investmentsResult);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setError('Failed to fetch investments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const projectCount = new Set(investments.map(inv => inv.projectId)).size;

  const investmentsByProject = investments.reduce((acc, inv) => {
    if (!acc[inv.projectId]) {
      acc[inv.projectId] = 0;
    }
    acc[inv.projectId] += Number(inv.amount);
    return acc;
  }, {});

  const pieChartData = Object.entries(investmentsByProject).map(([projectId, amount]) => ({
    name: projectId,
    value: amount
  }));

  const barChartData = Object.entries(investmentsByProject).map(([projectId, amount]) => ({
    projectId,
    amount
  }));

  if (loading) {
    return <div className="loading">Loading investment data...</div>;
  }

  return (
    <div className="user-investments-page">
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
            <Link to="/land-nfts"><MapPin size={18} /> NFTs</Link>
            <Link to="/contact"><Users size={18} /> Contact Us</Link>
          </nav>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="user-investments-content">
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
          <h2>My Investments</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="investment-summary">
            <div className="summary-card">
              <h3>Total Investment</h3>
              <p className="summary-value">{totalInvestment.toLocaleString()} ZMW</p>
            </div>
            <div className="summary-card">
              <h3>Projects Invested</h3>
              <p className="summary-value">{projectCount}</p>
            </div>
          </div>
          <div className="investment-charts">
            <div className="chart-container">
              <h3><PieChartIcon size={18} /> Investment Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h3><BarChartIcon size={18} /> Investment by Project</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="projectId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="investment-list">
            <h3>Recent Investments</h3>
            <ul>
              {investments.slice(0, 5).map((investment, index) => (
                <li key={index}>
                  <span>Project: {investment.projectId}</span>
                  <span>Amount: {Number(investment.amount).toLocaleString()} ZMW</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    <AddButton/>  
    </div>
  );
};

export default UserInvestments;