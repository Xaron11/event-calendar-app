'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  EventInput,
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import { dateWithoutTime } from '../utils/date';
import { useState, useRef } from 'react';
import Dialog from './Dialog';
import DialogRef from './types/DialogRef';
import { v4 as uuidv4 } from 'uuid';

export default function Calendar(props: {
  initialEvents: EventInput[];
  onEventAdd: (event: EventInput) => void;
  onEventDelete: (eventId: string) => void;
}) {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>();
  const [lastSelection, setLastSelection] = useState<DateSelectArg>();
  const [lastEventClick, setLastEventClick] = useState<EventClickArg>();
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const createDialogRef = useRef<DialogRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setLastSelection(selectInfo);
    createDialogRef.current?.openDialog();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setLastEventClick(clickInfo);
    deleteDialogRef.current?.openDialog();
  };

  const handleEvents = (events: EventApi[]) => {
    if (events) {
      setCurrentEvents(events);
    }
  };

  const handleCreateDialogClose = (accept: boolean) => {
    if (accept && lastSelection) {
      let calendarApi = lastSelection.view.calendar;

      calendarApi.unselect();

      if (newEventTitle) {
        const newEvent = {
          id: uuidv4(),
          title: newEventTitle,
          start: lastSelection.startStr,
          end: lastSelection.endStr,
          allDay: lastSelection.allDay,
        };
        calendarApi.addEvent(newEvent);

        setNewEventTitle('');
        props.onEventAdd(newEvent);
      }
    }
  };

  const handleDeleteDialogClose = (accept: boolean) => {
    if (accept && lastEventClick) {
      lastEventClick.event.remove();
      props.onEventDelete(lastEventClick.event.id);
    }
  };

  function renderEventContent(eventInfo: EventContentArg) {
    return (
      <>
        <div className='p-1'>
          <b className='text-sm'>{eventInfo.timeText}</b>{' '}
          <i className='text-lg'>{eventInfo.event.title}</i>
        </div>
      </>
    );
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          hour12: false,
        }}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          hour12: false,
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        initialEvents={props.initialEvents}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventsSet={handleEvents}
        aspectRatio={2}
      />
      <Dialog
        ref={createDialogRef}
        title='Add Event'
        desc='Please enter a new title for your event'
        onClose={handleCreateDialogClose}
      >
        <label className='w-24 text-right text-lg font-bold text-blue-950' htmlFor='title'>
          Title
        </label>
        <input
          className='w-full rounded-md p-2 border-blue-950 shadow-blue-950 border-2'
          id='title'
          defaultValue='New Event'
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
        />
      </Dialog>
      <Dialog
        ref={deleteDialogRef}
        title='Delete Event'
        desc={`Are you sure you want to delete the event '${lastEventClick?.event.title}'`}
        onClose={handleDeleteDialogClose}
      ></Dialog>
    </>
  );
}
