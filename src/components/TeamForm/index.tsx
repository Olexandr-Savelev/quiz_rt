"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTeamSchema } from "@/lib/zod/zodSchema";

import Input from "../ui/input";
import { useRouter } from "next/navigation";
import Button from "../ui/button";

type TeamFormData = z.infer<typeof addTeamSchema>;

export default function TeamForm() {
  const router = useRouter();

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
      const res = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.teamName, points: data.points }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      const resData = await res.json();
      router.push(`/team/${resData.team.id}`);
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
        step="0.01"
      />
      <Button
        disabled={isSubmitting || !isValid}
        type="submit"
        loading={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
