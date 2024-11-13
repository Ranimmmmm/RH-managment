import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateNavigator = ({ setDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date) => {
    const numericDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    });
    const year = date.getFullYear();
    return `${year}-${numericDate.slice(3, 5)}-${numericDate.slice(0, 2)}`; // Convert to YYYY-MM-DD format
  };

  const adjustWorkDays = (date, days) => {
    const result = new Date(date);
    let daysAdjusted = 0;
    const increment = days > 0 ? 1 : -1;

    while (Math.abs(daysAdjusted) < Math.abs(days)) {
      result.setDate(result.getDate() + increment);
      if (result.getDay() !== 0) { // Skipping Sundays, or adjust for weekends if needed
        daysAdjusted += increment;
      }
    }
    return result;
  };

  const goBack = () => {
    const newDate = adjustWorkDays(currentDate, -1);
    setCurrentDate(newDate);
    setDate(formatDate(newDate)); // Update parent component's date
  };

  const goForward = () => {
    const newDate = adjustWorkDays(currentDate, 1);
    setCurrentDate(newDate);
    setDate(formatDate(newDate)); // Update parent component's date
  };

  const formattedDate = formatDate(currentDate);

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2 min-w-[200px]">
      <button 
        onClick={goBack}
        className="p-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <span className="px-2 text-sm font-medium">
        {formattedDate}
      </span>
      
      <button 
        onClick={goForward}
        className="p-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DateNavigator;
