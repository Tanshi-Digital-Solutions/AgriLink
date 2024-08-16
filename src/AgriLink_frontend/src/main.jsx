import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';  
import App from './App';
import Dashboard from './Dashboard';  
import Login from './Login';
import Investments from './Investments';
import Land from './Land';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<App />} />  
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/login" element={<Login />} /> 
        <Route path="/investments" element={<Investments />} /> 
        <Route path="/land-nfts" element={<Land />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);