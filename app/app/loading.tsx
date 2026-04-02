import { Zap } from "lucide-react";

export default function loading() {
  return (
    <main className="flex min-h-full w-full flex-col items-center justify-center gap-4 bg-mkr-dark p-24">
      <Zap className="h-8 w-8 animate-bolt-flash fill-mkr-yellow text-mkr-yellow" />
      <p className="text-lg font-bold text-center text-white">Hold tight!</p>
      <p className="text-sm text-center text-light-200">
        We are weaving magic into every pixel just for you.
      </p>
    </main>
  );
}
