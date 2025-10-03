import React, { useState } from "react";
import CalendarAllList from "./CalendarAllList";
import '../../styles/calendarStyles/Modal.css'
import { useCalendar } from "../../routes/App";
import { useWorkDateChangeContext } from "./Calendar.jsx";
import { useAuth } from "../../auth/AuthProvider.jsx";


function Modal() {
    const [isSelfWorkDateSelected, setIsSelfWorkDateSelected] = useState(false);
    const [isOtherWorkDateSelected, setIsOtherWorkDateSelected] = useState(false);
    const [userDateSelected, setUserDateSelected] = useState('');
    const calendar = useCalendar();
    const workDateChangeContext = useWorkDateChangeContext();
    const dateSelected = workDateChangeContext.getDateSelected();
    const myDateSelected = workDateChangeContext.getSelfWorkDateSelected();
    const turn = isSelfWorkDateSelected || isOtherWorkDateSelected ? calendar.getCalendarListByDni(isSelfWorkDateSelected ? calendar.getDni() : userDateSelected)[dateSelected.getDate()]: undefined;
    const auth = useAuth();

    const checkDate = () => {
        if (dateSelected.getMonth() <= calendar.getTodayDate().getMonth() && dateSelected.getDate() < calendar.getTodayDate().getDate())
        return false;
    return true;
}

    const onClickSelfWorkDate = () => {
    if (!checkDate())
            return;
        setIsSelfWorkDateSelected(true);
    }
    
    const onClickWorkDate = (user) => {
        if (!workDateChangeContext.getSelfWorkDateSelected() || !dateSelected || !checkDate())
            return;
        setUserDateSelected(user);
        setIsOtherWorkDateSelected(true);
    }
    
    const onClickSelfWorkDateButton = () => {
        workDateChangeContext.setSelfWorkDateSelected({'date' : dateSelected,
                                                        'turn' : turn});
        setIsSelfWorkDateSelected(false);
        workDateChangeContext.onClose();
    }
    
    const onClickWordDateButton = async () => {
        const destinationDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth(), dateSelected.getDate()); 
        await addUserRequest(auth.getAccessToken(), calendar.getDni(), workDateChangeContext.getSelfWorkDateSelected()['date'], userDateSelected,destinationDate);
        setIsOtherWorkDateSelected(false);
        calendar.reloadUserRequest();
        workDateChangeContext.setSelfWorkDateSelected('');
        workDateChangeContext.onClose();
    }

    if (isOtherWorkDateSelected)
    return (
<>
                <div className="modal-overlay" onClick={workDateChangeContext.onClose} />
                <div className="modal-container">
                    <div className="modal">
                        <span>
                            {'Desea cambiar su turno ' + (myDateSelected['turn'].slice(1) === 'TM' ? 'mañana' : 'tarde') + 
                            (myDateSelected['turn'].charAt(0) === 'T' ? ' en Sala Técnica' : ' en Planta Receptora')
                            + ' del ' + 
                            myDateSelected['date'].getDate()+ '/' +
                            myDateSelected['date'].getMonth()+ '/' +
                            myDateSelected['date'].getFullYear() +
                            ' por el turno ' + (turn.slice(1) === 'TM' ? 'mañana' : 'tarde') + 
                            (turn.charAt(0) === 'T' ? ' en Sala Técnica' : ' en Planta Receptora') + ' de ' + calendar.getNameByDNI(userDateSelected) + ' del ' +
                            dateSelected.getDate() + '/' + dateSelected.getMonth() + '/' + dateSelected.getFullYear() + ' ?'}
                        </span>
                        <div className="container-button">
                            <button className="button-accept" onClick={onClickWordDateButton}>Si</button>
                            <button className="button-cancel" onClick={() => setIsOtherWorkDateSelected(false)}>No</button>
                        </div>
                    </div>
                </div>
            </>
        );
        
    else if (isSelfWorkDateSelected)
    return (
            <>
                <div className="modal-overlay" onClick={workDateChangeContext.onClose} />
                <div className="modal-container">
                    <div className="modal">
                        <span>{'Desea cambiar el turno ' + (turn.slice(1) === 'TM' ? 'mañana' : 'tarde') + 
                        (turn.charAt(0) === 'T' ? ' en Sala Técnica' : ' en Planta Receptora') + 
                        ' del día ' + dateSelected.getDate() + '/' + dateSelected.getMonth() + '/' + dateSelected.getFullYear() + ' ?'}</span>
                        <div className="container-button">
                            <button className="button-accept" onClick={onClickSelfWorkDateButton}>Si</button>
                            <button className="button-cancel" onClick={() => {setIsSelfWorkDateSelected(false); workDateChangeContext.setSelfWorkDateSelected(''); workDateChangeContext.onClose()}}>No</button>
                        </div>
                    </div>
                </div>
            </>
        );
        
        else
        return (
    <>
                <div className="modal-overlay" onClick={workDateChangeContext.onClose} />
                <div className="modal-container">
                    <div className="modal">
                        <div className="modal-day">
                            <span>{dateSelected.getDate()}</span>
                        </div>
                        <div className="modal-tittle">
                            <span>Turno Sala Técnica</span>
                        </div>
                        <CalendarAllList index={dateSelected.getDate()} onClickSelfWorkDate={onClickSelfWorkDate} 
                            onClickWorkDate={onClickWorkDate} turnContext={'T'}/>
                        <div className="modal-tittle">
                            <span>Turno Planta Receptora</span>
                        </div>
                        <CalendarAllList index={dateSelected.getDate()} onClickSelfWorkDate={onClickSelfWorkDate} 
                            onClickWorkDate={onClickWorkDate} turnContext={'R'}/>
                    </div>
                </div>
            </>
        );
    }
    
    export default Modal;

async function addUserRequest(token, originDni, originDate, destinationDni, destinationDate) {
    console.log(originDni);
    console.log(originDate);
    console.log(destinationDni);
    console.log(destinationDate);
    
    try {
    const response = await fetch(`http://localhost:5000/api/query/request/add`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            originDni: originDni,
            originDate: originDate,
            destinationDni: destinationDni,
            destinationDate: destinationDate
        }),
    });

    if (response.ok) {
        const json = await response.json();
        return json.body;
    }
    } catch (error) {
    console.log(error)
    }
}
