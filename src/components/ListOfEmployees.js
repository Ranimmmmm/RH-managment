import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import './ListOfEmployees.css';
import EditEmployeeModal from './EditForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  //const [employeeDetails, setEmployeeDetails] = useState(null);

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
  const handleSave = async (formData, id = null) => {
  try {
    // Log the FormData content for debugging
    console.log('FormData content:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    if (id) {
      // Update employee 
      try {
        const response = await axios.put(`http://localhost:3000/employees/${id}`, formData, console.log("***********",formData), {
          headers: { 'Content-Type': 'multipart/form-data' }
  
        });
        console.log('Employee updated:', response.data);
        setEmployees(prev =>
          prev.map(emp => (emp.id === id ? response.data : emp))
        );
      } catch (error) {
        if (error.response) {
          console.error('Error data:', error.response.data); // Log the server error
      }
      }
      // Update the local state with the updated employee
     
    } else {
      // Add new employee
      const response = await axios.post('http://localhost:3000/employees/', formData, {
        headers: {'Content-Type': 'multipart/form-data' }

      });
      console.log('Employee added:', response.data);

      // Add the new employee to the local state
      setEmployees(prev => [...prev, response.data]);
    }

    // Reset error, close the modal, and refresh the list
    setError(null);
    setRefreshList(prev => !prev);
  } catch (err) {
    console.error('Error saving employee:', err);

    // Handle server and network errors
    if (err.response) {
      setError(`Server Error: ${err.response.data.message || 'Unknown error occurred'}`);
    } else if (err.request) {
      setError('Network Error: No response received');
    } else {
      setError(err.message || 'An unexpected error occurred');
    }
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
                <td>
                <img
                    src={employee.profile_image}
                   alt=""
                    className="rounded-circle mr-3"
                   width="45"
                   height="45"
                />
                 {employee.prenom} {employee.nom}
                </td>
                <td>{employee.fonction}</td>
                <td>
                  <button type="button" onClick={() => openEditModal(employee)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteEmployee(employee.id)}>
                   <FontAwesomeIcon icon={faTrash} />
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