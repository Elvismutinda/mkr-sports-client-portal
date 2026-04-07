"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TurfOption {
  id: string;
  name: string;
  area?: string;
  city: string;
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  options: TurfOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function TurfCombobox({
  value,
  onChange,
  options,
  placeholder = "Select turf",
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((t) => t.id === value);

  const formatLabel = (t: TurfOption) =>
    `${t.name}${t.area ? ` • ${t.area}` : ""} • ${t.city}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between bg-mkr-navy border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white hover:bg-mkr-navy hover:text-white"
        >
          <span
            className={cn(
              "truncate",
              !selected ? "text-white/40" : "text-white",
            )}
          >
            {selected ? formatLabel(selected) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 bg-[#0d1117] border-white/10">
        <Command>
          <CommandInput placeholder="Search turf..." />
          <CommandEmpty>No turf found.</CommandEmpty>

          <CommandGroup>
            {options.map((t) => (
              <CommandItem
                key={t.id}
                value={`${t.name} ${t.area ?? ""} ${t.city}`}
                onSelect={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === t.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {formatLabel(t)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
