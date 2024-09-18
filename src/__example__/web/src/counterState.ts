import { sendReloadEvent } from "../../../envs/live"

let COUNT = 0

export async function increment() {
  COUNT += 1
  console.log('increment', COUNT)

  sendReloadEvent()
  return COUNT
}

export async function decrement() {
  COUNT -= 1
  console.log('decrement', COUNT)
  sendReloadEvent()
  return COUNT
}

export async function getCount() {
  return COUNT
}