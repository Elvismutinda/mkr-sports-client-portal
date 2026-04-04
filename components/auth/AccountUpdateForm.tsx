"use client";

import { useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateAccountRequest,
  updateAccountSchema,
} from "@/lib/validations/user";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { updateAccount } from "@/app/app/settings/actions";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Position, POSITIONS } from "@/types/types";

const AccountUpdateForm = () => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const [firstName, lastName] = user?.name?.split(" ") || ["", ""];

  const form = useForm<UpdateAccountRequest>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      phone: user?.phone || "",
      position: (user?.position as Position) || undefined,
    },
  });

  const handleProfileUpdate = (values: UpdateAccountRequest) => {
    const toastId = toast.loading("Updating account information...");

    startTransition(() => {
      updateAccount(values).then((data) => {
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleProfileUpdate)}
          className="grid gap-6 py-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="First name"
                      type="text"
                      className="w-full h-12 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Last name"
                      type="text"
                      className="w-full h-12 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="XXXXXXXXX"
                      className="w-full h-12 bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow! outline-none font-bold placeholder-slate-700"
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1.5 ml-1">
                    Position
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-12! bg-mkr-dark/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-mkr-yellow outline-none font-bold placeholder-slate-700">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POSITIONS.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              size="md"
              variant="primary"
              type="submit"
              disabled={isPending}
            >
              Save Changes
              {isPending && <LoaderCircle className="animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AccountUpdateForm;
