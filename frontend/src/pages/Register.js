import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../services/authService';

import InputText from '../components/InputText';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

import '../styles/Form.css';

function Register() {
  const { isLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      setErrorMessage("Nazwa użytkownika, e-mail i hasło są wymagane do zalogowania.")
      return;
    }
  
    try {
      const response = await registerUser({
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
      });
  
      if (response.success) {
        setErrorMessage('Użytkownik został poprawnie zarejestrowany.');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Registration error: ', error);
      setErrorMessage('Rejestracja nie powiodła się. Spróbuj ponownie.');
    }
  };
  

  return (
      <div className="content-section">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Rejestracja</h1>
          <div className="form-group">
            <InputText
              label="Nazwa użytkownika:"
              type="text"
              id="username"
              name="username"
              placeholder="Wprowadź nazwę użytkownika..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <InputText
              label="E-mail:"
              type="email"
              id="email"
              name="email"
              placeholder="Wprowadź e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <InputText
              label="Hasło:"
              type="password"
              id="password"
              name="password"
              placeholder="Wprowadź hasło..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button onClick={handleSubmit}>Zarejestruj się</Button>
          <ErrorMessage message={errorMessage} />
          <p1>
            Masz już konto? <Link to="/login">Zaloguj się</Link>
          </p1>
        </form>
      </div>
  );
}

export default Register;
