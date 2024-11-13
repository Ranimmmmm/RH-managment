import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TeamActivityDashboard from './components/TeamActivityDashboard';
import ListOfEmployees from './components/ListOfEmployees'
import SideBar from './components/SideBar'
import './App.css';
import EmployeeProfile from './components/Profile';
function App() {
  const [user, setUser] = useState();

  const handleLogin = (userData) => {
    setUser(userData);  // Now just setting user data, role is not needed
  };

  return (
    <Router>
      <div className="App">
        {user && <SideBar />}
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route 
              path="/login" 
              element={
                user ? 
                <Navigate to="/employee/dashboard" replace /> :  // Directly navigate to /dashboard
                <Login onLogin={handleLogin} />
              } 
            />
               <Route path="/employee/Dashboard" element={<Dashboard  />} />
                <Route path="/employee/TeamActivity" element={<TeamActivityDashboard  />} />
                <Route path="/employee/:employeeId/:year/:month" element={<EmployeeProfile />} />   
                <Route path="employee/Listeofemployees" element={<ListOfEmployees />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;