let COUNT = 0

export async function increment() {
  COUNT += 1
  return COUNT
}

export async function decrement() {
  COUNT -= 1
  return COUNT
}

export async function getCounter() {
  return COUNT
}