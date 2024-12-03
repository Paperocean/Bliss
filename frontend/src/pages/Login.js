import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

import { AuthContext } from '../context/AuthContext'; 
import { loginUser } from '../services/authService'; 

import InputText from '../components/InputText';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

import '../styles/Form.css';

function Login() {
  const { isLoggedIn, login } = useContext(AuthContext);
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

    if (!email || !password) {
      setErrorMessage("E-mail i hasło są wymagane do zalogowania.")
      return;
    }

    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        login(response.token, response.user);
        setErrorMessage('Logowanie powiodło się.');
        navigate('/');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Login error: ', error);
      setErrorMessage('Logowanie nie powiodło się. Spróbój ponownie.');
    }
  };

  return (
      <div className="content-section">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Logowanie</h1>
          <div className="form-group">
            <InputText
              label="E-mail:"
              type="email"
              id="username"
              name="username"
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
            />
          </div>
          <Button type="submit">Zaloguj się</Button>
          <ErrorMessage message={errorMessage} />
          <p1>
            Nie masz konta? <Link to="/register">Zarejestruj się</Link>
          </p1>
        </form>
      </div>
  );
}

export default Login;
