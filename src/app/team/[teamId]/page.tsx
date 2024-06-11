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

async function getTeam(teamId: string) {
  const res = await fetch(`/api/team/${teamId}`);
  const data = await res.json();
  return data.team;
}

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
    getTeam(params.teamId).then((team) => {
      setTeam(team);
      team.bet !== 0 ? setIsBetPlaced(true) : setIsBetPlaced(false);
    });

    const channel = pusherClient.subscribe("channel");

    channel.bind("roundEnds", () => {
      getTeam(params.teamId).then((team) => {
        setTeam(team);
        team.bet !== 0 ? setIsBetPlaced(true) : setIsBetPlaced(false);
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  if (!team) return <LoadingSpinner />;

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

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:py-6 md:p-24">
      <div className="w-full max-w-full md:max-w-2xl md:min-h-[75vh] rounded shadow-lg px-6 py-10 md:py-12 flex flex-col justify-center">
        <h2 className="w-full text-4xl text-center text-gray-600 mb-4">
          {team.name}
        </h2>
        <p className="w-full text-3xl text-center text-gray-600 mb-4">
          Points: {team.points}
        </p>
        <div className="flex items-center my-6 h-60  w-full">
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
