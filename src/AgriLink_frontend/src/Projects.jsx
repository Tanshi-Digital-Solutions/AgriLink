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

const ProjectsGrid = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsResult = await AgriLink_backend.getAllProjects();
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
          <h2>Available Projects</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card" onClick={() => handleProjectClick(project.id)}>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
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
        </main>
      </div>
    </div>
  );
};

export default ProjectsGrid;