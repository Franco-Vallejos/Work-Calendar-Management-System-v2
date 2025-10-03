import React from "react";
import ButtonFormat from './ButtonFormat';
import "../styles/calendarControls.css";
import { useCalendar } from "../routes/App";

function Year(){
    return(
            <div className="container-year">
                <span>{useCalendar().getYear()}</span>
            </div>
    );
}


function Controls(){
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const calendar = useCalendar();
    return(
        <div className="container-controls">
            <ToggleCalendar accion={calendar.handleOnlyMyCalendar} name = {calendar.onlyMyCalendar}/>
            <ToggleMonth className="toggleMonth" name = "<" accion={calendar.handlePrevMonth}/>
            <div className="container-month">
                <span>{monthNames[calendar.getMonth()]}</span>
            </div>
            <ToggleMonth className="toggleMonth" name = ">" accion={calendar.handleNextMonth}/>
            <ButtonFormat/>   
        </div> 
    );
}

function ToggleCalendar({accion, name}){
    return(
        <button onClick={accion}>{name ? "Todos" : "Personal"}</button>
    );
}

function ToggleMonth({name, accion}){
    return(
        <button onClick = {accion}>{name}</button>
    );
}

function CalendarControls(){
    return(
        <div className="container-fluid container-calendarControls">
            <Year />
            <Controls/>
        </div>
    );
}

export default CalendarControls;