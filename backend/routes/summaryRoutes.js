const express = require('express');
const router = express.Router();
const {getYearlySummaryLeaveByEmployeeId} = require('../controllers/LeaveController');

/*router.get('/employee/:employeeId/leave-summary/:year', async (req, res) => {
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
                   // const leaveSummary = await calculateLeaveDays(employeeId, year, month);

                    const startDate = moment([year, month - 1]).startOf('month').format('YYYY-MM-DD');
                    const endDate = moment([year, month - 1]).endOf('month').format('YYYY-MM-DD');
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
                    paidLeaveBalance: leaveSummary.paidLeaveBalance,
                    leaveUsedPaid: leaveSummary.congéDaysUsed + leaveSummary.unpaidLeave,
                    leaveBalance: leaveSummary.leaveBalance,
                    absentDays: leaveSummary.absentDays,
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
*/

router.get('/employee/leave-summary/:employeeId/:year', getYearlySummaryLeaveByEmployeeId);


module.exports = router;
