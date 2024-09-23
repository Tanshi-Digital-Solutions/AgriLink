import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import './ProjectDetails.scss';

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

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectResult = await AgriLink_backend.getProject(projectId);
        const convertedProject = {
          ...projectResult,
          fundingGoal: bigIntToNumber(projectResult.fundingGoal),
          currentFunding: bigIntToNumber(projectResult.currentFunding),
          startDate: formatDate(projectResult.startDate),
          endDate: formatDate(projectResult.endDate)
        };
        setProject(convertedProject);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-details-page">
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

      <div className="project-details-content">
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
          <div className="project-details-card">
            <h2>{project.name}</h2>
            <p className="description">{project.description}</p>
            <div className="details">
              <p><strong>Project ID:</strong> {project.id}</p>
              <p><DollarSign size={16} /> <strong>Funding Goal:</strong> {project.fundingGoal} ZMW</p>
              <p><DollarSign size={16} /> <strong>Current Funding:</strong> {project.currentFunding} ZMW</p>
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
            <button className="invest-button">Invest Now</button>
            <button className="back-button" onClick={() => navigate('/projects')}>Back to Projects</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;