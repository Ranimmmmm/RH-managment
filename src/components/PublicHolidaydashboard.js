import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

import './PublicHolidaydashboard.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './SideBar';

const PublicHolidayDashboard = () => {
    const [holidays, setHolidays] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        isSingleDay: true,
        type: '',
        status: '',
        id: ''
    });
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        loadHolidays();
    }, []);

    const loadHolidays = () => {
        axios
            .get('http://localhost:3000/public-holidays/holidays')
            .then((response) => {
                setHolidays(response.data);
            })
            .catch(() => {
                setErrorMsg('Failed to fetch public holidays.');
            });
    };

    const handleSave = (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            date: formData.startDate,
            numberOfDays: formData.isSingleDay
                ? 1
                : Math.ceil(
                      (new Date(formData.endDate) - new Date(formData.startDate)) /
                          (1000 * 60 * 60 * 24)
                  ) + 1,
            type: formData.type,
            status: formData.status,
        };

        const apiCall = isEditing
            ? axios.put(`http://localhost:3000/public-holidays/${formData.id}`, payload, {
                  headers: { 'Content-Type': 'application/json' },
              })
            : axios.post('http://localhost:3000/public-holidays/', payload, {
                  headers: { 'Content-Type': 'application/json' },
              });

        apiCall
            .then(() => {
                toast.success('Jour férié enregistré avec succès.', {
                    icon: <FontAwesomeIcon icon={faCheckCircle} color="#ffffff" />,
                    style: { backgroundColor: '#28a745', color: '#ffffff' },
                });
                handleClose();
                loadHolidays();
            })
            .catch(() => {
                setErrorMsg('Impossible de sauvegarder.');
            });
    };

    const handleEdit = (holiday) => {
        setFormData({
            name: holiday.name,
            startDate: holiday.date,
            endDate:
                holiday.numberOfDays > 1
                    ? new Date(
                          new Date(holiday.date).getTime() +
                              (holiday.numberOfDays - 1) * 24 * 60 * 60 * 1000
                      )
                          .toISOString()
                          .split('T')[0]
                    : '',
            isSingleDay: holiday.numberOfDays === 1,
            type: holiday.type,
            status: holiday.status,
            id: holiday.id,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:3000/public-holidays/${id}`)
            .then(() => {
                toast.success('Supprimé avec succès.', {
                    icon: <FontAwesomeIcon icon={faTrash} color="#ffffff" />,
                    style: { backgroundColor: '#dc3545', color: '#ffffff' },
                });
                loadHolidays();
            })
            .catch(() => {
                setErrorMsg('Impossible de supprimer.');
            });
    };

    const handleClose = () => {
        setShowModal(false);
        setFormData({
            name: '',
            startDate: '',
            endDate: '',
            isSingleDay: true,
            type: '',
            status: '',
            id: '',
        });
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <Sidebar />
            <div className="public-holidays-dashboard">
                <h2>Jours fériés</h2>
                {errorMsg && <p className="error">{errorMsg}</p>}

                <table className="table table-hover">
                    <thead className="table-dark border-0 shadow-sm">
                        <tr>
                            <th>Nom</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holidays.map((holiday) => (
                            <tr key={holiday.id}>
                                <td className="d-flex justify-content-between align-items-center">
                                    <span>{holiday.name}</span>
                                    <div>
                                        <button
                                            className="edit-btn me-2"
                                            onClick={() => handleEdit(holiday)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(holiday.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={() => setShowModal(true)} className="add-btn">
                    Ajouter un jour férié
                </button>

                <Modal show={showModal} onHide={handleClose}>
                    <Form onSubmit={handleSave}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {isEditing ? 'Modifier le jour férié' : 'Ajouter un jour férié'}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="formName" className="mb-3">
                                <Form.Label>Nom*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formType" className="mb-3">
                                <Form.Label>Type*</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="fix payé">Fix Payé</option>
                                    <option value="fix non payé">Fix Non Payé</option>
                                    <option value="variable payé">Variable Payé</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formStatus" className="mb-3">
                                <Form.Label>Status*</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="férié">Férié</option>
                                    <option value="congé">Congé</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formIsSingleDay" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Un seul jour"
                                    name="isSingleDay"
                                    checked={formData.isSingleDay}
                                    onChange={() =>
                                        setFormData({
                                            ...formData,
                                            isSingleDay: !formData.isSingleDay,
                                            endDate: !formData.isSingleDay ? '' : formData.startDate,
                                        })
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="formStartDate" className="mb-3">
                                <Form.Label>
                                    {formData.isSingleDay ? 'Date*' : 'Date de début*'}
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            {!formData.isSingleDay && (
                                <Form.Group controlId="formEndDate" className="mb-3">
                                    <Form.Label>Date de fin*</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit">
                  {isEditing ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
  
          <ToastContainer />
        </div>
      </div>
    );
  };
  
  export default PublicHolidayDashboard; 
