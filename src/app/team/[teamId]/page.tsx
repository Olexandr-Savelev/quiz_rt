"use client";

import React, { useEffect, useState } from "react";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import Team from "@/types/team";
import Input from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { betSchema } from "@/lib/zod/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pusherClient } from "@/lib/pusher/pusher";
import Button from "@/components/ui/button";

type BetFormData = z.infer<typeof betSchema>;

const Page = ({ params }: { params: { teamId: string } }) => {
  const [isBetPlaced, setIsBetPlaced] = useState<boolean>(false);
  const [team, setTeam] = useState<Team | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(betSchema),
    mode: "all",
    defaultValues: {
      bet: 0,
    },
  });

  useEffect(() => {
    getTeam(params.teamId);

    const channel = pusherClient.subscribe("channel");

    channel.bind("roundEnds", () => {
      getTeam(params.teamId);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  async function getTeam(teamId: string) {
    const res = await fetch(`/api/team/${teamId}`);
    const data = await res.json();

    const team = data.team;

    setTeam(team);
    team.bet !== 0 ? setIsBetPlaced(true) : setIsBetPlaced(false);
  }

  async function onSubmit(data: BetFormData) {
    const teamPoints = team!.points - data.bet;
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
    <div className="w-full p-4 sm:py-4">
      <div className="w-full max-w-full min-h-[75vh] rounded shadow-lg shadow-gray-800 px-6 py-10 flex flex-col justify-center border border-gray-900">
        <h2 className="w-full text-4xl text-center mb-4 font-bold">
          {team.name}
        </h2>
        <p className="w-full text-3xl text-center text-gray-300 mb-4">
          Points: {team.points}
        </p>
        <div className="flex items-center my-6 w-full grow">
          <p className="text-4xl text-gray-400 w-full text-center">
            {!isBetPlaced ? "Place Your Bet" : `Your Bet: ${team.bet}`}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            defaultValue={team.bet}
            disabled={isBetPlaced}
            type="number"
            label="Bet"
            name="bet"
            id="bet"
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
