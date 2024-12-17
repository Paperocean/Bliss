import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from 'context/AuthContext';
import useUserProfile from 'hooks/userHooks/useUserProfile';
import useUserTickets from 'hooks/userHooks/useUserTickets';
import useOrganizerEvents from 'hooks/eventHooks/useOrganizerEvents';

import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import List from 'components/props/List/List';
import Table from 'components/props/Table/Table';
import Button from 'components/props/Button/Button';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ChangePasswordModal from './ChangePasswordModal';
import AddEvent from 'pages/AddEvent/AddEvent';
import EventList from 'components/EventList/EventList';

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
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { events, loading: eventsLoading, error: eventsError } = useOrganizerEvents();
  
  const filteredEvents = profile?.role === 'organizer'
    ? events.filter((event) => event.organizer_id === profile.user_id)
    : events;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
    if (profileError?.message?.includes('token')) {
      logout();
    }
  }, [isLoggedIn, navigate, profileError, logout]);
  
  const columnsUserInfo = [
    {
      header: 'E-mail',
      accessor: (row) => row?.email || 'N/A',
    },
    {
      header: 'Nazwa użytkownika',
      accessor: (row) => row?.username || 'N/A',
    },
    {
      header: 'Rola',
      accessor: (row) => row?.role === 'organizer' ? 'Organizator' : 'Kupujący',
    },
  ];

  const columnsTickets = [
    {
      header: 'Wydarzenie',
      accessor: (row) => row?.event_name || 'N/A',
    },
    {
      header: 'Miejsce',
      accessor: (row) => row?.seat_label || 'N/A',
    },
    {
      header: 'Cena',
      accessor: (row) => `${row?.price} zł`,
    },
    {
      header: 'Data zakupu',
      accessor: (row) => row?.purchase_time ? new Date(row.purchase_time).toLocaleString() : 'N/A',
    },
    {
      render: () => <Button>Pobierz</Button>,
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
      <Button onClick={() => setIsModalOpen(true)}>Zmień hasło</Button>{' '}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {profile?.role === 'organizer' &&(
        <div>
          <h1>Twoje wydarzenia</h1>
          <Button onClick={() => setIsAddEventOpen(true)}>Dodaj wydarzenie</Button>
          <AddEvent 
            isOpen={isAddEventOpen} 
            onClose={() => setIsAddEventOpen(false)} 
          />
          

          {/* Event List */}
          {eventsError ? (
            <ErrorMessage message={eventsError} />
          ) : eventsLoading ? (
            <p>Ładowanie wydarzeń...</p>
          ) : (
            <EventList events={filteredEvents} role={profile?.role} />
          )}
        </div>
      )}
      <div>
        <h1>Twoje bilety</h1>
        {ticketsError && <ErrorMessage message={ticketsError} />}
        {ticketsLoading ? (
          <p>Ładowanie biletów...</p>
        ) : (
          <Table columns={columnsTickets} data={tickets || []} />
        )}
      </div>
      <div>
        <h1>Twoje transakcje</h1>
      </div>
    </ContentWrapper>
  );
};

export default Profile;
