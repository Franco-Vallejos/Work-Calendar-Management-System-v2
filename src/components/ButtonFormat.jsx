import React from 'react';
import { useCalendar } from '../routes/App';

function ButtonFormat() {    
    const calendar = useCalendar()
    return (
        <button onClick={calendar.handleFormat}>{calendar.esFormat ? "Domingo - Sabado" : "Lunes - Domingo"}</button>
    );
}

export default ButtonFormat;
