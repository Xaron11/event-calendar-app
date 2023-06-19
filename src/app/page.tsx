'use client';

import Calendar from '@/components/Calendar';
import { EventInput } from '@fullcalendar/core';
import styles from './page.module.css';
import { UserButton, useUser } from '@clerk/nextjs';
import { trpc } from '../utils/trpc';

export default function Home() {
  const user = useUser();

  const eventsQuery = trpc.getEvents.useQuery();
  const createEventMutation = trpc.createEvent.useMutation();
  const deleteEventMutation = trpc.deleteEvent.useMutation();

  if (!user.user) {
    return <div>Unathorized</div>;
  }

  if (eventsQuery.error) {
    console.log(eventsQuery.error);
    return <div>Error loading events</div>;
  }

  const handleEventAdd = async (event: EventInput) => {
    if (user.user) {
      createEventMutation.mutate({
        id: event.id!!,
        title: event.title!!,
        start: event.start?.toString()!!,
        end: event.end?.toString()!!,
        allDay: event.allDay!!,
      });
    }
  };

  const handleEventDelete = async (eventId: string) => {
    if (user.user) {
      deleteEventMutation.mutate({ id: eventId });
    }
  };

  return (
    <>
      <header>
        <div className='m-4 text-md flex gap-2 items-center justify-end'>
          {user.user?.primaryEmailAddress?.emailAddress}
          <UserButton afterSignOutUrl='/' />
        </div>
      </header>
      <main className='m-4 flex justify-center'>
        <div className='w-4/5'>
          <Calendar
            initialEvents={eventsQuery.data!!}
            onEventAdd={(event) => handleEventAdd(event)}
            onEventDelete={(eventId) => handleEventDelete(eventId)}
          />
        </div>
      </main>
    </>
  );
}
