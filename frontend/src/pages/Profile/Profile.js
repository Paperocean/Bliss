import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from 'context/AuthContext';
import useUserProfile from 'hooks/userHooks/useUserProfile';
import useUserTickets from 'hooks/userHooks/useUserTickets';

import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import List from 'components/props/List/List';
import Table from 'components/props/Table/Table';
import Button from 'components/props/Button/Button';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();
  const {
    tickets,
    loading: ticketsLoading,
    error: ticketsError,
  } = useUserTickets();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const columnsUserInfo = [
    {
      header: 'E-mail',
      accessor: (row) => row.email || 'N/A',
    },
    {
      header: 'Nazwa użytkownika',
      accessor: (row) => row.username || 'N/A',
    },
  ];

  const columnsTickets = [
    {
      header: 'Wydarzenie',
      accessor: (row) => row.event_name || 'N/A',
    },
    {
      header: 'Miejsce',
      accessor: (row) => row.seat_label || 'N/A',
    },
    {
      header: 'Cena',
      accessor: (row) => `${row.price} zł`,
    },
    {
      header: 'Data zakupu',
      accessor: (row) => new Date(row.purchase_time).toLocaleString(),
    },
    {
      render: (row) => <Button>Pobierz</Button>,
    },
  ];

  return (
    <ContentWrapper>
      <div>
        <h1>Twój profil</h1>
        {profileError && <ErrorMessage message={profileError} />}
        {profileLoading ? (
          <p>Ładowanie profilu...</p>
        ) : (
          <List columns={columnsUserInfo} data={[profile]} />
        )}
      </div>
      <Button onClick={logout}>Wyloguj</Button>{' '}
      <Button onClick={() => setIsModalOpen(true)}>Zmień hasło</Button>
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div>
        <h1>Twoje bilety</h1>
        {ticketsError && <ErrorMessage message={ticketsError} />}
        {ticketsLoading ? (
          <p>Ładowanie biletów...</p>
        ) : (
          <Table columns={columnsTickets} data={tickets} />
        )}
      </div>
      <div>
        <h1>Twoje transakcje</h1>
      </div>
    </ContentWrapper>
  );
};

export default Profile;
