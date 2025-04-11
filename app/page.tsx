/* eslint-disable prettier/prettier */
'use client';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventCard from '@components/Card/EventCard';
// import CardGroup from '@components/Card/CardGroup';

import FormSearch from './home/components/FormSearch';
import { db } from '../firebase';
import { getDocs, collection, orderBy, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import ButtonLink from '@components/Button/ButtonLink';
// import CircleButtons from './home/components/CircleButtons';

const Page: React.FC = () => {
  type EventType = {
    docId: string;
    date: string;
    time: string;
    title?: string;
    location?: string;
    speaker?: string;
    image?: string;
    id: string;
    createdAt: { seconds: number; nanoseconds: number };
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(eventQuery);

        const eventData = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        })) as EventType[];

        setEvents(eventData.slice(0, 10));

      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatTime = (timeString: string) => {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMostRecentCreatedAt = (events: EventType[]) => {
    return events.length
      ? new Date(
          Math.max(...events.map((event) => new Date(event.createdAt.seconds * 1000).getTime()))
        )
      : false;
  };

  const mostRecentCreatedAt = getMostRecentCreatedAt(events);

  return (
    <Master>
      <Section className='white-background'>
        <div className='container'>
          <div className='center'>
            <Heading type={1} color='gray' text='Discover' />
            <p className='gray'>Discover our events.</p>
          </div>
        </div>

        <div className='center'>
          <div className='container'>
            <div className='top-search'>
              <FormSearch />
            </div>
          </div>
          {/* <div className='circle-buttons'>
          <CircleButtons />
        </div> */}
        </div>
      </Section>

      <Section className='list-cards'>
        <div className='container center'>
          {loading ? (
            <p>Loading...</p>
          ) : events.length > 0 ? (
            events.map((event) => {
              const eventDate = new Date(event.date);
              const eventCreatedAt = new Date(event.createdAt.seconds * 1000);
              const isNew =
                mostRecentCreatedAt && eventCreatedAt.getTime() === mostRecentCreatedAt.getTime();

              return (
                <EventCard
                  key={event.docId}
                  url={event.id}
                  speaker={event.speaker || ''}
                  color='blue'
                  when={
                    event.date
                      ? eventDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'TBA'
                  }
                  name={event.title || 'Event name'}
                  venue={event.location || 'Venue name'}
                  time={formatTime(event.time) || ''}
                  image={'/MLS.avif'}
                  isNew={isNew}
                />
              );
            })
          ) : (
            <p>No events available</p>
          )}
        </div>
      </Section>

      <div className='center'>
        {events.length > 10 && (<ButtonLink
            color='blue-filled'
            text='See all'
            rightIcon='arrow_forward'
            url='list'
          />)}
      </div>

      <br />
      {/* <CardGroup url='list' title='Editors choice' color='orange' background='gray'>
      <EventCard
        url='1'
        from='20'
        color='orange'
        when='Tue, Sep 21, 2024 19:00'
        name='Event name goes here'
        venue='Royal Albert Hall'
        image='https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='25'
        color='orange'
        when='Wed, Aug 9, 2024 22:00'
        name='Event name goes here'
        venue='o2 Arena'
        image='https://images.unsplash.com/photo-1472691681358-fdf00a4bfcfe?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='10'
        color='orange'
        when='Sun, Mar 14, 2024 15:00'
        name='Event name goes here'
        venue='Wembley Stadium'
        image='https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='60'
        color='orange'
        when='Mon, Jul 2, 2024 20:00'
        name='Event name goes here'
        venue='Eventim Apollo'
        image='https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='20'
        color='orange'
        when='Tue, Sep 21, 2024 19:00'
        name='Event name goes here'
        venue='Royal Albert Hall'
        image='https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='25'
        color='orange'
        when='Wed, Aug 9, 2024 22:00'
        name='Event name goes here'
        venue='o2 Arena'
        image='https://images.unsplash.com/photo-1472691681358-fdf00a4bfcfe?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
    </CardGroup>

    <CardGroup url='list' title='For kids' color='purple' background='white'>
      <EventCard
        url='1'
        from='20'
        color='purple'
        when='Tue, Sep 21, 2024 19:00'
        name='Event name goes here'
        venue='Royal Albert Hall'
        image='https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='25'
        color='purple'
        when='Wed, Aug 9, 2024 22:00'
        name='Event name goes here'
        venue='o2 Arena'
        image='https://images.unsplash.com/photo-1472691681358-fdf00a4bfcfe?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='10'
        color='purple'
        when='Sun, Mar 14, 2024 15:00'
        name='Event name goes here'
        venue='Wembley Stadium'
        image='https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='60'
        color='purple'
        when='Mon, Jul 2, 2024 20:00'
        name='Event name goes here'
        venue='Eventim Apollo'
        image='https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='20'
        color='purple'
        when='Tue, Sep 21, 2024 19:00'
        name='Event name goes here'
        venue='Royal Albert Hall'
        image='https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
      <EventCard
        url='1'
        from='25'
        color='purple'
        when='Wed, Aug 9, 2024 22:00'
        name='Event name goes here'
        venue='o2 Arena'
        image='https://images.unsplash.com/photo-1472691681358-fdf00a4bfcfe?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
    </CardGroup> */}
    </Master>
  );
};

export default Page;
