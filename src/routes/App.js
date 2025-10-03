import '../styles/App.css';
import '../styles/loadin.css';
import Body from '../components/Body';
import PersonalCalendar from '../components/PersonalCalendar';
import {useAuth } from '../auth/AuthProvider';
import { createContext, useEffect, useState , useContext} from 'react';
import Header from '../components/headerComponents/Header';

export const calendarContext = createContext({
  esFormat: true,
  onlyMyCalendar: true,
  getDni: () => {},
  getTodayDate: () => {},
  getCalendarList: () => {},
  getCalendarListAll: () => {},
  getPersonalList: () => {},
  getMonth: () => {},
  getYear: () => {},
  getUserRequest: () => {},
  getNameByDNI: (dni) => {},
  handleNextMonth: () => {},
  handlePrevMonth: () => {},
  handleOnlyMyCalendar: () => {},
  handleFormat: () => {},
  reloadUserRequest: () => {},
  getCalendarListByDni: (dni) => {},
})


export async function apiGetCalendar(token, month, dni){
  if (!month){
    return;
  }
  try {
    const response = await fetch(`http://localhost:5000/api/query/calendar/${getMonth(month)}?dni=${dni}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      return json.body;
    }
  } catch (error) {
    console.log(error)
  }
}


async function apiGetPersonal(token) {
  try {
    const response = await fetch(`http://localhost:5000/api/query/personal/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const json = await response.json();
      return json.body;
    }
  } catch (error) {
    console.log(error)
  }
}

async function apiGetUserRequest(token) {
  try {
    const response = await fetch(`http://localhost:5000/api/query/request/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const json = await response.json();
      return json.body;
    }
  } catch (error) {
    console.log(error);
  }
}

export function getMonth(month) {
  const months = ['january', 'february', 'march', 'april', 'may', 
                  'june', 'july', 'august', 'october', 'september', 'november', 'december'];

  return months[month];
}

function App() {
  const [calendarList, setCalendarList] = useState({});
  const [calendarListAll, setCalendarListAll] = useState({});
  const [personalList, setPersonalList] = useState({});
  const [userRequest, setUserRequest] = useState();
  const [esFormat, setFormat] = useState(true);
  const [onlyMyCalendar, setOnlyMyCalendar] = useState(true);
  const [todayDate] = useState(new Date());

  const initialMonth = todayDate.getMonth();
  const initialYear = todayDate.getFullYear();
  const nowYear = todayDate.getFullYear();

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const auth = useAuth();

  const [dni, setDni] = useState(auth.getUser() ? auth.getUser().username : undefined);

  const handleFormat = () => {
    setFormat(!esFormat);
  };
  
  const handleOnlyMyCalendar = () => {
    setOnlyMyCalendar((onlyMyCalendar) =>(!onlyMyCalendar))
  }
  
  const getTodayDate = () => {
    return todayDate;
  }
  
  const getMonth = () =>{
    return month;
  }
  const getYear = () =>{
    return year;
  }
  
  const getPersonalList = () => {
    return personalList;
  }
  
  const getCalendarList = () => {
    return calendarList;
  }

  const getCalendarListAll = () => {
    return calendarListAll;
  }
  
  const getDni = () => {
    return dni;
  }

  const getUserRequest = () => {
    return userRequest;
  }
  
  useEffect(() => {
    async  function getLists() {
      const token = auth.getAccessToken();
      setDni(auth.getUser() ? auth.getUser().username : undefined);
      setPersonalList(await apiGetPersonal(token));
      setCalendarList(await apiGetCalendar(token, month, dni));
      setCalendarListAll(await apiGetCalendar(token, month, ''))
      setUserRequest(await apiGetUserRequest(token))
    }
    getLists();
  }, [month, dni, auth, onlyMyCalendar, setCalendarList, setPersonalList, setCalendarListAll, setUserRequest])
  
  const handlePrevMonth = () => {
    const prevMonth = ((month - 1) === -1 ? 11 : (month - 1));
    const prevNowMonth = ((todayDate.getMonth() - 1) === -1 ? 11 : (todayDate.getMonth() - 1));
    if(month === prevNowMonth)
      return;
    setYear((year) => (year === (nowYear - 1) ? year : ((prevMonth - 1) === -1 ? year - 1 : year)));
    setMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = ((month + 1) === 12 ? 0 : (month + 1))
    const nextNowMonth = ((todayDate.getMonth() + 1) === 12 ? 0 : (todayDate.getMonth() + 1))
    if(month === nextNowMonth)
      return;
    setYear((year) => (year === (nowYear + 1) ? year : ((nextMonth + 1) === 12 ? year + 1 : year)));
    setMonth(nextMonth);
  };
  
  const getNameByDNI = (dni) => {
    const personalList = getPersonalList();
    if(!personalList)
      return;
    for (let i = 0; i < personalList.length; i++) {
      if (personalList[i].dni === dni) {
        return personalList[i].namesurname;
      }
    }
    return dni;
  };

  const reloadUserRequest = async () => {
    setUserRequest(await apiGetUserRequest(auth.getAccessToken()));
  }

  const getCalendarListByDni = (dni) => {
    return calendarListAll.find(element => element['dni'] === dni);
  };
  
  return (
      <calendarContext.Provider
      value={{
        esFormat,
        onlyMyCalendar,
        getDni,
        getTodayDate,
        getCalendarList,
        getPersonalList,
        getCalendarListAll,
        getMonth,
        getYear,
        getNameByDNI,
        getUserRequest,
        handleNextMonth,
        handlePrevMonth,
        handleOnlyMyCalendar,
        handleFormat,
        reloadUserRequest,
        getCalendarListByDni,
      }}
      >
        {dni ? (
          <div className='container-fluid container clearfix'>
            <Body>
              <Header/>
              <PersonalCalendar/>
            </Body>
          </div>
        ) : (
          <div  className="loading-screen">
            <div  className="loader"/>
          </div>
          )}
      </calendarContext.Provider>
  );
}

export default App;


export const useCalendar = () => useContext(calendarContext);