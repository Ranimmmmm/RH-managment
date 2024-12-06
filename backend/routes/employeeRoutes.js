const express = require('express');
const router = express.Router();
const { Employee } = require('../db'); // Ensure this imports correctly
const multer = require('multer');
const employee = require('../models/employee');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, path.join(__dirname,"../files"))
  },
  filename: function (req,file,cb){
    cb(null, new Date().toISOString() + file.originalname.replace(/:/g, "-"));
  }
})
const upload = multer({storage})
router.get('/all', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send({ error: "Internal Server Error", message: err.message });
  }
});

// Get an employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).send({ error: "Internal Server Error", message: err.message });
  }
});

// Create a new employee
router.post('/',  async (req, res) => {
  try {
      const { prenom, nom, email, numerodetel, fonction } = req.body;
      const profileImage = req.file ? req.file.path : null;
      console.log('Received fields:', req.body);
      console.log('Received file:', req.file);
      if (!prenom || !nom || !email || !numerodetel || !fonction) {
        return res.status(400).json({
          message: 'All fields are required',
          success: false,
        });
      }
      const emp = new Employee({
          prenom,
          nom,
          email,
          numerodetel,
          fonction,
          profileImage,
      });
      console.log('emp', req.body);

      await emp.save();
      res.status(201).json({
          message: 'Employee Created',
          success: true,
      });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({
          message: 'Internal Server Error',
          success: false,
          error: err.message || err,
      });
  }
});

// Update an employee
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
      const { prenom, nom, email, numerodetel, fonction } = req.body;
      const file = req.file ? req.file.path : null;

      const employee = await Employee.findByPk(req.params.id);
      if (!employee) {
        return res.status(404).json({
          message: 'Employee not found',
          success: false
        });
      }
      if (employee) {
          const updatedData = {
            prenom: prenom || employee.prenom,
              nom: nom || employee.nom,
              email: email || employee.email,
              numerodetel: numerodetel || employee.numerodetel,
              fonction: fonction || employee.fonction,
              file: file || employee.file,
          };

          const updatedEmployee = await employee.update(updatedData);
          res.json({
              message: 'Employee Updated',
              success: true,
              data: updatedEmployee,
          });
          console.log(updatedEmployee)
      } else {
          res.status(404).send('Employee not found');
      }
  } catch (err) {
      console.error('Error updating employee:', err);
      res.status(500).send({
          error: 'Internal Server Error',
          message: err.message,
      });
  }
});


// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    const numDeleted = await Employee.destroy({
      where: { id: req.params.id }
    });
    if (numDeleted) {
      res.status(204).send();
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).send({ error: "Internal Server Error", message: err.message });
  }
});

module.exports = router;
