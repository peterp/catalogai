
import React from 'react'

import { Links } from '../../components/Links/Links.jsx'
import { AddMessage } from './AddMessage.js'
import { getMessages } from './messageState.js'



export default function Test2Page() {
  return (
    <div>
      <h1>Chat</h1>
      <Links />

      <ol>
        {getMessages().map((message, index) => {
          return <li key={'message-' + index}>{message}</li>
        })}
      </ol>
      <AddMessage />
    </div>
  )
}
