module.exports = (sequelize, DataTypes) => {
    const LeaveTransaction = sequelize.define('LeaveTransaction', {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      leaveAccrued: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      leaveUsed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      leaveBalance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      tableName: 'leave_transactions'
    });
    return LeaveTransaction;
  };
  