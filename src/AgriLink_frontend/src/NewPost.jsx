import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { User, LogOut, Home, MessageSquare, Menu } from 'lucide-react';
import './NewPost.scss';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const result = await AgriLink_backend.getAllProjects();
      setProjects(result);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData = {
        content,
        projectId: projectId || null, // If no project is selected, set to null
      };

      const result = await AgriLink_backend.createPost(postData);

      if ('ok' in result) {
        navigate('/dashboard');
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
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
    <div className="create-post">
      <header className="create-post__header">
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

      <main className="create-post__main">
        <h1>Create New Post</h1>
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="content">Post Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="6"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="projectId">Related Project (Optional)</label>
            <select
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Create Post'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;