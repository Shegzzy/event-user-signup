'use client';

import { useState, useEffect } from 'react';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import { useAuth } from '@providers/authProvider';
import { useParams } from 'next/navigation';

const TicketForm: React.FC = () => {
  const { url } = useParams() ?? {};
  const { showAlert, hideAlert } = useAlert();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  // const [formValues, setFormValues] = useState<IData[]>(data);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      console.log(url);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    hideAlert();

    // const quantity: number = countTickets(formValues);

    if (user) {
      setLoading(true);

      window.location.href = `/buy?eventId=${url}`;
    } else {
      window.location.href = '/members/signin';
      showAlert({ type: 'error', text: 'You must login to get ticket.' });
    }
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Hang on a second' />;
  }

  return (
    <div className='ticket-box-buttons'>
      <form
        noValidate
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <Button
          type='submit'
          color='blue-filled'
          text='Generate ticket'
          rightIcon='arrow_forward'
        />
      </form>
    </div>

    // <form
    //   noValidate
    //   onSubmit={(e) => {
    //     void handleSubmit(e);
    //   }}
    // >
    //   <div className='ticket-box-content'>
    //     {formValues?.map((ticket) => (
    //       <div key={ticket.id} className='ticket-box-line'>
    //         {ticket.soldout === true ? (
    //           <>
    //             <span className='material-symbols-outlined'>lock</span>
    //             <span>{ticket.name}</span>
    //             <strong>Sold out</strong>
    //             {ticket.information != null && (
    //               <span className='material-symbols-outlined icon' title={ticket.information}>
    //                 info
    //               </span>
    //             )}
    //           </>
    //         ) : (
    //           <>
    //             <div className='quantity'>
    //               <button
    //                 type='button'
    //                 onClick={() => {
    //                   handleDecrease(ticket);
    //                 }}
    //               >
    //                 -
    //               </button>
    //               <input
    //                 readOnly
    //                 type='text'
    //                 name={`t-${ticket.id}`}
    //                 value={ticket.quantity ?? 0}
    //                 onChange={() => {}}
    //               />
    //               <button
    //                 type='button'
    //                 onClick={() => {
    //                   handleIncrease(ticket);
    //                 }}
    //               >
    //                 +
    //               </button>
    //             </div>
    //             <span>{ticket.name}</span>
    //             <strong>{ticket.price}</strong>
    //             {ticket.information != null && (
    //               <span className='material-symbols-outlined icon' title={ticket.information}>
    //                 info
    //               </span>
    //             )}
    //           </>
    //         )}
    //       </div>
    //     ))}
    //   </div>
    //   <div className='ticket-box-buttons'>
    //     {formValues.length > 0 ? (
    //       <Button type='submit' color='blue-filled' text='Buy tickets' rightIcon='arrow_forward' />
    //     ) : (
    //       <Button type='submit' color='disabled' text='Tickets not found' />
    //     )}
    //   </div>
    // </form>
  );
};

export default TicketForm;
