// import Link from 'next/link';

import { type Metadata } from 'next';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import ButtonGroup from '@components/Button/ButtonGroup';
import ButtonGroupItem from '@components/Button/ButtonGroupItem';
import TicketBody from './components/TicketBody';

const Page: React.FC = () => (
  <Master>
    <Section className='white-background'>
      <div className='container'>
        <div className='center'>
          <Heading type={1} color='gray' text='My tickets' />
          <p className='gray form-information'>
            You can access the tickets you purchased from this page at any time. You can download or
            send your tickets. Please note: You will not be able to see tickets for events that have
            already ended or been canceled on this page.
          </p>
          <div className='button-container'>
            <ButtonGroup color='gray'>
              <ButtonGroupItem url='members/tickets' text='My tickets' active />
              <ButtonGroupItem url='members/account' text='My account' />
            </ButtonGroup>
          </div>
        </div>
      </div>
    </Section>
    <TicketBody />
  </Master>
);

const title = 'My tickets';
const canonical = 'https://modern-ticketing.com/members/tickets';
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
