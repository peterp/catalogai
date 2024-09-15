"use client";

import React from "react";

import { increment, decrement,  } from "../../counter";

export function Like() {

  return (
    <>
      <button
        onClick={() => {
          increment();
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          decrement();
        }}
      >
        -
      </button>
    </>
  );
}
