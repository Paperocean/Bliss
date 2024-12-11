import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { user, isLoggedIn, login, logout } = useContext(AuthContext);

  return { user, isLoggedIn, login, logout };
};

export default useAuth;
