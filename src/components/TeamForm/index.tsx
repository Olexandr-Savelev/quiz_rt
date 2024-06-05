"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTeamSchema } from "@/lib/zod/zodSchema";

import Input from "../ui/input";

type TeamFormData = z.infer<typeof addTeamSchema>;

export default function TeamForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TeamFormData>({
    resolver: zodResolver(addTeamSchema),
    mode: "all",
    defaultValues: {
      teamName: "",
      points: 0,
    },
  });

  async function onSubmit(data: TeamFormData) {
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
    }
  }

  return (
    <form
      className="flex flex-col gap-2 p-10"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        register={register}
        type="text"
        name="teamName"
        label="Team name"
        error={errors?.teamName?.message}
        required
      />
      <Input
        register={register}
        name="points"
        type="number"
        label="Points"
        error={errors?.points?.message}
        required
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
        disabled={isSubmitting || !isValid}
        type="submit"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
