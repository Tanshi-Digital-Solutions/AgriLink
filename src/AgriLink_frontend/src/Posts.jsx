import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Menu, X, Home, Briefcase, FileText, MapPin, Users, DollarSign, Calendar, ThumbsUp, MessageSquare, Share2, User2 } from 'lucide-react';
import './Posts.scss';

const formatDate = (timestamp) => {
  if (typeof timestamp === 'bigint') {
    timestamp = Number(timestamp) / 1000000;
  } else if (typeof timestamp === 'number') {
    timestamp = timestamp;
  } else if (typeof timestamp === 'string') {
    timestamp = Date.parse(timestamp);
  }

  const date = new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', timestamp);
    return 'Invalid Date';
  }
  
  return date.toLocaleDateString();
};

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsResult = await AgriLink_backend.getAllPosts();
      console.log('Raw posts data:', postsResult);
      setPosts(postsResult);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPostContent = (content) => {
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object') {
      return JSON.stringify(content);
    }
    return 'Content unavailable';
  };

  const renderAuthor = (author) => {
    if (typeof author === 'string') {
      return author;
    }
    if (typeof author === 'object' && author._isPrincipal) {
      return 'Anonymous';
    }
    return 'Unknown Author';
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="posts-page">
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

      <div className="posts-content">
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
          <h2>Social Feed</h2>
          <div className="posts-feed">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <User2 size={24} />
                  <div className="post-info">
                    <h3>{renderAuthor(post.author)}</h3>
                    <p className="post-date">{formatDate(post.timestamp)}</p>
                  </div>
                </div>
                <p className="post-content">{renderPostContent(post.content)}</p>
                {post.projectId && (
                  <p className="post-project">Related Project: <Link to={`/projects/${post.projectId}`}>{post.projectId}</Link></p>
                )}
                <div className="post-actions">
                  <button className="action-button"><ThumbsUp size={18} /> Like</button>
                  <button className="action-button"><MessageSquare size={18} /> Comment</button>
                  <button className="action-button"><Share2 size={18} /> Share</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostsFeed;