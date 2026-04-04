"use client";

import { useTransition } from "react";
import { deleteAccount } from "@/app/app/settings/actions";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const DeleteAccount = () => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const toastId = toast.loading("Terminating operative clearance...");
    startTransition(() => {
      deleteAccount().then((data) => {
        if (data?.error) {
          toast.error(data?.error, { id: toastId });
        } else {
          toast.success(data?.success, { id: toastId });
          signOut({ callbackUrl: "/login" });
        }
      });
    });
  };

  return (
    <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
      <h4 className="text-red-500 font-black uppercase tracking-tight mb-2">
        Danger Zone
      </h4>
      <p className="text-slate-500 text-xs font-bold mb-6">
        Permanently delete your MKR Sports account together with all your
        associated data. This action is irreversible.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-red-300 shadow-sm h-auto px-8 py-3 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 hover:text-red-200">
            Delete Account
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="bg-mkr-dark border border-white/10 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-black uppercase tracking-tight text-lg">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-xs font-bold leading-relaxed">
              This will permanently delete your profile, matches
              history, and all associated data.{" "}
              <span className="text-red-400">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 mt-2">
            <AlertDialogCancel className="rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10 text-[10px] font-black uppercase tracking-widest transition-colors h-auto px-6 py-2.5 disabled:opacity-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleDelete}
              className="rounded-xl bg-red-500/20 text-red-300 border border-red-500/20 hover:bg-red-500/30 hover:text-red-200 text-[10px] font-black uppercase tracking-widest transition-colors h-auto px-6 py-2.5 disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccount;