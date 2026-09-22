

import * as React from "react"
import { cn } from "@/lib/utils"

type Variant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "info"
  | "teal"
  | "success"
  | "accent"
  | "pink"
  | "warning"

type Size = "sm" | "md" | "lg"

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const baseStyles =
  "relative inline-flex items-center justify-center rounded-sm text-sm font-semibold overflow-hidden transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2"

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#0E40C7] text-white hover:shadow-lg hover:-translate-y-[1px] hover:shadow-[#0E40C7]/30 focus:ring-[#0E40C7]/40",
  secondary:
    "bg-[#FBAB18] text-white hover:shadow-lg hover:-translate-y-[1px] hover:shadow-[#FBAB18]/30 focus:ring-[#FBAB18]/40",
  destructive:
    "bg-[#C7332A] text-white hover:shadow-lg hover:-translate-y-[1px] hover:shadow-[#C7332A]/30 focus:ring-[#C7332A]/40",
  outline:
    "bg-transparent text-[#3769F1] hover:bg-[#3769F1] hover:text-white hover:-translate-y-[1px] focus:ring-[#3769F1]/40",
  ghost:
    "bg-transparent text-white hover:bg-[#CAD8FF]/40 hover:-translate-y-[1px] focus:ring-[#CAD8FF]/40",
  info:
    "bg-[#3769F1] text-white hover:bg-[#0E40C7] hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#3769F1]/30 focus:ring-[#3769F1]/40",
  teal:
    "bg-[#59C3C4] text-white hover:bg-[#479EA8] hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#59C3C4]/30 focus:ring-[#59C3C4]/40",
  success:
    "bg-[#6DC872] text-white hover:bg-[#4EA45A] hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#6DC872]/30 focus:ring-[#6DC872]/40",
  accent:
    "bg-[#6060E9] text-white hover:bg-[#453DBF] hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#6060E9]/30 focus:ring-[#6060E9]/40",
  pink:
    "bg-[#EB6190] text-white hover:bg-[#A73775] hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#EB6190]/30 focus:ring-[#EB6190]/40",
  warning:
    "bg-[#F6AF45] text-white hover:bg-[#E97B37] hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#F6AF45]/30 focus:ring-[#F6AF45]/40",
}

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
}

export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  PremiumButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      icon,
      iconPosition = "left",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          "group gap-2",
          disabled &&
            "opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0",
          className
        )}
        {...props}
      >
        {!disabled && (
          <span className="absolute inset-0 overflow-hidden rounded-sm">
            <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-white/20 blur-lg opacity-0 transition-all duration-500 group-hover:translate-x-[250%] group-hover:opacity-100" />
          </span>
        )}

        <span className="relative z-10 flex items-center gap-2">
          {icon && iconPosition === "left" && (
            <span className="flex items-center">{icon}</span>
          )}

          {children}

          {icon && iconPosition === "right" && (
            <span className="flex items-center">{icon}</span>
          )}
        </span>
      </button>
    )
  }
)

PremiumButton.displayName = "PremiumButton"