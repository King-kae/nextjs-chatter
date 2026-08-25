import React from "react";
import { ButtonHTMLAttributes, forwardRef, ForwardedRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (...args: any[]) => any;
  disabled?: boolean;
  icon?: string;
  children?: React.ReactNode;
  sizing?: "sm" | "md" | "lg";
  colors?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"
    | "info"
    | "borderOnly"
    | "none";
}

interface SubClasses {
  [key: string]: string;
}

const sizingClasses: SubClasses = {
  lg: "w-full text-lg px-5 py-3",
  md: "w-full text-base px-4 py-2",
  sm: "w-fit text-sm px-3 py-1",
};

const colorsClasses: SubClasses = {
  primary:
    "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow hover:from-brand-500 hover:to-brand-400 active:scale-[0.98]",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 active:scale-[0.98]",
  borderOnly:
    "border border-ink-200 text-ink-800 hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98]",
  danger: "bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98]",
  warning: "bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]",
  info: "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]",
  none: "bg-transparent text-ink-800 hover:bg-ink-100 active:scale-[0.98]",
};

// the reason I'm using const componentName is because I'm using forward refc

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    title,
    type = "button",
    className = "",
    onClick,
    disabled = false,
    sizing,
    colors,
    icon,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      title={title}
      type={type}
      className={`
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200 ease-out
          flex-1
          font-semibold
          rounded-xl
          ${sizing ? sizingClasses[sizing] : sizingClasses["md"]}
          ${colors ? colorsClasses[colors] : colorsClasses["primary"]}
          ${className}
        `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

// Button.displayName = 'Button';

export default Button;
