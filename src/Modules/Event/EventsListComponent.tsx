"use client"
import React, { useEffect, useState } from 'react'
import EventModal from './AddEvent';
import axiosInstance from '@/Utils/axiosInstance';

interface Event {
    _id: string;
    name: string;
    description: string;
    dates: Date;
    location: string;
}
interface PropType {
    events: {
        data: Event[]
    }
}
const EventsListComponent = (eventsList: PropType) => {
    const [events, setEvents] = useState<Event[]>(eventsList.events.data);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Event>(
        {
            _id: '',
            name: '',
            description: '',
            dates: new Date(),
            location: '',
        }
    )
    const handleAddEvent = async () => {
        const newData = await axiosInstance.get(`/events`)
        console.log(newData)
        setEvents(newData.data.data)
    };
    const handleEdit = async (item: Event) => {
        setIsModalOpen(true)
        setSelectedData(item)
    };

    const handleDelete = async (id: string) => {
        try {
            await axiosInstance.delete(`/events?id=${id}`);
            setEvents(events.filter(event => event._id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };
    const handleModal = () => {
        setIsModalOpen(!isModalOpen)
        setSelectedData({
            _id: '',
            name: '',
            description: '',
            dates: new Date(),
            location: '',
        })
    }
    return (

        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Events</h1>
                <button
                    onClick={() => handleModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Add Event
                </button>
            </div>
            {events.length > 0 ? (
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Event List</h1>
                    <ul className="space-y-4">
                        {events.map(event => (
                            <li key={event._id} className="border p-4 rounded shadow">
                                <h2 className="text-xl font-semibold">{event.name}</h2>
                                <p>{event.description}</p>
                                <p>{event.location}</p>
                                <p>Date: {new Date(event.dates).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</p>
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-center text-gray-500">No events found.</p>
            )}
            {isModalOpen && <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEvent={handleAddEvent} selectedData={selectedData} />}
        </div>
    )
}

export default EventsListComponent