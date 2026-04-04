import { ReactNode } from 'react';

export const metadata = {
  title: 'Events — MKR Sports',
  description: 'Your upcoming events and tournaments',
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}