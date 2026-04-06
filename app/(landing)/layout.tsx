import LandingNavbar from "@/components/LandingNavbar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mkr-navy text-slate-100">
      <LandingNavbar />
      <main>{children}</main>
    </div>
  );
}