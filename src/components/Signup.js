import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const EmployeeProfile = ({ employeeData }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(employeeData);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    // Here you would typically send the data back to the server
    setEditMode(false);
    console.log('Profile updated:', profile);
  };

  const data = [
    { name: 'Presence', value: profile.presence },
    { name: 'Absence', value: profile.absence },
    { name: 'Congé', value: profile.congé }
  ];

  return (
    <div className="profile-container">
      <div className="info-section">
        {editMode ? (
          <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
        ) : (
          <h2>{profile.fullName}</h2>
        )}
        <button onClick={handleEditToggle}>{editMode ? 'Save' : 'Edit'}</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie dataKey="value" isAnimationActive={false} data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
            {
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : index === 1 ? '#00C49F' : '#FFBB28'} />)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeProfile;
