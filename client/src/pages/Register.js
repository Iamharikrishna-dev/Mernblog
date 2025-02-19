import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('https://mernblog-six.vercel.app/api/users/register', {
        username,
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/login');
      }, 2000);
    } catch (error) {
      alert('User already exists or invalid data');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Register</h1>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={submitHandler}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
