import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-mkr-navy flex min-h-screen flex-col lg:flex-row overflow-hidden">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 relative z-10 bg-mkr-navy">
        <div className="w-full max-w-md">{children}</div>
      </div>

      <div className="hidden lg:block w-1/2 relative bg-mkr-dark overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-mkr-navy via-mkr-navy/40 to-transparent z-10" />

        <Image
          src="/images/football-field.jpeg"
          alt="Football Field"
          fill
          className="object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s] ease-linear"
          priority
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-20 text-center">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mkr-bolt drop-shadow-[0_0_30px_rgba(255,234,0,0.4)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-tight mb-6">
            Unleash Your <br />
            <span className="text-mkr-yellow">Power</span>
          </h2>

          <p className="text-slate-300 max-w-md font-bold text-lg uppercase tracking-wide opacity-80">
            Synchronize. Execute. Dominate.
          </p>

          <div className="mt-20 flex gap-12 opacity-40">
            <Stat label="Active Players" value="2.4k" />
            <Stat label="Match Efficiency" value="98%" />
            <Stat label="Powered Scouting" value="AI" />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-[10px] font-black text-mkr-yellow uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}
