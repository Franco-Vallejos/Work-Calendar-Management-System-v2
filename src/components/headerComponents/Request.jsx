import React from "react";
import { useCalendar } from "../../routes/App";
import { useAuth } from "../../auth/AuthProvider";
import  "../../styles/headerStyles/Request.css"


function Request({request, type}) {
    const calendar = useCalendar();
    const auth = useAuth()
    const originUser = calendar.getNameByDNI(request.originDni);
    const originDate = sqlToJsDate(request.originDate);
    const destinationDate = sqlToJsDate(request.destinationDate);

    const handleElim = async() =>{
        await elimRequest(auth.getAccessToken(), request);
        calendar.reloadUserRequest();
    }

    const handleAccept = async() =>{
        await updateCalendar(auth.getAccessToken(), request)
        calendar.reloadUserRequest()
    }

    const handleReject = async() =>{
        await rejectRequest(auth.getAccessToken(), request)
        calendar.reloadUserRequest()
    }

    return(
        <>
        <div className={"request-container request-" + request.state}>
            <span>{originUser} solicita turno {originDate.getDate() + '/' + (originDate.getMonth() + 1) + ' '} 
                    por el turno {destinationDate.getDate() + '/' + (destinationDate.getMonth() + 1)}
            </span>
        </div>
        <div className="button-container">
                { type? 
                <button className="button-elim" onClick={() => {handleElim()}}>eliminar</button>
                :
                <>
                <button className="button-accept" onClick = {() => {handleAccept()}}>aceptar</button>
                <button className="button-reject" onClick = {() => {handleReject()}}>rechazar</button>
                </>
                }                            
        </div>
        </>
    );
}

async function elimRequest (token, request){
    try {
    const response = await fetch(`http://localhost:5000/api/query/request/delete`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id : request.id
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


async function rejectRequest (token, request){
    try {
    const response = await fetch(`http://localhost:5000/api/query/request/reject-request`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id : request.id
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

async function updateCalendar (token, request){
    try {
    const response = await fetch(`http://localhost:5000/api/query/request/update-calendar`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id : request.id
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




function sqlToJsDate(sqlDate){
    const sqlDateArray1 = sqlDate.split("-");
    const year = sqlDateArray1[0];
    const month = (Number(sqlDateArray1[1]) - 1).toString();
    const sqlDateArray2 = sqlDateArray1[2].split("T");
    const day = sqlDateArray2[0];

    return new Date(year, month, day);
}

export default Request;