'use server'


let counter = 0

export async function increment() {
  counter += 1
  console.log(counter)
  return counter
}