import React from "react";
import { useCalendar } from "../../routes/App";
import { TM, TT } from "./DayTypeTurn";

function CalendarSelfList({index}){
    const calendar = useCalendar()
    const calendarList = calendar.getCalendarList();

    return(
        <>
            {calendarList && !!calendarList[0] ? (
                calendarList[0][index] === "TTM" ? (
                    <TM />
                ) : calendarList[0][index] === "TTT" ? (
                    <TT />
                ) : null
            ) : null}
        </>
    );
}

export default CalendarSelfList;