import { auth } from "@/auth";
import { Profile } from "@/components/settings/Profile";
import { Position } from "@/types/types";
import { User } from "next-auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/data/user";

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

  if (!sessionUser?.id) {
    return redirect("/login");
  }

  // Fetch the full DB record so stats, attributes, and aiAnalysis are available
  const result = await getUserById(sessionUser.id);

  if (!result || result.length === 0) {
    return redirect("/login");
  }

  const dbUser = result[0];

  if (!dbUser) {
    return redirect("/login");
  }

  // Merge session user (has next-auth fields like `image`) with DB record
  const user = {
    ...sessionUser,
    stats: dbUser.stats ?? undefined,
    attributes: dbUser.attributes ?? undefined,
    aiAnalysis: dbUser.aiAnalysis ?? undefined,
  };

  return (
    <div className="px-6 py-8 lg:px-12">
      <Profile user={user} />
    </div>
  );
}