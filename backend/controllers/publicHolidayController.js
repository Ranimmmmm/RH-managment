const { PublicHoliday, Activity } = require('../db');
const dotenv = require('dotenv');
dotenv.config();
const moment = require('moment');
const { Op } = require('sequelize');
const { checkAndMarkHolidaysForNextWeek, createHolidayActivities } = require('../utils/holidaySchedulerUtils');

// Create a public holiday
exports.createHoliday = async (req, res) => {
    const { name, date, numberOfDays, isVariable } = req.body;

    try {
        const holiday = await PublicHoliday.create({ name, date, numberOfDays, isVariable });
        res.status(201).json(holiday);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read all public holidays
exports.getAllHolidays = async (req, res) => {
    try {
        const holidays = await PublicHoliday.findAll();
        res.json(holidays);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a public holiday
exports.updateHoliday = async (req, res) => {
    const { id } = req.params;
    const { name, date, numberOfDays, isVariable } = req.body;

    try {
        const holiday = await PublicHoliday.findByPk(id);
        if (!holiday) return res.status(404).json({ message: 'Holiday not found' });

        await holiday.update({ name, date, numberOfDays, isVariable });
        res.json(holiday);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a public holiday
exports.deleteHoliday = async (req, res) => {
    const { id } = req.params;

    try {
        const holiday = await PublicHoliday.findByPk(id);
        if (!holiday) return res.status(404).json({ message: 'Holiday not found' });

        await holiday.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* exports.getcheckHoliday = async (req, res) => {
  try {
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
    console.log('Tomorrow\'s Date:', tomorrow);

    const holidays = await PublicHoliday.findAll({
      where: { date:  { [Op.eq]: tomorrow } },
    });
    console.log('Holidays Query Result:', holidays);

    if (holidays.length > 0) {
      // Fetch all employees and update their status
      await Activity.update(
        { status: 'férié' },
        { where: {} } // Update all employees
      );
      console.log("***********", res)
      res.status(200).send({ message: 'Employees updated to férié.' });
    } else {
      res.status(200).send({ message: 'No holidays for tomorrow.' });
    }
  } catch (error) {
    console.error('Error fetching holidays or updating employees:', error);

    res.status(500).send({ error: 'Failed to update employees.' });
  }
}; */

exports.checkHoliday = async (req, res) => {
  try {
      await checkAndMarkHolidaysForNextWeek();
      res.status(200).send({ message: 'Holiday check for next week completed successfully.' });
  } catch (error) {
      res.status(500).send({ error: 'Failed to check and update holidays.' });
  }
};

exports.createDefaultHolidays = async (req, res) => {
  try {
      const currentYear = moment().year();
      const defaultHolidays = [
          { date: `${currentYear}-08-13`, status: 'congé' },
          { date: `${currentYear}-04-09`, status: 'congé' },
      ];

      for (const holiday of defaultHolidays) {
          await createHolidayActivities(holiday.date, holiday.status);
      }

      res.status(200).send({ message: `Default holidays for ${currentYear} created successfully.` });
  } catch (error) {
      res.status(500).send({ error: 'Failed to create default holidays.' });
  }
};