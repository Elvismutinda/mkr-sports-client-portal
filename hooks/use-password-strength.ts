import { useCallback } from "react";

export type StrengthLevel = {
  label: "Too short" | "Weak" | "Fair" | "Strong";
  color: string;
  width: string;
};

export function usePasswordStrength(password: string): StrengthLevel | null {
  const compute = useCallback((pw: string): StrengthLevel | null => {
    if (pw.length === 0) return null;
    if (pw.length < 6)
      return { label: "Too short", color: "bg-red-500", width: "w-1/4" };
    if (pw.length < 8)
      return { label: "Weak", color: "bg-orange-500", width: "w-2/4" };
    if (pw.length < 12 || !/[0-9]/.test(pw))
      return { label: "Fair", color: "bg-amber-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-400", width: "w-full" };
  }, []);

  return compute(password);
}
