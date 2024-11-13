import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import './ListOfEmployees.css';
import EditEmployeeModal from './EditForm';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [refreshList]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employees/all');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const closeModals = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setIsEditing(false);
  };
  const handleSave = async (formData, id) => {
    try {
      // Log the formData to see what's being sent
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      if (isEditing && id) {
        // Update employee
        const response = await axios.put(`http://localhost:3000/employees/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        
        if (response.data) {
          const updatedEmployees = employees.map(emp => 
            emp.id === id ? response.data : emp
          );
          setEmployees(updatedEmployees);
          setRefreshList(prev => !prev);
        }
      } else {
        // Add new employee - with error handling
        try {
          // First, validate the form data
          if (!formData.get('prénom') || !formData.get('nom') || !formData.get('email')) {
            throw new Error('Please fill in all required fields');
          }

          // Add employee with explicit error handling
          const response = await axios.post('http://localhost:3000/employees/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            // Add timeout and validation
            timeout: 5000,
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
          });

          if (response.status === 201 || response.status === 200) {
            // Successfully added
            setEmployees(prev => [...prev, response.data]);
            setError(null);
            closeModals();
          } else {
            throw new Error(`Server responded with status: ${response.status}`);
          }
        } catch (err) {
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server Error:', err.response.data);
            setError(`Server Error: ${err.response.data.message || 'Unknown error occurred'}`);
          } else if (err.request) {
            // The request was made but no response was received
            console.error('Network Error:', err.request);
            setError('Network error - no response received');
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', err.message);
            setError(err.message);
          }
          throw err; // Re-throw to prevent modal from closing
        }
      }
    } catch (err) {
      console.error('Error saving employee:', err);
      setError(err.message || 'An error occurred while saving');
      // Don't close modal if there's an error
      return;
    }
  };
  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/employees/${id}`);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <SideBar />
      <div className="employee-container">
        <h1>Liste d'employées</h1>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Fonction</th>
              <th>Gérer</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.prénom} {employee.nom}</td>
                <td>{employee.fonction}</td>
                <td>
                  <button type="button" onClick={() => openEditModal(employee)}>
                    Modifier
                  </button>
                  <button onClick={() => handleDeleteEmployee(employee.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-employee" onClick={openAddModal}>
          Ajouter un employé
        </button>

        <EditEmployeeModal
          show={showModal}
          handleClose={closeModals}
          employee={selectedEmployee}
          handleSave={handleSave}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}

export default EmployeeList;