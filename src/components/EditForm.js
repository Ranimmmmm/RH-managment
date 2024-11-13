import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditEmployeeModal({ show, handleClose, employee, handleSave, isEditing }) {
  const [formData, setFormData] = useState({
    prénom: '',
    nom: '',
    email: '',
    numérodetèl: '',
    fonction: '',
    file: null,
    filePreview: null
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        prénom: employee.prénom || '',
        nom: employee.nom || '',
        email: employee.email || '',
        numérodetèl: employee.numérodetèl || '',
        fonction: employee.fonction || '',
        file: null,
        filePreview: null
      });
    } else {
      // Reset form when adding new employee
      setFormData({
        prénom: '',
        nom: '',
        email: '',
        numérodetèl: '',
        fonction: '',
        file: null,
        filePreview: null
      });
    }
  }, [employee]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload an image (JPG, PNG) or a PDF file.');
        setFormData(prev => ({
          ...prev,
          file: null,
          filePreview: null
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        file: file,
        filePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSave = () => {
    const submitFormData = new FormData();
    submitFormData.append('prénom', formData.prénom);
    submitFormData.append('nom', formData.nom);
    submitFormData.append('email', formData.email);
    submitFormData.append('numérodetèl', formData.numérodetèl);
    submitFormData.append('fonction', formData.fonction);
    if (formData.file) {
      submitFormData.append('file', formData.file);
    }
    handleSave(submitFormData, isEditing ? employee.id : null);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Modifier l\'employé' : 'Ajouter un employé'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFirstName">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="prénom"
              value={formData.prénom}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Numéro de Tél</Form.Label>
            <Form.Control
              type="text"
              name="numérodetèl"
              value={formData.numérodetèl}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formFunction">
            <Form.Label>Fonction</Form.Label>
            <Form.Control
              type="text"
              name="fonction"
              value={formData.fonction}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Ajouter Document</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
            {formData.filePreview && (
              <div style={{ marginTop: '10px' }}>
                {formData.file && formData.file.type.includes('image/') ? (
                  <img src={formData.filePreview} alt="Preview" style={{ width: '20%' }} />
                ) : (
                  <a href={formData.filePreview} target="_blank" rel="noopener noreferrer">
                    Preview PDF
                  </a>
                )}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="primary" onClick={onSave}>
          {isEditing ? 'Sauvegarder' : 'Ajouter'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditEmployeeModal;