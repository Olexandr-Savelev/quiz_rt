import { ButtonHTMLAttributes } from "react";
import LoadingSpinner from "./loadingSpinner";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: "primary" | "warn" | "outline";
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 flex justify-center gap-3",
        loading && "opacity-50 cursor-not-allowed hover:bg-blue-500"
      )}
      {...rest}
    >
      {children} {loading && <LoadingSpinner size="sm" />}
    </button>
  );
}
