interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function EmptyData({ icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-slate-700 mb-5">{icon}</div>
      <p className="text-slate-600 font-black uppercase tracking-widest text-sm">
        {title}
      </p>
      <p className="text-slate-700 text-xs font-medium mt-1">{subtitle}</p>
    </div>
  );
}