// app/components/EventModal.tsx
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addWeeks, formatISO } from 'date-fns';
import axiosInstance from '@/Utils/axiosInstance';
import { useRouter } from 'next/navigation';

interface Event {
  _id: string;
  name: string;
  description: string;
  dates: Date;
  location: string;
}
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: () => void;
  selectedData: Event
}

export default function EventModal({ isOpen, onClose, onAddEvent, selectedData }: EventModalProps) {
  const router = useRouter()
  const [name, setName] = useState(selectedData.name ?? '');
  const [description, setDescription] = useState(selectedData?.description ?? '');
  const [startDate, setStartDate] = useState<Date | null>(selectedData?.dates ?? null);
  const [location, setLocation] = useState(selectedData?.location ?? '');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceCount, setRecurrenceCount] = useState<number>(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate) {
      alert('Please select a start date.');
      return;
    }

    // Generate dates array for recurring events
    const dates = isRecurring
      ? Array.from({ length: recurrenceCount }, (_item, index) => formatISO(addWeeks(startDate, index)))
      : [formatISO(startDate)];

    try {
      if (selectedData?._id) {
        await axiosInstance.patch(`/events?id=${selectedData?._id}`, {
          name,
          description,
          dates,
          location
        });
      }
      else {
        await axiosInstance.post(`/events`, {
          name,
          description,
          dates,
          location,
        });
      }
      onAddEvent();
      onClose();
      router.replace('/events')
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const handleReset = () => {
    setName('')
    setDescription('')
    setIsRecurring(false)
    setLocation('')
    setRecurrenceCount(1)
  }
  return (
    isOpen ? (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="startDate">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="w-full border border-gray-300 p-2 rounded"
                dateFormat="MMMM d, yyyy"
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={() => setIsRecurring(!isRecurring)}
                className="mr-2"
              />
              <label htmlFor="isRecurring" className="text-gray-700">Recurring Event</label>
            </div>
            {isRecurring && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="recurrenceCount">Repeat Every Week</label>
                <input
                  type="number"
                  id="recurrenceCount"
                  value={recurrenceCount}
                  onChange={(e) => setRecurrenceCount(parseInt(e.target.value, 10))}
                  min="1"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { onClose(), handleReset() }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
}
