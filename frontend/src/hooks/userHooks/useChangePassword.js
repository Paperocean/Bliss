import { useState } from 'react';
import { changePasswordRequest } from 'services/userService';

const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);
    setMessage('');

    try {
      const response = await changePasswordRequest(
        currentPassword,
        newPassword
      );

      if (response.success) {
        setMessage('Hasło zmienione pomyślnie.');
      } else {
        setError(response.message || 'Nie udało się zmienić hasła.');
      }
    } catch (err) {
      console.error('Error changing password:', err.message);
      setError('Wystąpił błąd przy zmianie hasła.');
    } finally {
      setIsLoading(false);
    }
  };

  return { changePassword, isLoading, error, message };
};

export default useChangePassword;
