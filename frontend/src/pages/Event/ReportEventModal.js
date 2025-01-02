import React, { useEffect, useState } from 'react';
import Modal from '../../components/props/Modal/Modal';
import { getEventReport } from '../../services/eventService';

const ReportEventModal = ({ isOpen, onClose, eventId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && eventId) {
      setLoading(true);
      setError('');
      setReport(null);

      getEventReport(eventId)
        .then((response) => {
          if (response.success) {
            setReport(response.report);
          } else {
            setError('Nie udało się załadować raportu wydarzenia.');
          }
        })
        .catch((err) => {
          console.error('Error fetching report:', err.message);
          setError('Nie udało się załadować raportu wydarzenia.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, eventId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Raport sprzedaży biletów</h2>
      {loading && <p>Ładowanie raportu...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {report && (
        <div>
          <h3>{report.title}</h3>
          <p>
            <strong>Data:</strong>{' '}
            {new Date(report.start_time).toLocaleString()}
          </p>
          <p>
            <strong>Lokalizacja:</strong> {report.location}
          </p>
          <p>
            <strong>Liczba sprzedanych biletów:</strong> {report.tickets_sold}
          </p>
          <p>
            <strong>Łączny zysk ze sprzedaży biletów:</strong>{' '}
            {report.total_revenue} zł
          </p>

          {report.sold_tickets_details &&
            report.sold_tickets_details.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Sprzedane bilety:</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: '1px solid #ddd',
                          textAlign: 'left',
                          padding: '8px',
                        }}
                      >
                        Seat Label
                      </th>
                      <th
                        style={{
                          borderBottom: '1px solid #ddd',
                          textAlign: 'left',
                          padding: '8px',
                        }}
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.sold_tickets_details.map((ticket, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            borderBottom: '1px solid #ddd',
                            padding: '8px',
                          }}
                        >
                          {ticket.seat_label}
                        </td>
                        <td
                          style={{
                            borderBottom: '1px solid #ddd',
                            padding: '8px',
                          }}
                        >
                          {ticket.price} zł
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      )}
    </Modal>
  );
};

export default ReportEventModal;
