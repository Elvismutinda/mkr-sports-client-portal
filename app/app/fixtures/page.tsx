import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CustomHeader } from "@/components/CustomHeader";
import { EmptyFixtures } from "@/components/fixtures/EmptyFixtures";
import { FixtureList } from "@/components/fixtures/FixtureList";
import { getMyFixtures } from "@/data/fixtures";

export default async function FixturesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const fixtures = await getMyFixtures(session.user.id);

  return (
    <div className="px-6 py-12 md:px-16">
      <CustomHeader
        title="Fixtures"
        subtitle="View your upcoming and past matches"
      />
      {fixtures.length === 0 ? (
        <EmptyFixtures />
      ) : (
        <FixtureList fixtures={fixtures} />
      )}
    </div>
  );
}
