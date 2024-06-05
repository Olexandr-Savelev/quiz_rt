"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
  name: string;
  //TODO: FIX register type issue.
  // register: UseFormRegister<FieldValues>;
  register: any;
}

export default function Input({
  register,
  name,
  error,
  label,
  required,
  className,
  ...rest
}: Props) {
  return (
    <fieldset
      className={`flex flex-col relative ${className ? className : ""}`}
    >
      <label
        htmlFor={name}
        className="text-sm font-semibold mb-1 w-fit"
      >
        {label + (required ? " *" : "")}
      </label>
      <input
        {...register(name)}
        id={name}
        name={name}
        {...rest}
        className={cn(
          "mb-6 w-full rounded-lg border-[1.5px] px-3 py-2 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter",
          error && "border-red-500 focus:border-red-500 active:border-red-500"
        )}
      />
      {error && (
        <span className="text-sm text-red-500 absolute bottom-0 left-0">
          {error}
        </span>
      )}
    </fieldset>
  );
}
