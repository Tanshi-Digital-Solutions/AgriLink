import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';  
import App from './App';
import Dashboard from './Dashboard';  
import Login from './Login';
import Investments from './Investments';
import Land from './Land';
import NewInvestment from './NewInvestment';
import NewLandNFT from './NewLandNFT';
import NewPost from './NewPost';
import NewProject from './NewProject';
import Post from './Posts';
import Project from './Projects';
import ProjectDetails from './ProjectDetails';
import MyProjectsGrid from './MyProjects';
import MyLandNFTsGrid from './MyLandNfts';

import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<App />} />  
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/investments/new" element={<NewInvestment />} />  
        <Route path="/login" element={<Login />} /> 
        <Route path="/investments" element={<Investments />} /> 
        <Route path="/land-nfts" element={<Land />} /> 
        <Route path="/land-nfts/new" element={<NewLandNFT />} />
        <Route path="/posts/new" element={<NewPost />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/feed" element={<Post />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/my-projects" element={<MyProjectsGrid />} />
        <Route path="/my-land-nfts" element={<MyLandNFTsGrid />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);