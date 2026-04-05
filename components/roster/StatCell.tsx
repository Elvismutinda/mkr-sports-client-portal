import { ReactNode } from "react";

type StatCellProps = {
  icon: ReactNode;
  value: number | string;
  label: string;
  highlight?: boolean;
};

export function StatCell({
  icon,
  value,
  label,
  highlight = false,
}: StatCellProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-black/30 rounded-xl px-3 py-3 gap-1">
      <span className="text-slate-500 text-sm">{icon}</span>
      <span
        className={`font-black text-xl leading-none ${
          highlight ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </span>
      <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-500">
        {label}
      </span>
    </div>
  );
}
