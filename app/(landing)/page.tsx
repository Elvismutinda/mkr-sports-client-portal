import HeroSection from "@/components/HeroSection";
import UpcomingGamesCard from "@/components/UpcomingGamesCard";
import SiteFooter from "@/components/SiteFooter";
import TournamentsSection from "@/components/TournamentsSection";
import { Tournament } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function IndexPage() {
  const [matchesRes, tournamentsRes] = await Promise.all([
    fetch(`${BASE_URL}/api/matches`, { cache: "no-store" }),
    fetch(`${BASE_URL}/api/tournaments/ongoing`, { cache: "no-store" }),
  ]);

  const matches = matchesRes.ok ? await matchesRes.json() : [];
  const tournaments: Tournament[] = tournamentsRes.ok
    ? await tournamentsRes.json()
    : [];

  return (
    <>
      <HeroSection />
      <UpcomingGamesCard matches={matches} />
      <TournamentsSection tournaments={tournaments} />
      <SiteFooter />
    </>
  );
}
