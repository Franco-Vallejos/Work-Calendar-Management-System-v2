import React from "react";
import {Calendar} from './calendarComponents/Calendar';
import CalendarControls from "./CalendarControls";

function PersonalCalendar(){
    return(
        <div className="container-pc">
            <CalendarControls/>
            <Calendar/>
        </div>
    );
}

export default PersonalCalendar;