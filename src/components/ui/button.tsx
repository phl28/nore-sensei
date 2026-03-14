import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "outline" && "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          variant === "destructive" && "bg-destructive text-white hover:bg-destructive/90",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, cn };
export type { ButtonProps };
