'use client';

// providers
import AlertProvider from '@providers/AlertProvider';

// components
import Alert from '@components/Alert/Alert';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import AuthProvider from '@providers/authProvider';

// interfaces
interface IProps {
  children: React.ReactNode;
}

const Master: React.FC<IProps> = ({ children }) => (
  <div className='light-theme'>
    <AuthProvider>
      <AlertProvider>
        <Alert />
        <Header />
        {children}
        <Footer />
      </AlertProvider>
    </AuthProvider>
  </div>
);

export default Master;
