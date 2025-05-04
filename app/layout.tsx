// types
import { type Metadata, type Viewport } from 'next';

// styles
import './styles/ui.css';
import './styles/site.css';
import LayoutClient from './layoutClient';

// variables
export const runtime = 'edge';

const RootLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({ children }) => (
  <html lang='en'>
    <body>
      <LayoutClient>{children}</LayoutClient>
    </body>
  </html>
);

const title = 'Nordic Event';
const canonical = 'https://nordicnigeriaconnect.com/event';
const description =
  'Nordic Nigeria Connect is an event that connects Nordic and Nigerian businesses.';

export const viewport: Viewport = {
  width: 'device-width',
  themeColor: '#ffffff',
  initialScale: 1,
};

export const metadata: Metadata = {
  title,
  description,
  // robots: 'noindex, nofollow', // TODO: change in production
  keywords: 'nordic, nigeria, connect, event, ticketing',
  alternates: { canonical },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/apple-touch-icon.png',
  },
  metadataBase: new URL(canonical),
  openGraph: {
    title,
    description,
    url: canonical,
    type: 'website',
    images: '/NNLC.png',
    siteName: 'Nordic Event',
  },
};

export default RootLayout;
