import React, { createContext } from "react";
import "../../styles/calendarStyles/calendar.css"
import {useCalendar} from '../../routes/App.js'
import { useState, useContext} from "react";
import Day from "./Day.jsx";
import CalendarAllList from "./CalendarAllList.jsx";
import CalendarSelfList from "./CalendarSelfList.jsx";
import Modal from "./Modal.jsx";

export const workDateChangeContext = createContext({
    getDateSelected: () => {},
    getSelfWorkDateSelected: () => {},
    setSelfDateChange: () => {},
    setSelfWorkDateSelected: () => {},
    onClose: () => {},
})

export function Calendar(){
    const [showModal, setShowModal] = useState(false);
    const [dateSelected, setSelfDateChange] = useState();
    const [selfWorkDateSelected, setSelfWorkDateSelected] = useState();
    const weekDayEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const weekDayEn = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const calendar = useCalendar();

    const handleDayClick = (day) => {
        const date = new Date(calendar.getYear(), calendar.getMonth(), day)
        setSelfDateChange(date);
        setShowModal(true);
    };
  
    const getDayName = (index) => {
        return calendar.esFormat ? weekDayEs[index] : weekDayEn[index];
    };

    const onClose = () => {
        setShowModal(false);
    }

    const getDateSelected = () => {
        return dateSelected;
    }

    const getSelfWorkDateSelected = () => {
        return selfWorkDateSelected;
    }
    
    let today = new Date();
    const todayMonth = today.getMonth();
    today = today.getDate();

    const firstDayCurrentMonth = new Date(calendar.getYear(), calendar.getMonth(), 1);
    const lasthDayPreviusMonth = new Date(calendar.getYear(), calendar.getMonth(), 0).getDate();
    const lasthDayCurrentMonth = new Date(calendar.getYear(), calendar.getMonth() + 1, 0).getDate();

    const firstDayWeekCurrentMonth = firstDayCurrentMonth.getDay();

    const lastDayPreviusMonth = Array.from({ length: firstDayWeekCurrentMonth - (calendar.esFormat ? 0 : 1)}, (_, index) => lasthDayPreviusMonth - index).reverse();
    const daysCurrentMonth = Array.from({ length: lasthDayCurrentMonth }, (_, index) => index + 1);
    
    const lastDaysInCalendar = 7 -(new Date(calendar.getYear(), calendar.getMonth() + 1, 1).getDay()) + (calendar.esFormat ? 0 : 1) 
    const firstDaysNextMont = Array.from({ length: (lastDaysInCalendar === 7 ? 0 : lastDaysInCalendar) }, (_, index) => index + 1);
    
    const getDayPreviusMonth = (index) => {
        return lastDayPreviusMonth[index];
    }
    const getDayCurrentMonth = (index) => {
        return daysCurrentMonth[index];
    }
    const getDayNextMonth = (index) => {
        return firstDaysNextMont[index];
    }

    return(
    <div className="container-calendar">
            {calendar.esFormat ?
                weekDayEs.map((dayName, index) => (
                    <div className="container-weekday" key={index}>
                        {getDayName(index)}
                    </div>
                )) :
                weekDayEn.map((dayName, index) => (
                    <div className="container-weekday" key={index}>
                        {getDayName(index)}
                    </div>
                ))
            }
        {showModal && (
            <workDateChangeContext.Provider
            value={{
                getDateSelected,
                getSelfWorkDateSelected,
                setSelfDateChange,
                setSelfWorkDateSelected,
                onClose,
            }}>
                <Modal/>
            </workDateChangeContext.Provider>
        )}

            {
                lastDayPreviusMonth.map((monthNum, index) => (
                    <div className="container-noCurrentMonth" key={index}>
                        <Day day = {getDayPreviusMonth(index)}/>
                    </div>
                ))
            }
            {
                daysCurrentMonth.map((monthNum, index) => (
                    <div key={index} onClick={() => handleDayClick(index + 1)} className={`container-currentMonth
                         ${calendar.getMonth() === todayMonth && (index + 1) === today ? ' container-today ' : ' '}
                         ${selfWorkDateSelected && selfWorkDateSelected['date'] && (selfWorkDateSelected['date'].getDate() === (index + 1) && 
                         (selfWorkDateSelected['date'].getMonth() === (calendar.getMonth()))) ? ' container-selfDaySelected ' : ' '}`}>
                        <Day day={getDayCurrentMonth(index)} />
                    {calendar.onlyMyCalendar ?
                        <CalendarSelfList index = {index + 1}/>
                    :
                        <CalendarAllList index= {index + 1}/>
                    }
                    </div>
                ))
            }

                {
                firstDaysNextMont ? 
                firstDaysNextMont.map((monthNum, index) => (
                    <div className="container-noCurrentMonth" key={index}>
                        <Day day = {getDayNextMonth(index)}/>
                    </div> 
                )): null
            }
        </div>
    );
}

export const useWorkDateChangeContext = () => useContext(workDateChangeContext)