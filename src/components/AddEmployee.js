import React, { useState } from 'react';
import axios from 'axios';

export default function AddEmployee({ showModal, setShowModal, fetchEmployees }) {
  const [employee, setEmployee] = useState({
    prénom: '',
    nom: '',
    email: '',
    numérodetèl: '',
    fonction: '',
    file: null,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setEmployee((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError(null);

    let data;
    let headers;

    if (employee.file) {
      // If there's a file, use FormData
      data = new FormData();
      Object.entries(employee).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value);
        }
      });
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    } else {
      // If no file, send as JSON
      data = {
        prénom: employee.prénom,
        nom: employee.nom,
        email: employee.email,
        numérodetèl: employee.numérodetèl,
        fonction: employee.fonction,
      };
      headers = {
        'Content-Type': 'application/json',
      };
    }

    try {
      console.log('Sending data:', data);
      console.log('Headers:', headers);

      const response = await axios.post('http://localhost:3000/employees/', data, { headers });
      
      console.log('Response:', response.data);

      if (response.data.success) {
        alert(response.data.message);
        fetchEmployees();
        setShowModal(false);
      } else {
        setError(response.data.message || 'An error occurred while adding the employee.');
      }
    } catch (error) {
      console.error('Full error object:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error request:', error.request);
        setError(error.response?.data?.message || 'An error occurred while adding the employee.');
      } else {
        console.error('Error adding employee:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEmployee({
      prénom: '',
      nom: '',
      email: '',
      numérodetèl: '',
      fonction: '',
      file: null,
    });
    setError(null);
  };

  return (
    <div className={`modal ${showModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Employee</h5>
            <button type="button" className="btn-close" onClick={handleModalClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddEmployee}>
              <div className="mb-3">
                <label className="form-label">Prénom</label>
                <input
                  type="text"
                  className="form-control"
                  name="prénom"
                  value={employee.prénom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  name="nom"
                  value={employee.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Numéro de téléphone</label>
                <input
                  type="text"
                  className="form-control"
                  name="numérodetèl"
                  value={employee.numérodetèl}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fonction</label>
                <input
                  type="text"
                  className="form-control"
                  name="fonction"
                  value={employee.fonction}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="file"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}