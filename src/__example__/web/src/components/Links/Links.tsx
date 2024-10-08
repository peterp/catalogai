import React from 'react'
import { Link } from './Link'

export function Links() {
  return (
    <ol>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/test-1">Test 1</Link>
      </li>
      <li>
        <Link href="/test-2">Ping? Pong!</Link>
      </li>
      <li>
        <Link href="/test-upload">Test Upload</Link>
      </li>
    </ol>
  )
}
