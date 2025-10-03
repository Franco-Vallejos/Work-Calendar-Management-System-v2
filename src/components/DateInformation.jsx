import React from "react";
import {useCalendar} from '../routes/App.js'

function DateInformation(){
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const calendar = useCalendar();
    return(
        <div>
            <h1>{calendar.getYear()}</h1>
            <h2>{monthNames[calendar.getMonth()]}</h2>
        </div>
    );
}

export default DateInformation;