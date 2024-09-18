import { sendReloadEvent } from "../../../../../envs/live"

let MESSAGES: string[] = ['Pong?']

export function getMessages() {
  return MESSAGES
}

export async function addMessage(m: string) {
  
  MESSAGES.push(m)
  sendReloadEvent()
}

