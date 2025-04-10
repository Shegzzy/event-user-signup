'use client';

import { useState } from 'react';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Input from '@components/Form/Input';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import { useAuth } from '@providers/authProvider';

// interfaces
interface IFormProps {
  email: string;
}

const Form: React.FC = () => {
  const { showAlert, hideAlert } = useAlert();
  const { resetPassword, logout, user, loadingAuth } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IFormProps>({
    email: '',
  });

  /**
   * Handles the change event for input fields in the form.
   *
   * This function is called when the value of an input field in the form changes. It updates the state of the form values with the new value.
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
   * This function is called when the form is submitted. It prevents the default form submission behavior,
   * hides any existing alert, sets the loading state to true, sends a POST request to the signin/password endpoint,
   * and handles the response. If the response status is 200, it does nothing. If the status is not 200, it shows an error alert.
   * Finally, it sets the loading state back to false.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<any>} A promise that resolves when the request is complete.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    hideAlert();

    setLoading(true);

    try {
      await resetPassword(formValues.email);

      if (user) {
        await logout();
      }
      showAlert({ type: 'success', text: 'Check your email for password reset' });
      window.location.href = '/members/signin';
    } catch (error: any) {
      showAlert({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingAuth) {
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
              <label htmlFor='email'>E-mail address</label>
            </div>
            <Input
              type='email'
              name='email'
              value={formValues.email}
              maxLength={128}
              placeholder='Enter your e-mail address'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-buttons'>
          <Button type='submit' color='blue-filled' text='Reset password' />
        </div>
      </div>
    </form>
  );
};

export default Form;
