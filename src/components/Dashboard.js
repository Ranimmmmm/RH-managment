import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import './Dashboard.css'
import SideBar from './SideBar';
const Dashboard = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  const handleLogout = () => {
    googleLogout();
    navigate('/login');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <SideBar />
      <h2>{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard</h2>
      <img src={profile.picture} alt="user" className="profile-picture" />
      <h3>Welcome, {profile.name}!</h3>
      <p>Email: {profile.email}</p>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default Dashboard;