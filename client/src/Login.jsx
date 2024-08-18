import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {
   const navigate = useNavigate();

  const [info, setInfo] = useState({
    email:'',
    password:''
  });
  const [status, setStatus] = useState(true);

  const handleChange = (e) => {
    const {name, value} = e.target;

    setInfo(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    console.log("handleLogin called");
    console.log(info);

    const obj = {
      username: info.email,
      password: info.password
    };

    try {
      const res = await axios.post('/api/login', obj);
      console.log("axios respones: ", res.data);
      
      if (res.data.status) {
        navigate("/home");  // Redirect to home if login is successful
      } else {
        setStatus(false);  // Show login failed message
      }
    } catch (error) {
      console.log("Error during login:", error);
      setStatus(false);  // Show login failed message
    }
  };

  return (
    <div>
      <button>Login with Google</button>

      <input type="email" name="email" id="email" value={info.email} onChange={handleChange}/>
      <label htmlFor="email">Enter Email</label>

      <input type="password" name="password" id="password" value={info.password} onChange={handleChange}/>
      <label htmlFor="password">Enter Password</label>

      <button onClick={handleLogin}>Login</button>

      {!status && <div> Log in Failed!</div>}
    </div>
  );
}

export default Login;
