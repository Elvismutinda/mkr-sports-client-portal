import HeroSection from "@/components/HeroSection";
import UpcomingGamesCard from "@/components/UpcomingGamesCard";
import SiteFooter from "@/components/SiteFooter";
import TournamentsSection from "@/components/TournamentsSection";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function IndexPage() {
  const response = await fetch(`${BASE_URL}/api/matches`, {
    cache: "no-store",
  });

  const matches = await response.json();

  return (
    <>
      <HeroSection />
      <UpcomingGamesCard matches={matches} />
      <TournamentsSection />
      <SiteFooter />
    </>
  );
}
