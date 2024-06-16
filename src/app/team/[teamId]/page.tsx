"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import { betSchema } from "@/lib/zod/zodSchema";
import { pusherClient } from "@/lib/pusher/pusher";

import Team from "@/types/team";
import AnimatedLine from "@/components/ui/animatedLine";

type BetFormData = z.infer<typeof betSchema>;

const Page = ({ params }: { params: { teamId: string } }) => {
  const [isBetPlaced, setIsBetPlaced] = useState<boolean>(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [errMessage, setErrMessage] = useState<string>("");

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(betSchema),
    mode: "onSubmit",
    defaultValues: {
      bet: 1,
    },
  });

  useEffect(() => {
    getTeam(params.teamId);

    const channel = pusherClient.subscribe("channel");

    channel.bind("roundEnds", () => {
      getTeam(params.teamId);
    });

    channel.bind("updateTeam", updateTeam);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateTeam(teamToUpdate: Team) {
    if (teamToUpdate.id === params.teamId) {
      setTeam(teamToUpdate);
      teamToUpdate.bet !== 0 ? setIsBetPlaced(true) : setIsBetPlaced(false);
    }
  }

  async function getTeam(teamId: string) {
    const res = await fetch(`/api/team/${teamId}`);
    const data = await res.json();

    const team = data.team;

    setTeam(team);
    team.bet !== 0 ? setIsBetPlaced(true) : setIsBetPlaced(false);
  }

  async function onSubmit(data: BetFormData) {
    const teamPoints = Number((team!.points - data.bet).toFixed(2));
    if (data.bet < 1) {
      setError("bet", { message: "Minimum 1" });
      return;
    }
    if (teamPoints < 0) {
      setError("bet", { message: "You can't bet this number of points." });
      return;
    }
    const res = await fetch(`/api/team/${team!.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bet: data.bet, points: teamPoints }),
    });
    if (!res.ok) {
      throw new Error("Failed to submit the data. Please try again.");
    }
    setTeam({
      ...team!,
      points: teamPoints,
      bet: data.bet,
    });

    setIsBetPlaced(true);
  }

  if (!team) return <LoadingSpinner />;
  return (
    <div className="w-full md:py-4">
      <div className="w-full max-w-full min-h-[85vh] rounded shadow-lg shadow-gray-800 px-2 py-6 flex flex-col justify-center border border-gray-900 md:px-6 md:py-10">
        <h2 className="w-full text-4xl text-center mb-4 font-bold">
          {team.name}
        </h2>
        <p className="w-full text-3xl text-center text-gray-300 mb-4">
          Points: {team.points}
        </p>
        <AnimatedLine />
        <div className="flex flex-col justify-center my-6 w-full grow gap-4">
          <p className="text-4xl text-gray-400 w-full text-center">
            {!isBetPlaced ? "Place Your Bet" : `Your Bet: ${team.bet}`}
          </p>
        </div>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            register={register}
            defaultValue={team.bet}
            disabled={isBetPlaced}
            type="number"
            label="Bet"
            name="bet"
            onChange={() => {
              if (errMessage) {
                setErrMessage("");
              }
            }}
            error={errors?.bet?.message || errMessage}
            id="bet"
            step="0.01"
          />
          <Button
            type="submit"
            disabled={isBetPlaced}
            loading={isSubmitting}
          >
            Bet
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
