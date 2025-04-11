'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Input from '@components/Form/Input';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';

// utils
// import Request, { type IRequest, type IResponse } from '@utils/Request';
import { useAuth } from '@providers/authProvider';

// inte

interface IFormProps {
  name: string;
  email: string;
  mobile: string;
}

const FormMain: React.FC = () => {
  const { showAlert, hideAlert } = useAlert();

  const { userData, loadingAuth, updateUserDetails } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IFormProps>({
    name: '',
    email: '',
    mobile: '',
  });

  useEffect(() => {
    if (userData) {
      setFormValues({
        name: userData.name || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
      });
    }
  }, [userData]);

  /**
   * Handles the change event for input fields in the form.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  /**
   * Handles the form submission event.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<any>}
   */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();
    hideAlert();
    setLoading(true);

    try {
      await updateUserDetails({
        name: formValues.name,
        mobile: formValues.mobile,
      });

      showAlert({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      showAlert({ type: 'error', text: error.message ?? 'Something went wrong' });
    }

    setLoading(false);
  };

  if (loadingAuth || !userData || loading) {
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
        <div className='form-line'>
          <div className='one-line'>
            <div className='label-line'>
              <label htmlFor='name'>Full Name</label>
            </div>
            <Input
              type='text'
              name='name'
              value={formValues.name}
              maxLength={64}
              placeholder='Enter your full name'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-line'>
          <div className='one-line'>
            <div className='label-line'>
              <label htmlFor='mobile'>Phone Number</label>
            </div>
            <Input
              type='text'
              name='mobile'
              value={formValues.mobile}
              maxLength={64}
              placeholder='Enter your phone number'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-line'>
          <div className='one-line'>
            <div className='label-line flex flex-v-center flex-space-between'>
              <label htmlFor='email'>E-mail address</label>
              <Link href='/members/email' className='blue'>
                Change e-mail
              </Link>
            </div>
            <Input
              type='email'
              name='email'
              value={formValues.email}
              maxLength={128}
              placeholder='Enter your e-mail address'
              required
              disabled
              onChange={() => {}}
            />
          </div>
        </div>
        <div className='form-line'>
          <div className='label-line flex flex-v-center flex-space-between'>
            <label htmlFor='password'>Password</label>
            <Link href='/members/password' className='blue'>
              Change password
            </Link>
          </div>
          <Input
            type='password'
            name='password'
            value='dummypassword'
            maxLength={64}
            placeholder='Enter your password'
            required
            disabled
          />
        </div>
        <div className='form-buttons'>
          <Button type='submit' color='blue-filled' text='Update profile' />
        </div>
      </div>
    </form>
  );
};

export default FormMain;
