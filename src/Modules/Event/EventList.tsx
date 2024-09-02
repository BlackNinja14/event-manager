import axiosInstance from '@/Utils/axiosInstance';
import React from 'react';
import EventsListComponent from './EventsListComponent';

export default async function EventList() {
    const response = await axiosInstance.get(`/events`);
    const events = response.data;
    console.log(events)
    return (
        <EventsListComponent
            events={events}
        />
    );
}
