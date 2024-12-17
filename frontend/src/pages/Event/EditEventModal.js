import React, { useState } from 'react';
import { editEvent } from 'services/eventService';
import useCategories from 'hooks/eventHooks/useCategories';

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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    category_id: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitEventForm = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Wyczyść poprzednie błędy
  
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
        setIsModalOpen(false);
      } else {
        throw new Error('Wystąpił problem podczas aktualizacji wydarzenia.');
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji wydarzenia:', error);
      setErrorMessage(error.message || 'Nie udało się zaktualizować wydarzenia.');
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
          label="Kategoria wydarzenia"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories.map((cat) => ({
            value: cat.name,
            label: cat.name,
          }))}
          required
        />

        <Button type="submit">Zapisz zmiany</Button>
        {/* Ticket Preview Section */}
      <h3 style={{ textAlign: 'center', marginTop: '1rem', width: '100%' }}>
        Podgląd biletu
      </h3>
      <EventBlock
        event={{
          title: formData.title || 'Nazwa wydarzenia',
          description: formData.description || 'Opis wydarzenia',
          location: formData.location || 'Nowa lokalizacja',
          start_time: formData.start_time || new Date().toISOString(),
          category: formData.category || 'General',
          image: formData.image,
        }}
      />
      </form>

      
    </ContentWrapper>
  </Modal>
);
};

export default EditEventModal;