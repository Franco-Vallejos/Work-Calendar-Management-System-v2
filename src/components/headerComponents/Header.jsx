import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useCalendar } from "../../routes/App";
import "../../styles/headerStyles/Header.css";
import Modal from "./Modal";

function Header() {
  const auth = useAuth();
  const calendar = useCalendar();
  const dni = calendar.getDni();
  const username = calendar.getNameByDNI(dni);
  const userRequestList = calendar.getUserRequest();
  const myRequest = userRequestList ? userRequestList.filter(
    (element) => element.originDni === calendar.getDni()
  ) : undefined;
  const request = userRequestList ? userRequestList.filter(
    (element) =>
      element.destinationDni === calendar.getDni() && element.state === "waiting"
  ) : undefined;

  const [showRequests, setShowRequests] = useState(false);
  const [isYellow, setIsYellow] = useState(false);

  useEffect(() => {
    let intervalId;

    if (request ? request.length > 0 : false) {
      intervalId = setInterval(() => {
        setIsYellow((prevIsYellow) => !prevIsYellow);
      }, isYellow ? 750 : 1000);
    } else {
      clearInterval(intervalId);
      setIsYellow(false);
    }

    return () => clearInterval(intervalId);
  }, [request, isYellow]);

  const onClose = () => {
    setShowRequests(false);
  };

  return (
    <div className="header-container">
      <span className="welcome-message">¡Bienvenido, {username}!</span>
      <div className="button-container">
        <div className="requests-container">
          <button
            className={`notification-button ${isYellow ? "yellow" : "blue"}`}
            onClick={() => setShowRequests(true)}
          >
            Solicitudes
          </button>
          {showRequests && (
            <Modal onClose={onClose} showRequests={showRequests} myRequest={myRequest} request={request}/>
          )}
        </div>
        <button className="logout-button" onClick={() => auth.logOut()}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
