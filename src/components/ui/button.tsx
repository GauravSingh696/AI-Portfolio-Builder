import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500/50 hover:scale-[1.015] active:scale-95 overflow-hidden cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-500 via-indigo-500 to-indigo-600 text-white shadow-lg hover:shadow-xl focus-visible:ring-violet-400/70",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl focus-visible:ring-red-400/70",
        outline:
          "border border-violet-500/60 bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 hover:from-violet-100 hover:to-indigo-100 shadow-sm",
        secondary:
          "bg-gradient-to-r from-indigo-100 to-violet-100 text-violet-800 shadow-sm hover:shadow-md",
        ghost:
          "text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50",
        link: "text-violet-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    loadingText?: React.ReactNode
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || loading

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "cursor-wait opacity-80"
        )}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "cursor-wait opacity-80"
      )}
      aria-busy={loading || undefined}
      type={type}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span className="inline-flex items-center gap-2">
        {loading ? loadingText ?? children : children}
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }
