// Investments.jsx
import React, { useState, useEffect } from 'react';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import './Investments.scss';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const userResult = await AgriLink_backend.getUser();
      if ('ok' in userResult) {
        const investmentsResult = await AgriLink_backend.getUserInvestments(userResult.ok.id);
        setInvestments(investmentsResult);
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      setError('An error occurred while fetching investments');
    } finally {
      setLoading(false);
    }
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);

  const barChartData = {
    labels: investments.map(inv => inv.projectId),
    datasets: [
      {
        label: 'Investment Amount',
        data: investments.map(inv => inv.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: investments.map(inv => inv.projectId),
    datasets: [
      {
        data: investments.map(inv => inv.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading investments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="investments-container">
      <h1>Your Investments</h1>
      <div className="investment-summary">
        <div className="summary-card">
          <h2>Total Investment</h2>
          <p className="total-amount">{totalInvestment} tokens</p>
        </div>
        <div className="summary-card">
          <h2>Number of Investments</h2>
          <p className="investment-count">{investments.length}</p>
        </div>
      </div>
      <div className="charts-container">
        <div className="chart">
          <h2>Investment Distribution</h2>
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart">
          <h2>Investment Breakdown</h2>
          <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="investments-list">
        <h2>Investment Details</h2>
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.projectId}</td>
                <td>{inv.amount} tokens</td>
                <td>{new Date(inv.timestamp / 1000000).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Investments;