import jsPDF from 'jspdf';
import logo from 'assets/logo.png';

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

function removePolishChars(text = '') {
  const map = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'A',
    Ć: 'C',
    Ę: 'E',
    Ł: 'L',
    Ń: 'N',
    Ó: 'O',
    Ś: 'S',
    Ź: 'Z',
    Ż: 'Z',
  };

  return text
    .split('')
    .map((char) => (map[char] !== undefined ? map[char] : char))
    .join('');
}

export const generatePdfTicket = async (ticket) => {
  const doc = new jsPDF();

  doc.addImage(logo, 'PNG', 10, 10, 33, 10);

  doc.setFontSize(12);
  doc.text(removePolishChars(`Wydarzenie: ${ticket.event_name}`), 10, 30);
  doc.text(
    removePolishChars(`Lokalizacja: ${ticket.location || 'N/A'}`),
    10,
    35
  );
  doc.text(
    removePolishChars(
      `Data rozpoczęcia: ${
        ticket.start_time ? formatDate(ticket.start_time) : 'N/A'
      }`
    ),
    10,
    40
  );
  doc.text(removePolishChars(`Miejsce: ${ticket.seat_label || 'N/A'}`), 10, 45);
  doc.text(removePolishChars(`Cena: ${ticket.price} zł`), 10, 50);
  doc.text(
    removePolishChars(
      `Data zakupu: ${
        ticket.purchase_time ? formatDate(ticket.purchase_time) : 'N/A'
      }`
    ),
    10,
    55
  );
  doc.line(10, 70, 200, 70);

  if (ticket.qr_code) {
    doc.addImage(ticket.qr_code, 'JPEG', 140, 15, 50, 50);
  }

  doc.save(`bilet_${ticket.ticket_id}.pdf`);
};
