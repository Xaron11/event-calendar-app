'use client';

import Calendar from '@/components/Calendar';
import { EventInput } from '@fullcalendar/core';
import styles from './page.module.css';
import { UserButton, useUser } from '@clerk/nextjs';
import axios from 'axios';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => console.log(err));

export default function Home() {
  const user = useUser();

  const eventsQuery = useSWR('/api/events', fetcher);

  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: 'a3e62844-430e-49c9-90fa-a6d7a30a9167',
        safari_web_id: 'web.onesignal.auto.040fbea3-5bf4-4f81-a6ad-042d48246d00',
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []);

  if (!user.user) {
    return <div>Unathorized</div>;
  }

  if (eventsQuery.error) {
    console.log(eventsQuery.error);
    return <div>Error loading events</div>;
  }

  if (!eventsQuery.data) {
    return <div>Loading...</div>;
  }

  const handleEventAdd = async (event: EventInput) => {
    if (user.user) {
      await axios.post('/api/events', {
        ...event,
      });
    }
  };

  const handleEventDelete = async (eventId: string) => {
    if (user.user) {
      await axios.delete(`/api/events?id=${eventId}`);
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
