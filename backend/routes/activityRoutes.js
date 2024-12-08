const express = require('express');
const router = express.Router();
const {getemployeesActivityByDate,saveActivity, getEmployeesActivityByEmployeeId} = require('../controllers/activity.controller');

router.get('/getbyDate', getemployeesActivityByDate);

router.post('/save', saveActivity);

router.get('/employee/:employeeId/:year/:month', getEmployeesActivityByEmployeeId);

module.exports = router;
