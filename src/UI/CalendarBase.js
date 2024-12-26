import React from "react";
import moment from "moment";
import "./CalendarBase.css"; // Keep your existing styles here.

export default function CalendarBase({
  selectedDate,
  onDateChange,
  renderCellContent = () => null,
  tileClassName = () => "",
}) {
  const generateCalendarCells = () => {
    const startOfMonth = moment(selectedDate).startOf("month");
    const endOfMonth = moment(selectedDate).endOf("month");
    const daysInMonth = endOfMonth.date();
    const firstDayIndex = startOfMonth.isoWeekday();
    const cells = [];

    // Add blank cells for days before the start of the month
    for (let i = 1; i < firstDayIndex; i++) {
      cells.push(<div key={`blank-${i}`} className="calendar-cell"></div>);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(selectedDate).date(i);
      const isSelected = date.isSame(moment(selectedDate), "day");
      const extraClass = tileClassName(date.toDate());

      cells.push(
        <div
          key={`day-${i}`}
          className={`calendar-cell ${isSelected ? "selected" : ""} ${extraClass}`}
          onClick={() => onDateChange(date.toDate())}
        >
          {renderCellContent(date.toDate()) || i}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          className="calendar-nav-btn"
          onClick={() => onDateChange(moment(selectedDate).subtract(1, "month").toDate())}
        >
          &lt;
        </button>
        <div className="calendar-month-year">{moment(selectedDate).format("MMMM YYYY")}</div>
        <button
          className="calendar-nav-btn"
          onClick={() => onDateChange(moment(selectedDate).add(1, "month").toDate())}
        >
          &gt;
        </button>
      </div>
      <div className="calendar-days">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
          <div key={`day-${index}`} className="calendar-day">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-cells">{generateCalendarCells()}</div>
    </div>
  );
}
