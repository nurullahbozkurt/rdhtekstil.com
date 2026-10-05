import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const ctaVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold tracking-wide whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-navy-800 text-cream-50 hover:bg-navy-700 focus-visible:outline-navy-700",
        gold: "bg-gold-400 text-navy-950 hover:bg-gold-300 focus-visible:outline-gold-400",
        outline:
          "border border-navy-800/30 text-navy-900 hover:border-navy-800 hover:bg-navy-800/5 focus-visible:outline-navy-700",
        light:
          "border border-cream-50/40 text-cream-50 hover:border-cream-50 hover:bg-cream-50/10 focus-visible:outline-cream-50",
        link: "rounded-none px-0 text-navy-800 underline decoration-gold-500 decoration-2 underline-offset-[6px] hover:decoration-navy-800",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-7 text-[0.95rem]",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof ctaVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(ctaVariants({ variant, size }), className)} {...props} />;
}
