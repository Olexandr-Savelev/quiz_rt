"use client";

import { addTeamSchema } from "@/lib/zod/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof addTeamSchema>;

export default function Home() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(addTeamSchema),
  });

  useEffect(() => {
    fetch("/api/game", { method: "GET" });
  }, []);

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.teamName, points: data.points }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  return (
    <form
      className="flex flex-col gap-2 p-10"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <label
          className="mb-1 block text-sm font-medium text-black"
          htmlFor="teamName"
        >
          Team name:
        </label>
        <input
          {...register("teamName", { required: true })}
          name="teamName"
          id="teamName"
          className="mb-6 w-full rounded-lg border-[1.5px] px-3 py-2 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        {errors?.teamName && (
          <p className="text-red-600 text-sm absolute bottom-0 left-0">
            {errors?.teamName?.message}
          </p>
        )}
      </div>

      <div className="relative">
        <label
          className="mb-1 block text-sm font-medium text-black"
          htmlFor="points"
        >
          Points:
        </label>
        <input
          {...register("points", { required: true })}
          name="points"
          type="number"
          id="points"
          className="mb-6 w-full rounded-lg border-[1.5px] px-3 py-2 text-black outline-none transition focus:border-blue-500 active:border-primary disabled:cursor-default disabled:bg-whiter"
        />
        {errors?.points && (
          <p className="text-red-600 text-sm absolute bottom-0 left-0">
            {errors?.points?.message}
          </p>
        )}
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting || !isValid}
        type="submit"
      >
        {isSubmitting ? "Loading" : "Submit"}
      </button>
    </form>
  );
}
