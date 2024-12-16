import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from 'context/AuthContext';
import { loginUserRequest } from 'services/authService';

import InputText from 'components/props/InputField/InputField';
import Button from 'components/props/Button/Button';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';

import 'styles/Form.css';

const Login = () => {
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
      setErrorMessage('E-mail i hasło są wymagane do zalogowania.');
      return;
    }

    try {
      const response = await loginUserRequest({ email, password });
      if (response.success) {
        login(response.token, response.user);
        navigate('/');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Logowanie nie powiodło się. Spróbuj ponownie.');
    }
  };

  return (
    <ContentWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form-title">Logowanie</h1>

        <div className="form-group">
          <InputText
            label="E-mail:"
            type="email"
            placeholder="Wprowadź e-mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <InputText
            label="Hasło:"
            type="password"
            placeholder="Wprowadź hasło..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit">Zaloguj się</Button>

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <p className="form-footer">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </form>
    </ContentWrapper>
  );
};

export default Login;
