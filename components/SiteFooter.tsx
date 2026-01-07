const SiteFooter = () => {
  return (
    <footer className="pt-20 pb-10 px-4 border-t border-white/5 text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-xl font-black text-white italic">MKR</span>
          <svg className="w-5 h-5 mkr-bolt mx-1" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <span className="text-xs font-bold text-mkr-yellow uppercase tracking-widest">Sports</span>
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">&copy; 2026 MKR Sports</p>
    </footer>
  );
};

export default SiteFooter;