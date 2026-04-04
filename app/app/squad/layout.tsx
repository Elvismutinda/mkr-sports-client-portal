import { ReactNode } from 'react';

export const metadata = {
  title: 'Squad — MKR Sports',
  description: 'Your team roster and player information',
};

export default function SquadLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}