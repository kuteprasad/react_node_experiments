import React, { useState } from 'react';
import axios from "axios";

function App() {
  const [info, setInfo] = useState({
    email:'',
    password:''
  });
  const [status, setStatus] = useState(false);


  const handleChange = (e) => {
    // console.log(e.target);
    const {name, value} = e.target;

    setInfo(prevValue => ({
      ...prevValue,
      [name]:value
    }))
   
  };

  const  handleLogin = async () => {
    console.log("handleLogin called");
    console.log(info);
    
     try {
      const res = await axios.post('/api/login', info);

      setStatus(res.data.status);
     } catch (error) {
      console.log(error);
      throw error;
     }
  }

  return (
    <div>
      {/* Creating a login form with mongoDb */}
      <button>Login with Google</button>

        <input type="email" name="email" id="email" value={info.email} onChange={handleChange}/>
        <label htmlFor="email">Enter Email</label>

        <input type="password" name="password" id="password" value={info.password} onChange={handleChange}/>

        <label htmlFor="password">Enter Password</label>

        <button onClick={handleLogin}>Login</button>

        {status && <div> Logged in Successfully </div>}
     
    </div>
  );
}

export default App;
