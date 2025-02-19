import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://mernblog-six.vercel.app/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setIsLoggedIn(true);
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
      }, 2000);
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <a href="/register" className="link">
            Don’t have an account? Register here
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
