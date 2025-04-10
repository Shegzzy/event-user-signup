'use client';

import { useEffect, useRef, useState } from 'react';

// hooks
// import useAlert from '@hooks/useAlert';

// components
// import Input from '@components/Form/Input';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import Heading from '@components/Heading/Heading';

// utils
// import Request, { type IRequest, type IResponse } from '@utils/Request';
import { useAuth } from '@providers/authProvider';
import { QRCodeCanvas } from 'qrcode.react';
import { useSearchParams } from 'next/navigation';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import emailjs from '@emailjs/browser';
import useAlert from '@hooks/useAlert';

// interfaces

const Form: React.FC = () => {
  const { userData, loadingAuth, user } = useAuth();

  const searchParams = useSearchParams();
  const event_id = searchParams.get('eventId');
  const [loading, setLoading] = useState<boolean>(false);
  const [eventData, setEventData] = useState<any>(null);
  const [qrCode, setqrCode] = useState<any>('');
  const [imageData, setImageData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      if (!event_id) return;

      try {
        const docRef = doc(db, 'events', event_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEventData(docSnap.data());
          setqrCode(uuidv4);
        } else {
          console.error('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id]);

  useEffect(() => {
    if (canvasRef.current) {
      const imgData = canvasRef.current.toDataURL('image/png');
      setImageData(imgData);
    }
  }, [qrCode]);

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

  /**
   * Handles form submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   * @return {Promise<any>}
   */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    hideAlert();

    // Check if the user is already registered for the event
    const isAlreadyRegistered = await checkIfAlreadyRegistered(user?.uid || '', eventData.id);
    if (isAlreadyRegistered) {
      showAlert({ type: 'error', text: 'You are already registered for this event.' });
      return;
    }

    const attendeeData = {
      eventName: eventData.title,
      eventSpeaker: eventData.speaker,
      eventId: eventData.id,
      eventDate: eventData.date,
      eventTime: eventData.time,
      location: eventData.location,
      userId: user?.uid,
      name: userData.name,
      email: userData.email,
      status: 'not checked in',
      eventQr: qrCode,
      timeStamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'attendees'), attendeeData);

    await setDoc(doc(db, 'attendees', docRef.id), { id: docRef.id }, { merge: true });

    sendEmail(e);
  };

  // Function to check if the user is already registered
  const checkIfAlreadyRegistered = async (userId: string, eventId: string): Promise<boolean> => {
    const attendeesRef = collection(db, 'attendees');
    const q = query(attendeesRef, where('userId', '==', userId), where('eventId', '==', eventId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0;
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    const serviceId = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY;

    const emailTemplate = {
      image_url: imageData,
      name: eventData.title,
      email: userData.email,
      speaker: eventData.speaker,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
    };

    try {
      const response = await emailjs.send(serviceId, templateId, emailTemplate, publicKey);
      if (response.status === 200) {
        showAlert({ type: 'success', text: 'Email sent successfully' });
        window.location.href = '/generated';
      }
    } catch (error) {
      showAlert({ type: 'error', text: 'Failed to send email' });
      console.error('Email sending error:', error);
    }
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Hang on a second' />;
  }

  return (
    <form
      className='form shrink'
      noValidate
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className='form-elements'>
        <div className='padding-top center'>
          <div className='padding-top'>
            <Heading type={5} color='gray' text='Details' />
            <p>
              <strong>Event</strong> {eventData?.title || ''}
            </p>
            <p>
              <strong>Venue</strong> {eventData?.location || ''}
            </p>
            <p>
              <strong>Date</strong>{' '}
              {eventData?.date
                ? new Date(eventData?.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : ''}{' '}
              {formatTime(eventData?.time || '')}
            </p>
          </div>
        </div>
        <div className='form shrink'>
          <table className='table'>
            <thead>
              <tr>
                <th className='left'>Name</th>
                <th className='center'>Email.</th>
                <th className='right'>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {!loadingAuth && (
                <tr>
                  <td className='left'>{userData?.name || ''}</td>
                  <td className='center'>{userData?.email || ''}</td>
                  <td className='right'>{userData?.mobile || ''}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='container center'>
          <QRCodeCanvas value={qrCode} size={150} ref={canvasRef} level='H' bgColor='white' />
        </div>

        <div className='form-buttons'>
          <Button type='submit' color='blue-filled' text='Get ticket' />
        </div>
      </div>
    </form>
  );
};

export default Form;
