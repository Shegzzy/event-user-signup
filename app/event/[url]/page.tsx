import { type Metadata } from 'next';

// components
import Master from '@components/Layout/Master';
import EventDetail from './components/eventDetails';

const Page: React.FC = () => (
  <Master>
    <EventDetail />
  </Master>
);

const title = 'Event Details';
const canonical = 'https://modern-ticketing.com/event/1';
const description = 'Modern ticketing is a modern ticketing solution';

export const metadata: Metadata = {
  title,
  description,
  keywords: 'modern ticketing',
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    type: 'website',
    siteName: 'Modern Ticketing',
    images: 'https://modern-ticketing.com/logo192.png',
  },
};

export default Page;
