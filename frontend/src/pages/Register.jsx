import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]  = useState('');
  const [email, setEmail]        = useState('');
  const [password, setPassword]  = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4001/api/auth/register', {
        firstName,
        lastName,
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Registrazione fallita:', error);
      alert('Errore durante la registrazione.');
    }
  };

  return (
    <div>
      <h2>Registrati</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cognome"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
