import { auth } from '@/auth';
import { Profile } from '@/components/settings/Profile';
import { getPlayerStats } from '@/data/stats';
import { Position } from '@/types/types';
import { User } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth();

  const sessionUser = session?.user as
    | (User & {
        role: "player" | "agent";
        phone: string;
        position: Position;
        avatarUrl?: string;
      })
    | undefined;

  if (!sessionUser) {
    return redirect("/login");
  }

  const stats = sessionUser.id
    ? await getPlayerStats(sessionUser.id)
    : undefined;
 
  const user = { ...sessionUser, stats };

  return (
    <div className="px-6 py-8 lg:px-12">
      <Profile user={user} />
    </div>
  );
}