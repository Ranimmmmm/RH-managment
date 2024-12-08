const { Employee } = require('../db');
const dotenv = require('dotenv');
dotenv.config();


const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send({ error: "Internal Server Error", message: err.message });
  }
};

const getEmployeeById = async (req, res) => {
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
};

const createEmployee = async (req, res) => {
  try {
    const { prenom, nom, email, numerodetel, fonction } = req.body;

    const profileImage = req.files['profile_image']
      ? req.files['profile_image'][0].filename
      : null;

    const filesArray = req.files['files']
      ? req.files['files'].map(file => `${process.env.BASE_URL}/profiles/${file.filename}`)
      : [];


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
      profile_image: profileImage
        ? `${process.env.BASE_URL}/profiles/${profileImage}`
        : null,
      files: filesArray,
    });


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
};

const updateEmployee = async (req, res) => {
  try {
    const { prenom, nom, email, numerodetel, fonction } = req.body;

    const profileImage = req.files['profile_image']
      ? req.files['profile_image'][0].filename
      : null;
      
    const filesArray = req.files['files']
      ? req.files['files'].map(file => `${process.env.BASE_URL}/profiles/${file.filename}`)
      : null;

    const employee = await Employee.findByPk(req.params.id);
    console.log('-----------------Employee--------------------------/n', employee)
    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found',
        success: false
      });
    }
    else {
      const updatedEmployee = await employee.update(
        prenom || employee.prenom,
        nom || employee.nom,
        email || employee.email,
        numerodetel || employee.numerodetel,
        fonction || employee.fonction,
        profileImage
          ? `${process.env.BASE_URL}/profiles/${profileImage}`
          : employee.profile_image,
        filesArray
          ? filesArray : employee.files);

      res.json({
        message: 'Employee Updated',
        success: true,
        data: updatedEmployee,
      });
    }
    /*if (employee) {
      const updatedData = {
        prenom: prenom || employee.prenom,
        nom: nom || employee.nom,
        email: email || employee.email,
        numerodetel: numerodetel || employee.numerodetel,
        fonction: fonction || employee.fonction,
        file: file || employee.file,
      };

      const updatedEmployee = await employee.update(updatedData);*/

    console.log(updatedEmployee)
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).send({
      error: 'Internal Server Error',
      message: err.message,
    });
  }
};


const deleteEmployee = async (req, res) => {
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
};


module.exports = {
  getAllEmployee,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
