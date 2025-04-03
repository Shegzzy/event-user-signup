'use client';

import CardGroup from '@components/Card/CardGroup';
import EventCard from '@components/Card/EventCard';
import Heading from '@components/Heading/Heading';
import Section from '@components/Section/Section';
import TicketForm from './TicketForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

const EventDetail: React.FC = () => {
  const { url } = useParams() ?? {};
  const [event, setEvent] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const eventRef = doc(db, 'events', url.toString());
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          setEvent(eventSnap.data());
        } else {
          console.error('Event not found!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <>
      {loading ? (
        <p>Loading event details...</p>
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
                  backgroundImage: `url("https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
                }}
                className='cover-image image'
              />
              <Heading type={1} color='white' text={event?.title || 'Event name'} />
              <Heading type={5} color='white' text='Tue, Sep 21, 2024 19:00' />
              <Heading type={6} color='white' text={event?.location || 'Event location'} />
            </div>
          </div>
          <Section className='white-background'>
            <div className='container'>
              <div className='event-details'>
                <div>
                  <Heading type={4} color='gray' text='Event details' />
                  <div className='paragraph-container gray'>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                      in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                      veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                      ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                      consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque
                      porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                    </p>
                  </div>
                </div>
                <div>
                  <div className='ticket-box'>
                    <div className='ticket-box-header'>
                      <Heading type={4} color='gray' text='Tickets' />
                    </div>
                    <TicketForm
                      data={[
                        {
                          id: 1,
                          name: 'Family',
                          price: '£10',
                          ordering: 1,
                          soldout: true,
                        },
                        {
                          id: 2,
                          name: 'Adult',
                          price: '£20',
                          ordering: 2,
                        },
                        {
                          id: 3,
                          name: 'Child',
                          price: '£30',
                          ordering: 3,
                          information: 'Information about child tickets',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>
          <CardGroup url='list' title='Other events' color='orange' background='gray'>
            <EventCard
              url='1'
              speaker='20'
              color='orange'
              when='Tue, Sep 21, 2024 19:00'
              name='Event name goes here'
              venue='Royal Albert Hall'
              image='https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />
          </CardGroup>
        </>
      )}
    </>
  );
};

export default EventDetail;
