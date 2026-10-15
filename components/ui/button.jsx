import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[transform,box-shadow,opacity,background-color] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.96] active:duration-75 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer touch-manipulation transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm border border-black dark:border-white",
        brand: "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md border border-black dark:border-white",
        rainbow: "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md border border-black dark:border-white",
        "rainbow-outline": "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-xs",
        orange: "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm border border-black dark:border-white",
        "orange-outline": "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-xs",
        cool: "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm border border-black dark:border-white",
        "cool-outline": "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-xs",
        amber: "bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black dark:hover:bg-white shadow-xs border border-zinc-700 dark:border-zinc-300",
        cyan: "bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black dark:hover:bg-white shadow-xs border border-zinc-700 dark:border-zinc-300",
        outline:
          "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-xs",
        secondary:
          "bg-zinc-100 text-black hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800",
        ghost:
          "hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white text-zinc-700 dark:text-zinc-300",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-black dark:text-white underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-3.5",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2.5 px-6 text-base rounded-2xl",
        icon: "size-9 rounded-xl",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-lg",
        "icon-lg": "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
