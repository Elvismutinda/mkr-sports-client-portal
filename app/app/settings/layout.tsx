import { ReactNode } from 'react';

export const metadata = {
  title: 'Settings — MKR Sports',
  description: 'Your account settings and preferences',
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}