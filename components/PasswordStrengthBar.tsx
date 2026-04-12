import { usePasswordStrength } from "@/hooks/use-password-strength";

interface PasswordStrengthBarProps {
  password: string;
}

const labelColorMap: Record<string, string> = {
  Strong: "text-emerald-400",
  Fair: "text-amber-400",
  "Too short": "text-red-400",
  Weak: "text-red-400",
};

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const strength = usePasswordStrength(password);

  if (!strength) return null;

  return (
    <div className="mt-2 px-1">
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
        />
      </div>
      <p
        className={`text-[9px] font-black uppercase tracking-widest mt-1 ${labelColorMap[strength.label]}`}
      >
        {strength.label}
      </p>
    </div>
  );
}
