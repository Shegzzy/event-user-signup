import Link from 'next/link';

import { type Metadata } from 'next';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';

import Form from './components/Form';

const Page: React.FC = () => {
  return (
    <Master>
      <Section className='white-background'>
        <div className='container'>
          <div className='center'>
            <Heading type={1} color='gray' text='Get your ticket' />
            <p className='gray'>
              Generate your ticket for this event. We will issue and send your ticket to your e-mail
              address immediately.
            </p>
          </div>

          <Form />

          {/* <div className='paragraph-container center'>
          <p>
            By clicking place payment button I agree to the&nbsp;
            <Link href='/legal/terms-of-service' className='blue'>
              Terms of service
            </Link>
          </p>
        </div> */}
        </div>
      </Section>
    </Master>
  );
};

const title = 'Get ticket';
const canonical = 'https://modern-ticketing.com/buy';
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
    siteName: 'Event Ticketing',
    images: 'https://modern-ticketing.com/logo192.png',
  },
};

export default Page;
