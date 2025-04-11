'use client';

import CardGroup from '@components/Card/CardGroup';
import EventCard from '@components/Card/EventCard';
import Heading from '@components/Heading/Heading';
import Section from '@components/Section/Section';
import TicketForm from './TicketForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc, DocumentData, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../../firebase';

const EventDetail: React.FC = () => {
  const { url } = useParams() ?? {};
  const [eventDetails, setDetailsEvent] = useState<DocumentData | null>(null);
  const [events, setEvents] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const eventRef = doc(db, 'events', url.toString());
        const eventSnap = await getDoc(eventRef);

        const eventQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(eventQuery);

        const eventData = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        if (eventSnap.exists()) {
          setDetailsEvent(eventSnap.data());
        } else {
          throw new Error('Event not found!!');
        }

        setEvents(eventData);
      } catch (error) {
        throw new Error('Error fetching data:' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

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

  return (
    <>
      {loading ? (
        <p className='container center'>Loading event details...</p>
      ) : (
        <>
          <div className='blur-cover'>
            <div
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
              }}
              className='event-cover cover-image flex flex-v-center flex-h-center'
            />
            <div className='cover-info'>
              <div
                style={{
                  backgroundImage: `url("/MLS.avif")`,
                }}
                className='cover-image image'
              />
              <Heading type={1} color='white' text={eventDetails?.title || 'Event name'} />
              <Heading
                type={5}
                color='white'
                text={
                  eventDetails?.date
                    ? new Date(eventDetails.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'TBA'
                }
              />
              <Heading type={6} color='white' text={eventDetails?.location || 'Event location'} />
            </div>
          </div>
          <Section className='white-background'>
            <div className='container'>
              <div className='event-details'>
                <div>
                  <Heading type={4} color='gray' text='Event details' />
                  <div className='paragraph-container gray'>
                    <p>{eventDetails?.description || ''}</p>
                  </div>
                </div>
                <div>
                  <div className='ticket-box'>
                    <div className='ticket-box-header'>
                      <Heading type={4} color='gray' text='Ticket' />
                    </div>
                    <TicketForm />
                  </div>
                </div>
              </div>
            </div>
          </Section>
          <CardGroup url='list' title='Other events' color='orange' background='gray'>
            {events.length > 0 ? (
              events
                .filter((event) => event.docId !== url)
                .map((event) => {
                  const eventDate = new Date(event.date);
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
                      time={formatTime(event.time) || 'Event time'}
                      image={
                        event.image ||
                        'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                      }
                    />
                  );
                })
            ) : (
              <p>No other events</p>
            )}
          </CardGroup>
        </>
      )}
    </>
  );
};

export default EventDetail;
