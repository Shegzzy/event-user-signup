import { type Metadata } from 'next';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import ButtonLink from '@components/Button/ButtonLink';

const Page: React.FC = () => (
  <Master>
    <Section className='white-background'>
      <div className='container'>
        <div className='center'>
          <Heading type={1} color='gray' text='Ticket Generated' />
          <p className='gray form-information'>
            Your ticket was generated successfully, expect an email with the ticket details from the
            Admin.
          </p>

          <div className='button-container'>
            <ButtonLink color='blue-filled' text='Return to home' url='' />
          </div>
        </div>
      </div>
    </Section>
  </Master>
);

const title = 'Ticket generated';
const canonical = 'https://modern-ticketing.com/members/generated';
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
