'use client';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventCard from '@components/Card/EventCard';
import { useEffect, useState } from 'react';
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { orderBy } from 'firebase/firestore/lite';

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

        setEvents(eventData);
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
          <div className='padding-bottom center'>
            <Heading type={1} color='gray' text='Events' />
            <p className='gray'>Discover, search and filter best events in Abuja.</p>
          </div>
        </div>
      </Section>

      <Section className='list-cards'>
        <div className='container center'>
          {loading ? (
            <p>Loading events...</p>
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
                  image={
                    event.image ||
                    'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  isNew={isNew} // Pass the isNew prop
                />
              );
            })
          ) : (
            <p>No events available</p>
          )}
        </div>
      </Section>
    </Master>
  );
};

export default Page;
