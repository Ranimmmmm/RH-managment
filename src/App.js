import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import TeamActivityDashboard from './components/TeamActivityDashboard';
import EmployeeList from './components/ListOfEmployees';
import PublicHolidaysDashboard from './components/PublicHolidaydashboard';
import './App.css';
import EmployeeProfile from './components/Profile';
import EmployeeActivityHistory from './components/EmployeeActivityHistory'
function App() {
  


  return (
    <Router>
      <div className="App">
         
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/login" 
              element={localStorage.getItem('token')?
                <Navigate to="/employee/TeamActivity" replace  /> : <Login />
              } 
            />
                <Route path="/employee/TeamActivity" element={<TeamActivityDashboard  />} />
                <Route path="/employee/:employeeId/:year/:month" element={<EmployeeProfile />} />   
                <Route path="/employee/:employeeId/details" element={<EmployeeActivityHistory />} />
                <Route path="employee/Listeofemployees" element={<EmployeeList />} />
                <Route path="/public-holidays" element={<PublicHolidaysDashboard />} />

            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;