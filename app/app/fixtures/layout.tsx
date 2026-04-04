import { ReactNode } from 'react';

export const metadata = {
  title: 'Fixtures — MKR Sports',
  description: 'Your upcoming matches and tournament information',
};

export default function FixturesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}