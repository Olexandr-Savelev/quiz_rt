"use client";

import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const onBtnClick = async () => {
    if (input) {
      await fetch("/api/add-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team: input }),
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <label htmlFor="team-input">Type a new message:</label>
      <input
        id="team-input"
        className="border border-black"
        value={input}
        onChange={({ target }) => setInput(target.value)}
      />
      <button onClick={onBtnClick}>Send</button>
    </div>
  );
}
