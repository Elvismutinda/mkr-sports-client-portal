"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
        peer relative flex items-center justify-center
        h-4 w-4 shrink-0 rounded-[4px] border
        bg-mkr-navy/30 border-white/20 text-transparent
        shadow-sm transition-all outline-none

        hover:border-white/40

        data-[state=checked]:bg-mkr-yellow
        data-[state=checked]:border-mkr-yellow
        data-[state=checked]:text-mkr-navy

        focus-visible:ring-[3px]
        focus-visible:ring-mkr-yellow/30
        focus-visible:border-mkr-yellow

        disabled:cursor-not-allowed
        disabled:opacity-50
        `,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current animate-fade-in"
      >
        <CheckIcon className="h-3 w-3 stroke-[4]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
