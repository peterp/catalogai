'use client'

import React, { useState } from 'react'

import { increment } from '../../counter'

export function Like() {
  const [counter, setCounter] = useState(0)
  return <button onClick={() => {
    increment()
    setCounter(counter + 1)}
  }>{counter} +</button>
}
