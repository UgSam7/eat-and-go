import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

   useEffect(() => {
  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get('token');

  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    navigate('/home'); 
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4001/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Login fallito:', error);
      alert('Email o password errati');
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>

      <hr />

      <button
        onClick={() =>
          window.location.href = 'http://localhost:4001/api/auth/login-google'
        }
      >
        Login con Google
      </button>
    </div>
  );
};

export default Login;

