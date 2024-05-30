"use client";

import { useState } from "react";

export default function Home() {
  const [teamName, setTeamName] = useState("");
  const [points, setPoints] = useState(0);

  const onBtnClick = async () => {
    if (teamName) {
      await fetch("/api/add-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Math.random(),
          name: teamName,
          points: points,
          bet: 0,
        }),
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <label htmlFor="teamName">Team name:</label>
      <input
        id="teamName"
        className="border border-black"
        value={teamName}
        onChange={({ target }) => setTeamName(target.value)}
      />
      <label htmlFor="teamName">Points:</label>
      <input
        type="number"
        id="points"
        className="border border-black"
        value={points}
        onChange={({ target }) => setPoints(+target.value)}
      />
      <button onClick={onBtnClick}>Send</button>
    </div>
  );
}
