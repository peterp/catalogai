import React from 'react'

import { Like } from '../../components/Like/Like.jsx'
import { Links } from '../../components/Links/Links.jsx'
import { getCounter } from '../../counterState.js'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      counter state: {getCounter()}
      <Links />
      <Like />
    </div>
  )
}
