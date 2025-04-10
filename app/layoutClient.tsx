// app/LayoutClient.tsx
'use client';

import AuthProvider from '@providers/authProvider';

interface Props {
  children: React.ReactNode;
}

const LayoutClient: React.FC<Props> = ({ children }) => {
  return (
    <div className='light-theme'>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
};

export default LayoutClient;
