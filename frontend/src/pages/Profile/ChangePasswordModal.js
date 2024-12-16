import React, { useState } from 'react';
import Modal from 'components/props/Modal/Modal';
import InputText from 'components/props/InputField/InputField';
import Button from 'components/props/Button/Button';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import useChangePassword from 'hooks/userHooks/useChangePassword';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { changePassword, isLoading, error, message } = useChangePassword();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ensure preventDefault is called on the event object
    await changePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Zmień hasło</h2>
      {error && <ErrorMessage message={error} />}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <InputText
            label="Aktualne hasło:"
            type="password"
            placeholder="Wprowadź aktualne hasło..."
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <InputText
            label="Nowe hasło:"
            type="password"
            placeholder="Wprowadź nowe hasło..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Zmieniam...' : 'Zmień hasło'}
        </Button>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
