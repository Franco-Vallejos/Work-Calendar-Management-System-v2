import React from "react";
import { useCalendar } from "../../routes/App.js";
import { TM, TT } from "./DayTypeTurn.jsx";

function CalendarAllList({index, onClickSelfWorkDate, onClickWorkDate, turnContext}){
    const calendar = useCalendar();
    const calendarList = calendar.getCalendarListAll();
    if(calendarList && index){
        const filteredElements = calendarList.filter(element => element[index]);
        return (
            <div className="container-names">{
            filteredElements.map(element => {
                const dni = element['dni'];
                const turn = element[index];
                console.log()
                if(turnContext && turn.charAt(0) !== turnContext){
                    return null;
                }
                if(turn.slice(1) === 'TM'){
                    return <div key = {dni}><TM dni = {dni} turnContext = {turn} onClickFunction={ calendar.getDni() === dni ? onClickSelfWorkDate : onClickWorkDate }/></div>
                }
                else if(turn.slice(1) === 'TT'){
                    return <div key = {dni}><TT dni = {dni} turnContext = {turn} onClickFunction={ calendar.getDni() === dni ? onClickSelfWorkDate : onClickWorkDate }/></div>
                }
                else{
                    return null
                }
                }) 
        }
        </div>
        );
    }
}

export default CalendarAllList;