import { useState } from 'react';
import axios from 'axios';

function App() {
  const [msg, setMsg] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('/api/login', {
        email: email,
        password: password
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (data.success) {
        setMsg('Login successful');
      } else {
        setMsg('Login unsuccessful');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMsg('Login unsuccessful');
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={onSubmitHandler}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      {msg && <h1>{msg}</h1>}
    </div>
  );
}

export default App;
