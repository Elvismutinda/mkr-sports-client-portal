import { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard — MKR Sports',
  description: 'Your personalized dashboard with stats, upcoming matches, and more',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}