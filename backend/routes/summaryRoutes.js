const express = require('express');
const router = express.Router();
const moment = require('moment');
const { Op } = require('sequelize');
const { Activity, Employee, LeaveTransaction, Sequelize } = require('../db');


router.get('/employee/:employeeId/leave-summary/:year', async (req, res) => {
    const { employeeId, year } = req.params;
    const { months } = req.query;

    try {
        // Parse months
        const monthsArray = months ? months.split(',').map(Number).filter(m => m >= 1 && m <= 12) : [];
        if (!monthsArray.length) {
            return res.status(400).send({ error: 'No valid months specified' });
        }

        // Fetch LeaveTransaction data and aggregate by month
        const summaries = await Promise.all(
            monthsArray.map(async (month) => {
                // Fetch LeaveTransaction data for the month
                const leaveTransaction = await LeaveTransaction.findOne({
                    where: { employeeId, year, month },
                });
                console.log('leave trans:' , leaveTransaction);

                const leaveAccrued = leaveTransaction ? leaveTransaction.leaveAccrued : 1.83;
                const leaveUsed = leaveTransaction ? leaveTransaction.leaveUsed : 0;
                const leaveBalance = leaveTransaction ? leaveTransaction.remainingLeave : leaveAccrued - leaveUsed;

                // Fetch Activity details for the month
                const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
                const endDate = moment(`${year}-${month}-01`).endOf('month').toDate();

                const activity = await Activity.findAll({
                    where: {
                        employeeId,
                        actionDate: { [Op.between]: [startDate, endDate] },
                        status: 'congé'
                    },
                });
                console.log(activity)
                // Combine data for the summary
                return {
                    month,
                    leaveAccrued,
                    leaveUsed,
                    leaveBalance,
                    activityDetails: activity
                        ? {
                              status: activity.status || '--',
                              inTime: activity.inTime || '--',
                              outTime: activity.outTime || '--',
                              numberOfMissions: activity.numberOfMissions || 0,
                              paidLeaveBalance: activity.paidLeaveBalance || 0,
                          }
                        : '--',
                };
            })
        );

        // Compute yearly summary
        const totalLeaveUsed = summaries.reduce((sum, s) => sum + s.leaveUsed, 0);
        const totalLeaveAccrued = 1.83 * 12; // Assuming 1.83 days accrued per month for a full year
        const remainingLeave = totalLeaveAccrued - totalLeaveUsed;

        res.json({
            summaries,
            yearlySummary: {
                totalLeaveUsed,
                totalLeaveAccrued,
                remainingLeave,
            },
        });

    } catch (error) {
        console.error('Error processing leave summary:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});



module.exports = router;



module.exports = router;