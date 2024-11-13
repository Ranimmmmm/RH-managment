const express = require('express');
const router = express.Router();
const { Activity, Employee, Sequelize } = require('../db');
const moment = require('moment');
const { Op } = require('sequelize');
const { calculateLeaveDays } = require('../controllers/LeaveController');

// Existing route to get activities by a specific date
router.get('/getbyDate', async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).send({ error: 'Date parameter is required.' });
    }

    const startDate = moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(date).endOf('day').format('YYYY-MM-DD ');

    try {
        const employees = await Employee.findAll({
            include: [{
                model: Activity,
                where: { actionDate: { [Op.between]: [startDate, endDate] } },
                required: false
            }]
        });
        res.json(employees);
    } catch (error) {
        console.error('Failed to retrieve employees and their activities:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
// Route to save or update activity
router.post('/save', async (req, res) => {
    const { employeeId, inTime, outTime, status, numberOfMissions, actionDate } = req.body;
    console.log(req.body);
    console.log (actionDate);
    const formattedActionDate = moment(actionDate, true).isValid()
    ? moment(actionDate).format('YYYY-MM-DD')
    : null;

    if (!formattedActionDate) {
     console.error("Invalid actionDate provided:", actionDate);
     return res.status(400).json({ error: 'Invalid actionDate format' });
    }
    const startDate = moment(actionDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(actionDate).endOf('day').format('YYYY-MM-DD HH:mm:ss ');

    try {
        let activity = await Activity.findOne({
            where: { employeeId: employeeId, actionDate: formattedActionDate }
        });
        console.log("activity :",activity);

        if (activity) {
            await activity.update({
                inTime: inTime,
                outTime: outTime,
                status: status,
                numberOfMissions: numberOfMissions,
                updatedAt: new Date()
            });
            res.json(activity);
        } else {
            const formattedActionDate = moment(actionDate).format('YYYY-MM-DD HH:mm:ss');
            const newActivity = await Activity.create({
                employeeId: employeeId,
                inTime: inTime,
                outTime: outTime,
                status: status,
                numberOfMissions: numberOfMissions,
                actionDate: formattedActionDate,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            res.json(newActivity);
        }
    } catch ( error) {
        console.error('Failed to save or update activity:', error);
        res.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
});
/* router.get('/employee/:employeeId/range', async (req, res) => {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    try {
        const activities = await Activity.findAll({
            where: {
                employeeId: employeeId,
                actionDate: {
                    [Op.between]: [moment(startDate).startOf('day').toDate(), moment(endDate).endOf('day').toDate()]
                }
            },
            order: [['actionDate', 'ASC']]
        });
        res.json(activities);
    } catch (error) {
        console.error('Failed to retrieve activities by range:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}); */

// Corrected route to get activities for a specific employee and month/year
router.get('/employee/:employeeId/:year/:month', async (req, res) => {
    const { employeeId, year, month } = req.params;

    // Calculate the start and end dates for the specified month
    const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    try {
        // Fetch all activities for the employee in the specified month
        const activities = await Activity.findAll({
            where: {
                employeeId: employeeId,
                updatedAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['updatedAt', 'DESC']]
        });

        // Group activities by date, taking only the latest update per day
        const latestActivitiesByDay = activities.reduce((acc, activity) => {
            const day = moment(activity.updatedAt).format('YYYY-MM-DD');
            if (!acc[day]) {
                acc[day] = {
                    date: day,
                    status: activity.status,
                    inTime: activity.inTime,
                    outTime: activity.outTime,
                    numberOfMissions: activity.numberOfMissions,
                    paidLeaveBalance: activity.paidLeaveBalance,
                    updatedAt: activity.updatedAt,
                };
            }
            return acc;
        }, {});

        // Generate full month with placeholders for missing days
        const daysInMonth = moment(endDate).date();
        const activitiesByDayArray = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = moment(`${year}-${month}-${day}`).format('YYYY-MM-DD');
            if (latestActivitiesByDay[date]) {
                activitiesByDayArray.push(latestActivitiesByDay[date]);
            } else {
                activitiesByDayArray.push({
                    date,
                    status: 'No activity',
                    inTime: '--',
                    outTime: '--',
                    numberOfMissions: 0,
                    paidLeaveBalance: 0,
                });
            }
        }

        res.json(activitiesByDayArray);
    } catch (error) {
        console.error('Failed to retrieve activities grouped by day:', error); // Log the error message
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


// Route to get activities within a date range
router.get('/employee/:employeeId/getByDateRange', async (req, res) => {
    const { startDate, endDate } = req.query;
    const { employeeId } = req.params;

    if (!startDate || !endDate) {
        return res.status(400).send({ error: 'startDate and endDate are required parameters.' });
    }

    try {
        // Fetch all activities for the employee within the date range
        const activities = await Activity.findAll({
            where: {
                employeeId: employeeId,
                actionDate: {
                    [Op.between]: [
                        moment(startDate).startOf('day').toDate(),
                        moment(endDate).endOf('day').toDate()
                    ]
                }
            },
            order: [['actionDate', 'ASC']]
        });

        // Map activities by date for quick lookup
        const activitiesMap = activities.reduce((acc, activity) => {
            const date = moment(activity.actionDate).format('YYYY-MM-DD');
            if (!acc[date] || acc[date].updatedAt < activity.updatedAt) {
                acc[date] = {
                    date: date,
                    status: activity.status,
                    inTime: activity.inTime || '--',
                    outTime: activity.outTime || '--',
                    numberOfMissions: activity.numberOfMissions || 0,
                    paidLeaveBalance: activity.paidLeaveBalance || 0,
                };
            }
            return acc;
        }, {});

        // Generate a complete date range with placeholders for missing days
        const dateRangeActivities = [];
        let currentDate = moment(startDate);

        while (currentDate.isSameOrBefore(endDate, 'day')) {
            const dateStr = currentDate.format('YYYY-MM-DD');
            if (activitiesMap[dateStr]) {
                dateRangeActivities.push(activitiesMap[dateStr]);
            } else {
                // Add a placeholder for dates with no activity
                dateRangeActivities.push({
                    date: dateStr,
                    status: 'No activity',
                    inTime: '--',
                    outTime: '--',
                    numberOfMissions: 0,
                    paidLeaveBalance: 0,
                });
            }
            currentDate = currentDate.add(1, 'day');
        }

        res.json(dateRangeActivities);
    } catch (error) {
        console.error('Failed to retrieve activities by date range:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});




module.exports = router;
