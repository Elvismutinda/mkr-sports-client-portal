"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTeamSchema, CreateTeamRequest } from "@/lib/validations/team";
import { createTeam } from "@/app/app/squad/actions";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { TurfCombobox } from "./TurfCombobox";

interface TurfOption {
  id: string;
  name: string;
  area?: string;
  city: string;
}

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateTeamModal({ onClose, onCreated }: Props) {
  const [isPending, startTransition] = useTransition();
  const [turfs, setTurfs] = useState<TurfOption[]>([]);

  const form = useForm<CreateTeamRequest>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: {
      name: "",
      type: "",
      bio: "",
      homePitchId: "",
      trainingPitchId: "",
      sameAsHome: false,
    },
  });

  const sameAsHome = useWatch({ control: form.control, name: "sameAsHome" });
  const homePitchId = useWatch({ control: form.control, name: "homePitchId" });

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await fetch("/api/turfs/all");
        const data = await res.json();
        setTurfs(Array.isArray(data) ? data : []);
      } catch {
        setTurfs([]);
      }
    };

    fetchTurfs();
  }, []);

  useEffect(() => {
    if (sameAsHome) {
      form.setValue("trainingPitchId", homePitchId);
    }
  }, [sameAsHome, homePitchId, form]);

  const onSubmit = (values: CreateTeamRequest) => {
    startTransition(() => {
      createTeam(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          onCreated();
          onClose();
        }
      });
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-[#0d1117] border border-white/10 rounded-[1.75rem] p-7 shadow-2xl flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Register Team
            </h2>
            <p className="text-xs font-black tracking-widest text-slate-500 mt-0.5">
              You will be set as captain
            </p>
          </div>
          <Button onClick={onClose} variant="primary" size="icon">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Team Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. MKR United"
                      disabled={isPending}
                      className="bg-mkr-navy border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Team Type
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="5-a-side, Club..."
                      disabled={isPending}
                      className="bg-mkr-navy border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      disabled={isPending}
                      placeholder="Brief description..."
                      className="bg-mkr-navy border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="homePitchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Home Pitch (optional)
                  </FormLabel>
                  <FormControl>
                    <TurfCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={turfs}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* SAME AS HOME */}
            <FormField
              control={form.control}
              name="sameAsHome"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <FormLabel className="text-xs text-slate-400">
                    Training pitch same as home
                  </FormLabel>
                </FormItem>
              )}
            />

            {!sameAsHome && (
              <FormField
                control={form.control}
                name="trainingPitchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Training Pitch (optional)
                    </FormLabel>
                    <FormControl>
                      <TurfCombobox
                        value={field.value}
                        onChange={field.onChange}
                        options={turfs}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              disabled={isPending}
              variant="primary"
              className="w-full"
            >
              {isPending ? "Creating..." : "Create Team"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
