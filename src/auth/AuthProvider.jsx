import { createContext, useContext, useEffect, useState } from 'react';
import requestNewAccessToken from './requestNewAccessToken';
import '../styles/loadin.css'

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  getAccessToken: () => {},
  saveUser: (userData) => {},
  refreshToken: () => {},
  getUser: () => {},
  logOut: () => {},
});

  export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [user, setUser] = useState();
    const [isloading, setIsLoading] = useState(true);

    function saveUser(userData) {
      setAccessTokenAndRefreshToken(
        userData.body.accessToken,
        userData.body.refreshToken
      );
      setUser(userData.body.user);
      setIsAuthenticated(true);
    }

    function setAccessTokenAndRefreshToken(accessToken, refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
  
      localStorage.setItem("token", JSON.stringify({ refreshToken }));
    }

    function getRefreshToken() {
      if (!!refreshToken) {
        return refreshToken;
      }
      const token = localStorage.getItem("token");
      if (token) {
        const { refreshTokenAux } = JSON.parse(token);
        setRefreshToken(refreshTokenAux);
        return refreshTokenAux;
      }
      return null;
    }

    async function getNewAccessToken(refreshToken) {
      const token = await requestNewAccessToken(refreshToken);
      if (token) {
        return token;
      }
    }
  
    function getUser(){
      return user;
    }

    async function logOut() {
      localStorage.removeItem("token");
      setAccessToken("");
      setRefreshToken("");
      setUser(undefined);
      setIsAuthenticated(false);
      try{
        const response = await fetch(`http://localhost:5000/api/logout`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        if(!response.ok){
          console.log(response.status)
        }
      }catch(error){
        console.log(error);
      }
    }

    function getAccessToken(){
      return accessToken;
    }
      
  async function retrieveUserInfo(accessToken) {
    try {
      const response = await fetch(`http://localhost:5000/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        return json.body;
      }
    } catch (error) {}
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        if (!!accessToken) {
          //existe access token
          const userInfo = await retrieveUserInfo(accessToken);
          setUser(userInfo);
          setAccessToken(accessToken);
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          //no existe access token
          const token = localStorage.getItem("token");
          if (token) {
            const refreshTokenAux = JSON.parse(token).refreshToken;
            //pedir nuevo access token
            try{
            const newToken = await getNewAccessToken(refreshTokenAux);
            if(!newToken){
              setIsLoading(false);
              setIsAuthenticated(false);
              return;
            }
            const userInfo = await retrieveUserInfo(newToken);
            setUser(userInfo);
            setAccessToken(newToken);
            setIsAuthenticated(true);
            setIsLoading(false);

            }catch(error) {
                console.log(error);
                setIsLoading(false);
            };
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        setIsLoading(false);
      }
    } 

    checkAuth();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        setAccessTokenAndRefreshToken,
        getRefreshToken,
        saveUser,
        getUser,
        logOut,
      }}
    >
      {
      isloading ?
      <div className="loading-screen">
        <div className="loader"/>
      </div>
      : children
      }

    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);