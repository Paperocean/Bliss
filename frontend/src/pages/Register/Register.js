import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from 'context/AuthContext';
import { registerUserRequest } from 'services/authService';

import InputField from 'components/props/InputField/InputField';
import Button from 'components/props/Button/Button';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import Select from 'components/props/Select/Select';

import 'styles/Form.css';

const Register = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
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
    const trimmedRole = role.trim();

    if (trimmedUsername.length < 5 || trimmedUsername.length > 16) {
      setErrorMessage('Nazwa użytkownika musi mieć od 5 do 16 znaków.');
      return;
    }

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      setErrorMessage(
        'Nazwa użytkownika, e-mail i hasło są wymagane do rejestracji.'
      );
      return;
    }

    try {
      const response = await registerUserRequest({
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
        role: trimmedRole,
      });

      if (response.success) {
        setErrorMessage('Użytkownik został poprawnie zarejestrowany.');
        navigate('/login');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Rejestracja nie powiodła się. Spróbuj ponownie.');
    }
  };

  useEffect(() => {
    document.title = 'Rejestracja';
  }, []);

  return (
    <ContentWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form-title">Rejestracja</h1>

        <div className="form-group">
          <InputField
            label="Nazwa użytkownika:"
            type="text"
            placeholder="Wprowadź nazwę użytkownika..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <InputField
            label="E-mail:"
            type="email"
            placeholder="Wprowadź e-mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <InputField
            label="Hasło:"
            type="password"
            placeholder="Wprowadź hasło..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Rola:</label>
          <Select
            options={[
              { value: 'buyer', label: 'Kupujący' },
              { value: 'organizer', label: 'Organizator' },
            ]}
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          ></Select>
        </div>

        <Button type="submit">Zarejestruj się</Button>

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <p className="form-footer">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </form>
    </ContentWrapper>
  );
};

export default Register;
