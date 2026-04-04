import { footerConfig } from "@/config/footer";
import Link from "next/link";
import { Icons } from "./Icons";

const SiteFooter = () => {
  return (
    <footer className="bg-mkr-dark/40 pt-16 pb-8 px-6 border-t border-white/5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <span className="text-xl font-black text-white">MKR</span>
              <svg
                className="w-5 h-5 mkr-bolt mx-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-xs font-bold text-mkr-yellow uppercase tracking-widest ml-1">
                Sports
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed pr-4">
              Premium football experiences for serious players. Elevate your
              game under the lights with MKR Sports.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] ">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerConfig.quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-mkr-yellow text-sm font-bold transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Connect
            </h4>
            <ul className="space-y-4">
              {footerConfig.socials.map((item) => {
                const Icon = Icons[item.icon as keyof typeof Icons];
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-400 hover:text-white group transition-colors"
                    >
                      {Icon && (
                        <Icon className="w-4 h-4 text-mkr-yellow group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-sm font-bold">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Contact
            </h4>
            <ul className="space-y-4">
              {footerConfig.contact.map((item) => {
                const Icon = Icons[item.icon as keyof typeof Icons];
                return (
                  <li
                    key={item.title}
                    className="flex items-center gap-3 text-slate-400"
                  >
                    {Icon && <Icon className="w-4 h-4 text-mkr-yellow" />}
                    <span className="text-sm font-bold">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 items-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex md:justify-center">
            &copy; 2026 MKR Sports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
