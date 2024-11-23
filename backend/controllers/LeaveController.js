const { sequelize } = require('../db'); // Assuming sequelize instance import

async function calculateLeaveDays(employeeId, year, month) {
    const transaction = await sequelize.transaction();
    try {
        const startDate = moment([year, month - 1]).startOf('month').format('YYYY-MM-DD');
        const endDate = moment([year, month - 1]).endOf('month').format('YYYY-MM-DD');
        const activities = await Activity.findAll({
            where: {
                employeeId: employeeId,
                actionDate: { [Op.between]: [startDate, endDate] },
                status: { [Op.or]: ['congé', 'absent'] }
            }
        }, { transaction });

        let congéDaysUsed = 0;
        let absentDays = 0;
        activities.forEach(activity => {
            if (activity.status === 'congé') {
                congéDaysUsed++;
            } else if (activity.status === 'absent') {
                absentDays++;
            }
        });

        const leaveDaysAccrued = 1.83;
        let leaveBalance = leaveDaysAccrued - congéDaysUsed;
        let unpaidLeave = absentDays > leaveBalance ? absentDays - leaveBalance : 0;
        leaveBalance = Math.max(0, leaveBalance - unpaidLeave);

        await LeaveTransaction.create({
            employeeId: employeeId,
            date: moment(endDate).endOf('month').toDate(),
            leaveAccrued: leaveDaysAccrued,
            leaveUsed: congéDaysUsed + unpaidLeave,
            leaveBalance: leaveBalance
        }, { transaction });

        await transaction.commit();

        return { leaveDaysAccrued, congéDaysUsed, absentDays, unpaidLeave, leaveBalance };
    } catch (error) {
        await transaction.rollback();
        console.error("Error calculating leave days:", error);
        throw error; // Re-throw the error after rollback
    }
}
