import React, { useState } from "react";
import CalendarBase from "../UI/CalendarBase";
import './CustomCalendar.css';
const moment = require('moment');
export default function CalendarWithActivity({ activities }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleTileClassName = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const activity = activities.find((act) => moment(act.date).format("YYYY-MM-DD") === formattedDate);

    if (activity?.status === "absent") return "absent-day";
    if (activity?.status === "congé") return "leave-day";
    if (activity?.status === "férié") return "holiday-day";
    
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      {/* Calendar Component */}
      <CalendarBase
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        tileClassName={handleTileClassName}
      />
  
      {/* Color Indicators */}
      <div className="color-indicators">
        <div>
          <span className="color-box absent-day"></span> Absent
        </div>
        <div>
          <span className="color-box leave-day"></span> Congé
        </div>
        <div>
          <span className="color-box holiday-day"></span> Férié
        </div>
      </div>
    </div>
  );
  
}