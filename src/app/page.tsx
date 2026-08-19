'use client';

import Calendar from '@/components/Calendar';
import { EventInput } from '@fullcalendar/core';
import { UserButton, useUser } from '@clerk/nextjs';
import axios from 'axios';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const eventsQuery = useSWR(
    mounted && isLoaded && isSignedIn ? '/api/events' : null,
    fetcher
  );

  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && user?.id) {
      import('react-onesignal')
        .then((module) => {
          const OneSignal = module.default;
          OneSignal.init({
            appId: 'a3e62844-430e-49c9-90fa-a6d7a30a9167',
            safari_web_id: 'web.onesignal.auto.040fbea3-5bf4-4f81-a6ad-042d48246d00',
            notifyButton: {
              enable: true,
            } as any,
            allowLocalhostAsSecureOrigin: true,
          })
            .then(() => {
              const os = OneSignal as any;
              if (typeof os.login === 'function') {
                os.login(user.id);
              } else if (typeof os.setExternalUserId === 'function') {
                os.setExternalUserId(user.id);
              }
            })
            .catch((err) => {
              console.warn('OneSignal init error:', err);
            });
        })
        .catch((err) => {
          console.warn('Failed to load react-onesignal:', err);
        });
    }
  }, [mounted, user?.id]);

  if (!mounted || !isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen font-sans text-gray-600'>
        Loading session...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className='flex items-center justify-center min-h-screen font-sans text-gray-600'>
        Unauthorized
      </div>
    );
  }

  if (eventsQuery.error) {
    console.error('Events query error:', eventsQuery.error);
    const errorMsg =
      eventsQuery.error?.response?.data?.error || 'Error loading events from database';
    return (
      <div className='flex flex-col items-center justify-center min-h-screen text-red-600 gap-2'>
        <p className='text-lg font-semibold'>Error Loading Events</p>
        <p className='text-sm text-gray-500'>{errorMsg}</p>
      </div>
    );
  }

  if (!eventsQuery.data) {
    return (
      <div className='flex items-center justify-center min-h-screen font-sans text-gray-600'>
        Loading calendar events...
      </div>
    );
  }

  const handleEventAdd = async (event: EventInput) => {
    if (user) {
      await axios.post('/api/events', {
        ...event,
      });
      eventsQuery.mutate();
    }
  };

  const handleEventDelete = async (eventId: string) => {
    if (user) {
      await axios.delete(`/api/events?id=${eventId}`);
      eventsQuery.mutate();
    }
  };

  return (
    <>
      <header>
        <div className='m-4 text-md flex gap-2 items-center justify-end'>
          {user?.primaryEmailAddress?.emailAddress}
          <UserButton />
        </div>
      </header>
      <main className='m-4 flex justify-center'>
        <div className='w-4/5'>
          <Calendar
            initialEvents={eventsQuery.data}
            onEventAdd={(event) => handleEventAdd(event)}
            onEventDelete={(eventId) => handleEventDelete(eventId)}
          />
        </div>
      </main>
    </>
  );
}
