"use client";

import React, { useState } from "react";
import { addMessage } from "./message";

export function AddMessage() {
  const [newMessage, setNewMessage] = useState("test");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <div>
      <input type="text" />
      <button onClick={() => addMessage("Ping!")}>Ping</button>
    </div>
  );
}
