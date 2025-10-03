import React from "react";
import '../../styles/calendarStyles/Day.css'

function Day({ day, today}) {
    return (
      <div
        className={`container-day ${today ? " container-today" : ""}`}
      >
        <span>{day}</span>
      </div>
    );
  }

export default Day;