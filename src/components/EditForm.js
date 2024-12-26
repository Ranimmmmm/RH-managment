import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditEmployeeModal({ show, handleClose, employee, handleSave, isEditing }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    numerodetel: '',
    fonction: '',
    files: null,
    filePreview: null
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        prenom: employee.prenom || '',
        nom: employee.nom || '',
        email: employee.email || '',
        numerodetel: employee.numerodetel || '',
        fonction: employee.fonction || '',
        files: null,
        filePreview: employee.profile_image || `https://ui-avatars.com/api/?name=${employee.prenom || 'U'}+${employee.nom || 'U'}&background=2F4F4F&color=fff&size=128`
      });
    } else {
      // Reset form when adding new employee
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        numerodetel: '',
        fonction: '',
        files: null,
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
          files: null,
          filePreview: null
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        files: file,
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

  const onSave = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      // Basic validation
      if (!formData.prenom.trim() || !formData.nom.trim() || !formData.email.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      const submitFormData = new FormData();
      submitFormData.append('prenom', formData.prenom.trim());
      submitFormData.append('nom', formData.nom.trim());
      submitFormData.append('email', formData.email.trim());
      submitFormData.append('numerodetel', formData.numerodetel.trim());
      submitFormData.append('fonction', formData.fonction.trim());
      submitFormData.append('profile_image', formData.files);

      if (isEditing) {
        // Update existing employee
        await handleSave(submitFormData, employee.id);
      } else {
        // Add new employee
        await handleSave(submitFormData);
      }
      
      // Only close if save was successful
      handleClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={onSave}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier l\'employé' : 'Ajouter un employé'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFirstName" className="mb-3">
            <Form.Label>Prénom*</Form.Label>
            <Form.Control
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLastName" className="mb-3">
            <Form.Label>Nom*</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhone" className="mb-3">
            <Form.Label>Numéro de Tél</Form.Label>
            <Form.Control
              type="text"
              name="numerodetel"
              value={formData.numerodetel}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formFunction" className="mb-3">
            <Form.Label>Fonction</Form.Label>
            <Form.Control
              type="text"
              name="fonction"
              value={formData.fonction}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Photo de profile</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
            {formData.filePreview && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={formData.filePreview} 
                  alt="Preview" 
                  style={{ width: '20%', borderRadius: '50%' }} 
                />
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Sauvegarder' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditEmployeeModal;
