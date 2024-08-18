import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const callLogOut = async () => {
    try {
      await axios.get("/api/logout");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error occurred in Home: ", error);
    }
  };

  return (
    <div>
      <h1>This is the Home page</h1>
      <button type="button" onClick={callLogOut}>Logout</button>
    </div>
  );
}

export default Home;
