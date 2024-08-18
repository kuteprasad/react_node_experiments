import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import Home from './Home.jsx';

function App() {
  const [authStatus, setAuthStatus] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get("/api/authStatus");
      setAuthStatus(res.status === 200);
      console.log("Auth status checked : ", res.status);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [authStatus, navigate]);

  return (
    <div>
      {/* Render a loading message or a fallback UI while checking auth status */}
      {!authStatus ? <Login /> : <Home />}
    </div>
  );
}

export default App;
