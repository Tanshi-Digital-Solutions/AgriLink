import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import './Projects.scss';

const bigIntToNumber = (value) => {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  return value;
};

const formatDate = (timestamp) => {
  if (typeof timestamp === 'bigint') {
    // Convert nanoseconds to milliseconds
    timestamp = Number(timestamp) / 1000000;
  } else if (typeof timestamp === 'number') {
    // If it's already a number, assume it's in milliseconds
    timestamp = timestamp;
  } else if (typeof timestamp === 'string') {
    // If it's a string, try parsing it
    timestamp = Date.parse(timestamp);
  }

  const date = new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', timestamp);
    return 'Invalid Date';
  }
  
  return date.toLocaleDateString();
};

const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const MyProjectsGrid = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProjects();
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

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const projectsResult = await AgriLink_backend.getUserProjects(user.id);
      const convertedProjects = projectsResult.map(project => ({
        ...project,
        fundingGoal: bigIntToNumber(project.fundingGoal),
        currentFunding: bigIntToNumber(project.currentFunding),
        startDate: formatDate(project.startDate),
        endDate: formatDate(project.endDate)
      }));
      setProjects(convertedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
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

      <div className="projects-content">
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
          <h2>My Projects</h2>
          {error && <p className="error-message">{error}</p>}
          {projects.length === 0 ? (
            <p>You don't have any projects yet.</p>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => handleProjectClick(project.id)}>
                  <h3>{project.name}</h3>
                  <p className="project-description">{truncateText(project.description, 35)}</p>
                  <div className="project-details">
                    <p><strong>Project ID:</strong> {project.id}</p>
                    <p><DollarSign size={16} /> <strong>Funding Goal:</strong> {project.fundingGoal} ZMW</p>
                    <p><Calendar size={16} /> <strong>Start Date:</strong> {project.startDate}</p>
                    <p><Calendar size={16} /> <strong>End Date:</strong> {project.endDate}</p>
                  </div>
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{width: `${(project.currentFunding / project.fundingGoal) * 100}%`}}
                      ></div>
                    </div>
                    <p>{Math.round((project.currentFunding / project.fundingGoal) * 100)}% funded</p>
                  </div>
                  <button className="view-details-button">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyProjectsGrid;