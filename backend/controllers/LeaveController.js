
const express = require('express');
const router = express.Router();
const { Activity , Sequelize} = require('../db');  
const moment = require('moment');
const { Op } = require('sequelize');
 async function calculateLeaveDays(employeeId, year, month) {
    const startDate = moment([year, month - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([year, month - 1]).endOf('month').format('YYYY-MM-DD');
    const ABSENT = 'absent';
    const CONGÉ = 'congé';
    const activities = await Activity.findAll({
        where: {
            employeeId: employeeId,
            actionDate: {
                [Op.between]: [startDate, endDate]
            },
            status:  { [Op.or]: [CONGÉ, ABSENT] }
        }
    });

    // Calculate 'congé' days and 'absent' days
    let congéDaysUsed = 0;
    let absentDays = 0;
    activities.forEach(activity => {
        if (activity.status === CONGÉ) {
            congéDaysUsed++;
        } else if (activity.status === ABSENT) {
            absentDays++;
        }
    });

    const leaveDaysAccrued = 1.83; // Accrued paid leave days per month
    let leaveBalance = leaveDaysAccrued - congéDaysUsed;
    let unpaidLeave = 0;

    // Check if absent days should consume remaining paid leave or count as unpaid
    if (leaveBalance > 0) {
        if (absentDays > leaveBalance) {
            unpaidLeave = absentDays - leaveBalance;
            leaveBalance = 0;
        } else {
            leaveBalance -= absentDays;
        }
    } else {
        unpaidLeave = absentDays;
    }

    return {
        leaveDaysAccrued,
        congéDaysUsed,
        absentDays,
        unpaidLeave,
        leaveBalance
    };
}
module.exports = {
    calculateLeaveDays
};