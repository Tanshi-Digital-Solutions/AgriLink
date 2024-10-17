import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, MessageSquare } from 'lucide-react';
import './NewPost.scss';

const NewPost = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    projectId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchProjects();
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

  const fetchProjects = async () => {
    try {
      const projectsResult = await AgriLink_backend.getAllProjects();
      setProjects(projectsResult);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects. Please try again.');
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
      const result = await AgriLink_backend.createPost({
        content: formData.content,
        projectId: formData.projectId ? [formData.projectId] : [],
      });

      if ('ok' in result) {
        setSuccess('Post created successfully!');
        setFormData({ content: '', projectId: '' });
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('An error occurred while creating the post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post-page">
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

      <div className="new-post-content">
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
            <Link to="/feed"><FileText size={18} /> My Feed</Link>
            <Link to="/land-nfts"><MapPin size={18} /> My Land NFTs</Link>
          </nav>
        </aside>

        <main className="main-content">
          <h2>Create a New Post</h2>
          {user && (
            <p>Posting as: {user.name} (ID: {user.id.toString()})</p>
          )}
          <form className="new-post-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">Post Content:</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows="5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectId">Related Project (Optional):</label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
              >
                <option value="">Select a project (optional)</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button" disabled={loading || !user}>
              {loading ? 'Posting...' : 'Create Post'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </main>
      </div>
    </div>
  );
};

export default NewPost;