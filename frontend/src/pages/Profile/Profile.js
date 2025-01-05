import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from 'context/AuthContext';
import useUserProfile from 'hooks/userHooks/useUserProfile';
import useUserTickets from 'hooks/userHooks/useUserTickets';
import useUserTransactions from 'hooks/userHooks/useUserTransactions';
import useOrganizerEvents from 'hooks/eventHooks/useOrganizerEvents';
import { generatePdfTicket } from 'utils/generatePdfTicket';
import { refundTicketRequest } from 'services/ticketService';
import { fetchEventStatus } from 'services/eventService';

import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import List from 'components/props/List/List';
import Table from 'components/props/Table/Table';
import Button from 'components/props/Button/Button';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ChangePasswordModal from './ChangePasswordModal';
import AddEvent from 'pages/AddEvent/AddEvent';
import EventList from 'components/EventList/EventList';

const formatDate = (isoString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(isoString).toLocaleDateString('pl-PL', options);
};

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
    refetchTickets, 
  } = useUserTickets();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    refetchTransactions,
  } = useUserTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    refetch,
  } = useOrganizerEvents();

  const filteredEvents =
    profile?.role === 'organizer'
      ? events.filter((event) => event.organizer_id === profile.user_id)
      : events;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
    if (profileError?.message?.includes('token')) {
      logout();
      return;
    }
    if (
      profileError?.message?.includes('not found') ||
      profileError?.message?.includes('nie znaleziono') ||
      profileError?.message?.includes('nie udało')
    ) {
      logout();
      return;
    }
    if (!profileLoading && (!profile || Object.keys(profile).length === 0)) {
      logout();
      return;
    }
  }, [isLoggedIn, navigate, profileError, logout, profile, profileLoading]);

  const handleRefund = async (ticketId) => {
    if (!window.confirm('Czy na pewno chcesz zwrócić ten bilet?')) return;
    
    try {
      const response = await refundTicketRequest(ticketId);
      if (response.success) {
        alert('Bilet został zwrócony.');
        refetchTickets();
        refetchTransactions();
      } else {
        alert(response.message || 'Nie udało się zwrócić biletu.');
      }
    } catch (error) {
      console.error('Błąd zwrotu biletu:', error);
      alert('Wystąpił błąd podczas zwrotu biletu.');
    }
  };

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
      accessor: (row) =>
        row?.role === 'organizer' ? 'Organizator' : 'Kupujący',
    },
  ];

  const columnsTickets = [
    {
      header: 'Wydarzenie',
      accessor: (row) => row?.event_name || 'N/A',
    },
    {
      header: 'Lokalizacja',
      accessor: (row) => row?.location || 'N/A',
    },
    {
      header: 'Data rozpoczęcia',
      accessor: (row) => formatDate(row?.start_time) || 'N/A',
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
      accessor: (row) =>
        row?.purchase_time
          ? new Date(row.purchase_time).toLocaleString()
          : 'N/A',
    },
    {
      render: (row) => (
        <>
          <Button onClick={() => generatePdfTicket(row)}>Pobierz</Button>
          {' '}
          <CheckRefundButton row={row} handleRefund={handleRefund} />
        </>
      ),
    },
  ];

  const CheckRefundButton = ({ row, handleRefund }) => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkStatus = async () => {
        setLoading(true);
        const cancelled = await fetchEventStatus(row.event_id);
        setIsCancelled(cancelled);
        setLoading(false);
      };

      checkStatus();
    }, [row.event_id]);

    return loading ? (
      <span>Sprawdzanie...</span>
    ) : isCancelled ? (
      <Button onClick={() => handleRefund(row.ticket_id)} variant="danger">
        Zwrot
      </Button>
    ) : null;
  };

  const columnsTransactions = [
    {
      header: 'Identyfikator transakcji',
      accessor: (row) => row?.transaction_id || 'N/A',
    },
    {
      header: 'Czas zrealizowania',
      accessor: (row) =>
        row?.transaction_time
          ? new Date(row.transaction_time).toLocaleString()
          : 'N/A',
    },
    {
      header: 'Status transakcji',
      accessor: (row) =>
        row?.payment_status === 'completed'
          ? 'Zakończona'
          : row?.payment_status === 'pending'
          ? 'W trakcie'
          : row?.payment_status === 'failed'
          ? 'Nieudana'
          : row?.payment_status === 'refunded'
          ? 'Zwrot'
          : 'N/A',
    },
    {
      header: 'Łączna suma transakcji',
      accessor: (row) => `${row?.amount} zł`,
    },
  ];

  useEffect(() => {
    document.title = 'Profil';
  }, []);


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
      {profile?.role === 'organizer' && (
        <div>
          <h1>Twoje wydarzenia</h1>
          <Button onClick={() => setIsAddEventOpen(true)}>
            Dodaj wydarzenie
          </Button>
          <AddEvent
            isOpen={isAddEventOpen}
            onClose={() => {
              setIsAddEventOpen(false);
              refetch();
            }}
          />
          {/* Event List */}
          {eventsError ? (
            <ErrorMessage message={eventsError} />
          ) : eventsLoading ? (
            <p>Ładowanie wydarzeń...</p>
          ) : (
            <EventList
              events={filteredEvents}
              role={profile?.role}
              refetch={refetch}
            />
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
        {transactionsError && <ErrorMessage message={transactionsError} />}
        {transactionsLoading ? (
          <p>Ładowanie transakcji...</p>
        ) : (
          <Table columns={columnsTransactions} data={transactions || []} />
        )}
      </div>
    </ContentWrapper>
  );
};

export default Profile;