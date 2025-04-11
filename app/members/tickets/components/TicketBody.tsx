'use client';

import Section from '@components/Section/Section';
import { DocumentData, query, collection, getDocs, where } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { db } from '../../../../firebase';
import { useAuth } from '@providers/authProvider';
import Loader from '@components/Loader/Loader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TicketBody: React.FC = () => {
  const [tickets, setTickets] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loadingAuth } = useAuth();

  // Store multiple refs using ticket IDs
  const ticketRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const ticketQuery = query(collection(db, 'attendees'), where('userId', '==', user?.uid));
        const querySnapshot = await getDocs(ticketQuery);
        const ticketData = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setTickets(ticketData);
      } catch (error) {
        throw new Error('Error fetching tickets:' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

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

  const handleDownload = async (docId: string) => {
    const ref = ticketRefs.current[docId];
    if (!ref) return;

    const canvas = await html2canvas(ref, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ticket-${docId}.pdf`);
  };

  if (loading || loadingAuth) {
    return <Loader type='inline' color='gray' text='Hang on a second' />;
  }

  return (
    <Section className='white-background'>
      <div className='container'>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket, index) => (
            <div
              className='ticket-item'
              key={ticket.docId || index}
              ref={(el) => {
                ticketRefs.current[ticket.docId] = el;
              }}
            >
              <div className='item-right'>
                <h2>{new Date(ticket.eventDate).getDate()}</h2>
                <p>{new Date(ticket.eventDate).toLocaleString('en-US', { month: 'long' })}</p>
                <img src={ticket.qrImage} alt='qrcode' />
                <span className='up-border'></span>
                <span className='down-border'></span>
              </div>

              <div className='item-left'>
                <img className='qr-mobile' src={ticket.qrImage} alt='qrcode' />

                <h5>{ticket.eventName}</h5>
                <p>
                  <span className='material-symbols-outlined'>event</span>
                  {new Date(ticket.eventDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  {formatTime(ticket.eventTime)}
                </p>
                <p>
                  <span className='material-symbols-outlined'>apartment</span>
                  {ticket.location}
                </p>
                <p>
                  <span className='material-symbols-outlined'>person</span>
                  {ticket.eventSpeaker}
                </p>

                <div className='actions'>
                  <button
                    onClick={() => handleDownload(ticket.docId)}
                    title='Download ticket'
                    className='download-btn'
                  >
                    <span className='material-symbols-outlined'>download</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Section>
  );
};

export default TicketBody;
