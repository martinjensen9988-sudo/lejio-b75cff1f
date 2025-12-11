import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-border bg-transparent hover:bg-muted hover:border-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg shadow-secondary/30",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Sunshine Yellow CTA - the happy button!
        hero: "bg-secondary text-secondary-foreground font-extrabold hover:bg-secondary/90 shadow-lg shadow-secondary/40 hover:shadow-xl hover:shadow-secondary/50 hover:scale-105 active:scale-100",
        // Coral Peach - warm and inviting
        warm: "bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-105 active:scale-100",
        // Mint green - fresh success
        mint: "bg-mint text-mint-foreground font-bold hover:bg-mint/90 shadow-lg shadow-mint/30 hover:shadow-xl hover:shadow-mint/40 hover:scale-105 active:scale-100",
        // Soft lavender
        lavender: "bg-lavender text-lavender-foreground font-bold hover:bg-lavender/90 shadow-lg shadow-lavender/30",
        // Glass effect for light backgrounds
        glass: "bg-card/80 border-2 border-border text-foreground hover:bg-card hover:border-primary/30 backdrop-blur-sm",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-xl px-4",
        lg: "h-13 rounded-2xl px-8 text-base",
        xl: "h-14 rounded-3xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
