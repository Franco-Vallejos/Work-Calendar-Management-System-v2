import '../styles/login.css'
import { useEffect, useState } from "react";
import { useAuth} from "../auth/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loginTry = () =>{
      if(auth.isAuthenticated){
        navigate('/loged');
      }
    }
    loginTry()
  },[auth.isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userName, password)
    try{
        const response = await fetch('http://localhost:5000/api/login',{
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
          },
          body: JSON.stringify({
            userName,
            password
          })
        });
      if(response.ok){
        const json = await response.json()
        if(json.body.accessToken && json.body.refreshToken){
          auth.saveUser(json)
          navigate("/loged")
        }
        setErrorResponse("");
      }
      else{
        console.log("Something went wrong");
        const json = await response.json();
        setErrorResponse(json.body.error)
      }
    } catch(error){
      setErrorResponse("SERVER NOT RESPOND")
    }
  };

  return (
    <form className= "container-forms" onSubmit={handleSubmit}>
      <h1>Login</h1>
      {!!errorResponse && (<div className="container-errorMessage">{errorResponse}</div>)}

      <div className= "container-labels">
        <label>DNI</label>
        <input className='input' type="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />

        <label>Password</label>
        <input className='input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <input type="submit" value="Login" />
    </form>
  );
}

export default Login;
