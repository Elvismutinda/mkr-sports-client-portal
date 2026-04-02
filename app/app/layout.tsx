import AppShell from "@/components/AppShell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || !session.user.role) {
    redirect("/auth");
  }

  return <AppShell>{children}</AppShell>;
}