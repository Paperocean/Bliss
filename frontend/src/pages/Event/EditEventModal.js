import React, { useState, useEffect } from 'react';
import { editEvent } from 'services/eventService';
import useCategories from 'hooks/eventHooks/useCategories';
import useEvents from 'hooks/eventHooks/useEvents';

import InputText from 'components/props/InputField/InputField';
import Button from 'components/props/Button/Button';
import Select from 'components/props/Select/Select';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import Modal from 'components/props/Modal/Modal';
import EventBlock from 'components/EventBlock/EventBlock';

import '../../styles/Form.css';

const EditEventModal = ({ isOpen, onClose, eventId }) => {
  const { categories, error: categoryError } = useCategories();
  const { events } = useEvents();
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    category_id: '',
  });

  const currentEvent = events.find((event) => event.event_id === eventId);

  useEffect(() => {
    console.log('EditEventModal Props:', { isOpen, onClose, eventId });
    if (isOpen && currentEvent) {
      console.log('Current Event:', currentEvent);
      setFormData({
        title: currentEvent.title || '',
        description: currentEvent.description || '',
        location: currentEvent.location || '',
        start_time: currentEvent.start_time
          ? currentEvent.start_time.slice(0, 16)
          : '',
        end_time: currentEvent.end_time
          ? currentEvent.end_time.slice(0, 16)
          : '',
        category_id: currentEvent.category_id
          ? parseInt(currentEvent.category_id, 10)
          : '',
      });
    }
  }, [isOpen, currentEvent, eventId, onClose]);

  const handleChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEventForm = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Wyczyść poprzednie błędy

    console.log('Form Data przed przesłaniem:', formData);

    try {
      // Budowanie payloadu na podstawie formData
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_time: formData.start_time,
        end_time: formData.end_time,
        category_id: parseInt(formData.category_id, 10), // Konwersja na liczby
      };

      // Wysłanie żądania do API
      const response = await editEvent(eventId, eventPayload);

      if (response.success) {
        console.log('Wydarzenie zostało zaktualizowane:', response.event);

        // Reset formularza
        setFormData({
          title: '',
          description: '',
          location: '',
          start_time: '',
          end_time: '',
          category_id: '',
        });

        // Zamknięcie modala
        onClose();
      } else {
        throw new Error('Wystąpił problem podczas aktualizacji wydarzenia.');
      }
    } catch (error) {
      console.log(currentEvent.category_id);
      console.error('Błąd podczas aktualizacji wydarzenia:', error);
      setErrorMessage(
        error.message || 'Nie udało się zaktualizować wydarzenia.'
      );
    }
  };

  return (
    <ContentWrapper>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmitEventForm} className="form">
          <ErrorMessage message={errorMessage || categoryError} />

          <InputText
            label="Nazwa wydarzenia"
            name="title"
            placeholder="Wprowadź nazwę wydarzenia"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <InputText
            label="Opis wydarzenia"
            name="description"
            type="textarea"
            placeholder="Wprowadź opis wydarzenia"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />

          <InputText
            label="Lokalizacja"
            name="location"
            placeholder="Wprowadź lokalizację wydarzenia"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <InputText
            label="Data i godzina rozpoczęcia"
            name="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={handleChange}
            required
          />

          <InputText
            label="Data i godzina końca"
            name="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={handleChange}
            required
          />

          <Select
            name="category_id"
            id="category"
            value={formData.category_id}
            onChange={(e) => handleChange(e.target.value, 'category_id')}
            placeholder="Wybierz kategorię"
            options={categories.map((cat) => ({
              value: cat.category_id,
              label: cat.name,
            }))}
            required
          />

          <Button type="submit">Zapisz zmiany</Button>
        </form>
      </Modal>
    </ContentWrapper>
  );
};

export default EditEventModal;
