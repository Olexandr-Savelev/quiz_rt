"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTeamSchema } from "@/lib/zod/zodSchema";

import Input from "../ui/input";
import { useRouter } from "next/navigation";
import Button from "../ui/button";

import Team from "@/types/team";
import { ChangeEvent, useEffect, useState } from "react";

type TeamFormData = z.infer<typeof addTeamSchema>;

interface TeamFormProps {
  type?: "add" | "edit";
  team?: Team | null;
  closeModal?: () => void;
}

export default function TeamForm({
  type = "add",
  team,
  closeModal,
}: TeamFormProps) {
  const [pointsAmount, setPointsAmount] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    if (type === "edit" && team) {
      setPointsAmount(team.points + team.bet);
    }
  }, [type, team]);

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormData>({
    resolver: zodResolver(addTeamSchema),
    mode: "onSubmit",
    defaultValues: {
      teamName: type === "add" ? "" : team?.name,
      points: type === "add" ? 0 : team?.points,
      bet: type === "add" ? undefined : team?.bet,
    },
  });

  async function onSubmit(data: TeamFormData) {
    type === "add" ? await addTeam(data) : await updateTeam(data);
  }

  async function addTeam(data: TeamFormData) {
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

  async function updateTeam(data: TeamFormData) {
    try {
      const res = await fetch(`/api/team/${team!.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...team!,
          name: data.teamName,
          points: data.points,
          bet: data.bet,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }
      closeModal!();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteTeam(id: string) {
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handlePoints = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const points = Number(Number(target.value).toFixed(2));

    setPointsAmount(points);
    setValue("bet", 0);
  };

  const handleBet = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const bet = Number(target.value);
    const points = Number((pointsAmount - bet).toFixed(2));
    if (bet > 0) {
      setValue("points", points);
    } else {
      setValue("points", pointsAmount);
    }
  };

  const onDelete = async () => {
    let del = confirm("Are you sure?");
    if (del) {
      await deleteTeam(team!.id);
      closeModal!();
    }
  };

  return (
    <form
      className="flex flex-col gap-2 md:min-w-4 xl"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        register={register}
        type="text"
        name="teamName"
        label="Team name"
        error={errors?.teamName?.message}
      />
      <Input
        register={register}
        name="points"
        type="number"
        label="Points"
        onChange={handlePoints}
        error={errors?.points?.message}
        step="0.01"
      />
      {type === "edit" && (
        <Input
          register={register}
          name="bet"
          type="number"
          label="Bet"
          onChange={handleBet}
          error={errors?.bet?.message}
          step="0.01"
        />
      )}
      <Button
        disabled={isSubmitting}
        type="submit"
        loading={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
      {type === "edit" && (
        <Button
          type="button"
          className="mt-1"
          variant="warn"
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
    </form>
  );
}
