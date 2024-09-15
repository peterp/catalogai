let COUNT = 0

export async function increment() {
  COUNT += 1
  console.log('increment', COUNT)
  return COUNT
}

export async function decrement() {
  COUNT -= 1
  console.log('decrement', COUNT)
  return COUNT
}

export async function getCount() {
  return COUNT
}