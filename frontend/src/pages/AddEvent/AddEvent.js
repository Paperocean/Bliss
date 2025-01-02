import React, { useState } from 'react';
import { createEventRequest } from 'services/eventService';
import useCategories from 'hooks/eventHooks/useCategories';
import useSeatPricing from 'hooks/useSeatPricing';

import SeatGrid from 'components/SeatMap/SeatPricing';
import InputText from 'components/props/InputField/InputField';
import Button from 'components/props/Button/Button';
import Select from 'components/props/Select/Select';
import Checkbox from 'components/props/Checkbox/Checkbox';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import Modal from 'components/props/Modal/Modal';

import '../../styles/Form.css';

const AddEvent = ({ isOpen, onClose }) => {
  const { categories, error: categoryError } = useCategories();

  const [formData, setFormData] = useState({
    organizer_id: '',
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    capacity: '',
    category_id: '',
    rows: '',
    seats_per_row: '',
    has_numbered_seats: false,
    ticket_price: '',
  });

  const {
    seatPrices,
    currentSeatPrice,
    errorMessage,
    setCurrentSeatPrice,
    handleSeatClick,
    bulkUpdateSeatPrices,
    resetSeatPricing,
    setErrorMessage,
  } = useSeatPricing();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEventForm = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.location ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.category_id
    ) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.has_numbered_seats) {
      if (!formData.rows || !formData.seats_per_row) {
        setErrorMessage(
          'Wybór liczby rzędów i miejsc w rzędzie jest wymagany.'
        );
        return;
      }

      const totalSeats = formData.rows * formData.seats_per_row;
      if (Object.keys(seatPrices).length !== totalSeats) {
        setErrorMessage(`All ${totalSeats} seat prices must be set.`);
        return;
      }
    } else {
      if (!formData.ticket_price) {
        setErrorMessage(
          'Ticket price is required for events without numbered seats.'
        );
        return;
      }

      if (!formData.capacity) {
        setErrorMessage(
          'Capacity is required for events without numbered seats.'
        );
        return;
      }
    }

    try {
      const normalizedSeatPrices = Object.fromEntries(
        Object.entries(seatPrices).map(([seatId, { price }]) => [seatId, price])
      );
      const eventPayload = {
        organizer_id: parseInt(formData.organizer_id, 10),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_time: formData.start_time,
        end_time: formData.end_time,
        capacity: formData.has_numbered_seats
          ? undefined
          : parseInt(formData.capacity, 10),
        category_id: parseInt(formData.category_id, 10),
        rows: formData.has_numbered_seats
          ? parseInt(formData.rows, 10)
          : undefined,
        seats_per_row: formData.has_numbered_seats
          ? parseInt(formData.seats_per_row, 10)
          : undefined,
        has_numbered_seats: formData.has_numbered_seats,
        ticket_price: formData.has_numbered_seats
          ? undefined
          : parseFloat(formData.ticket_price),
        seat_prices: formData.has_numbered_seats
          ? normalizedSeatPrices
          : undefined,
      };

      const response = await createEventRequest(eventPayload);

      if (response.success) {
        console.log('Event created:', response.event);

        setFormData({
          organizer_id: '',
          title: '',
          description: '',
          location: '',
          start_time: '',
          end_time: '',
          capacity: '',
          category_id: '',
          rows: '',
          seats_per_row: '',
          has_numbered_seats: false,
          ticket_price: '',
        });
        resetSeatPricing();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating event:', error.message);
      setErrorMessage(error.message || 'Failed to create event.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ContentWrapper>
        <form onSubmit={handleSubmitEventForm} className="form">
          <ErrorMessage message={errorMessage || categoryError} />

          <InputText
            label="Nazwa wydarzenia"
            name="title"
            id="title"
            placeholder="Wprowadź nazwę wydarzenia"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <InputText
            label="Opis wydarzenia"
            name="description"
            id="description"
            type="textarea"
            placeholder="Wprowadź opis wydarzenia"
            value={formData.description}
            onChange={handleChange}
            rows={5}
          />

          <InputText
            label="Lokalizacja"
            name="location"
            id="location"
            placeholder="Wprowadź lokalizację wydarzenia"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <InputText
            label="Data i godzina rozpoczęcia"
            name="start_time"
            id="start_time"
            type="datetime-local"
            placeholder="Wprowadź datę i godzinę rozpoczęcia"
            value={formData.start_time}
            onChange={handleChange}
            required
          />

          <InputText
            label="Data i godzina zakończenia"
            name="end_time"
            id="end_time"
            type="datetime-local"
            placeholder="Wprowadź datę i godzinę zakończenia"
            value={formData.end_time}
            onChange={handleChange}
            required
          />

          <Select
            name="category_id"
            id="category"
            value={formData.category_id}
            onChange={(e) => handleSelectChange(e.target.value, 'category_id')}
            placeholder="Wybierz kategorię"
            options={categories.map((cat) => ({
              value: cat.category_id,
              label: cat.name,
            }))}
            required
          />

          <Checkbox
            checked={formData.has_numbered_seats}
            onChange={(e) => {
              const { checked } = e.target;
              setFormData((prev) => ({
                ...prev,
                has_numbered_seats: checked,
              }));
            }}
            label="Numerowane miejsca"
          />

          {formData.has_numbered_seats ? (
            <>
              <InputText
                label="Liczba rzędów"
                name="rows"
                id="rows"
                type="number"
                placeholder="Wprowadź liczbę rzędów"
                value={formData.rows}
                onChange={handleChange}
                required
              />
              <InputText
                label="Liczba miejsc w rzędzie"
                name="seats_per_row"
                id="seats_per_row"
                type="number"
                placeholder="Wprowadź liczbę miejsc w rzędzie"
                value={formData.seats_per_row}
                onChange={handleChange}
                required
              />
              <Button type="button" onClick={() => setIsModalOpen(true)}>
                Ustaw ceny biletów
              </Button>
            </>
          ) : (
            <>
              <InputText
                label="Cena biletu (PLN)"
                name="ticket_price"
                id="ticket_price"
                type="number"
                placeholder="Wprowadź cenę biletu"
                value={formData.ticket_price}
                onChange={handleChange}
                required
              />
              <InputText
                label="Pojemność wydarzenia"
                name="capacity"
                id="capacity"
                type="number"
                placeholder="Wprowadź pojemność wydarzenia"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </>
          )}

          <Button type="submit">Stwórz wydarzenie</Button>
        </form>

        {/* Modal for Seat Pricing */}
        {formData.has_numbered_seats && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <SeatGrid
              rows={parseInt(formData.rows, 10)}
              seatsPerRow={parseInt(formData.seats_per_row, 10)}
              seatPrices={seatPrices}
              handleSeatClick={handleSeatClick}
              bulkUpdateSeatPrices={bulkUpdateSeatPrices}
              currentSeatPrice={currentSeatPrice}
              setCurrentSeatPrice={setCurrentSeatPrice}
              errorMessage={errorMessage}
            />
          </Modal>
        )}
      </ContentWrapper>
    </Modal>
  );
};

export default AddEvent;
