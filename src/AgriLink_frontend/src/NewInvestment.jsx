import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './NewInvestment.scss';

const NewInvestment = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    amount: '',
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
      const result = await AgriLink_backend.fundProject(
        formData.projectId,
        BigInt(formData.amount)
      );

      if ('ok' in result) {
        setSuccess(`Investment successful. New total funding: ${result.ok} ZMW`);
        setFormData({ projectId: '', amount: '' });
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('An error occurred while creating the investment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-investment-page">
      <Header />
      <div className="new-investment-content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          <h2>Make a New Investment</h2>
          {user && (
            <p>Investing as: {user.name} (ID: {user.id.toString()})</p>
          )}
          <form className="new-investment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="projectId">Select Project:</label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="amount">Investment Amount (ZMW):</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <button type="submit" className="submit-button" disabled={loading || !user}>
              {loading ? 'Investing...' : 'Make Investment'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </main>
      </div>
    </div>
  );
};

export default NewInvestment;