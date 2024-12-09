import React, { useState } from 'react';
import { createEvent } from '../services/eventService';
import useCategories from '../hooks/useCategories';
import useSeatPricing from '../hooks/useSeatPricing';

import SeatGrid from '../components/SeatPricing/SeatPricing';
import InputText from '../components/props/InputField/InputField';
import Button from '../components/props/Button/Button';
import Select from '../components/props/Select/Select';
import Checkbox from '../components/props/Checkbox/Checkbox';
import ErrorMessage from '../components/ErrorMessage';
import ContentWrapper from '../components/ContentWrapper/ContentWrapper';
import Modal from '../components/Modal/Modal'; 

import '../styles/Form.css';

const AddEvent = () => {
  const { categories, error: categoryError } = useCategories();

  const [formData, setFormData] = useState({
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

    if (!formData.category_id) {
      setErrorMessage('Please select a valid category.');
      return;
    }

    try {
      const response = await createEvent({
        ...formData,
        seat_prices: seatPrices,
      });
      if (response.success) {
        console.log('Event created: ', response.event);
        setFormData({
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
        });
        resetSeatPricing();
        setIsModalOpen(false); 
      }
    } catch (error) {
      console.error('Error creating event:', error.message);
      setErrorMessage(error.message || 'Failed to create event');
    }
  };

  return (
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
            />
            <InputText
              label="Data i godzina rozpoczęcia"
              name="start_time"
              id="start_time"
              type="datetime-local"
              placeholder="Wprowadź wartość"
              value={formData.start_time}
              onChange={handleChange}
            />
            <InputText
              label="Data i godzina zakończenia"
              name="end_time"
              id="end_time"
              type="datetime-local"
              placeholder="Wprowadź wartość"
              value={formData.end_time}
              onChange={handleChange}
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
                />
                <InputText
                  label="Liczba miejsc w rzędzie"
                  name="seats_per_row"
                  id="seats_per_row"
                  type="number"
                  placeholder="Wprowadź liczbę miejsc w rzędzie"
                  value={formData.seats_per_row}
                  onChange={handleChange}
                />
                <Button type="button" onClick={() => setIsModalOpen(true)}>
                  Ustaw ceny biletów
                </Button>
              </>
            ) : (
              <InputText
                label="Pojemność wydarzenia"
                name="end_time"
                id="end_time"
                type="number"
                placeholder="Wprowadź wartość"
                value={formData.end_time}
                onChange={handleChange}
              />
            )}
            <Button type="submit">Stwórz wydarzenie</Button>
          </form>

      {/* Modal for Seat Pricing */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SeatGrid
          rows={formData.rows}
          seatsPerRow={formData.seats_per_row}
          seatPrices={seatPrices}
          handleSeatClick={handleSeatClick}
          bulkUpdateSeatPrices={bulkUpdateSeatPrices} 
          currentSeatPrice={currentSeatPrice}
          setCurrentSeatPrice={setCurrentSeatPrice}
          errorMessage={errorMessage}
        />
      </Modal>
    </ContentWrapper>
  );
};

export default AddEvent;
