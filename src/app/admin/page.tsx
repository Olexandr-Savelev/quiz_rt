"use client";

import { pusherClient } from "@/lib/pusher";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe("channel");

    channel.bind("addTeam", (res: { team: string }) => {
      console.log(`MESSAGE: ${res.team}`);
      setTeams((prev) => [...prev, res.team]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);
  return (
    <div>
      <h2>ADMIN PAGE </h2>
      <div>{teams}</div>
    </div>
  );
};

export default Page;
