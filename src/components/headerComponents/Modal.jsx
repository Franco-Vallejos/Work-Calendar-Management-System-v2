import React, {useState } from "react";
import Request from "./Request";
import "../../styles/headerStyles/Modal.css";

function Modal({ onClose, showRequests, myRequest, request}) {
    const [myRequestSelected, setMyRequestSelected] = useState(false);
    const handleOptionClick = (value) => {
      setMyRequestSelected(value);
    };
    return (
      <>
        <div className="modal-request-overlay" onClick={onClose}/>
          <div className={`requests-modal ${showRequests ? 'show' : ''}`}>
            <div className="modal-header-container">
            <button
              className={`option-button otherRequest ${!myRequestSelected ? 'selected' : ''}`}
              onClick={() => handleOptionClick(false)}
            >
              Solicitudes de Otros
            </button>
            <button
              className={`option-button myRequest ${myRequestSelected ? 'selected' : ''}`}
              onClick={() => handleOptionClick(true)}
            >
              Mis Solicitudes
            </button>
          </div>
          <div className="requests-content">
            {!myRequestSelected && request.length === 0 && 
              <div className="label-container">
                <span>No tiene solicitudes pendientes</span>
              </div>
            }
            {!myRequestSelected && 
              request.map((element, index) => (
                <Request request = {element} type = {myRequestSelected} key={index}/>
              ))
              }
            
            {myRequestSelected && myRequest.length === 0 &&  
              <div className="label-container">
                <span>No tiene solicitudes pendientes</span>
              </div>
              }
            {myRequestSelected &&
              myRequest.map((element, index) => (
                <Request request = {element} type = {myRequestSelected} key={index}/>
              ))
              }
          </div>
        </div>
      </>
    );
  }

export default Modal; 
  