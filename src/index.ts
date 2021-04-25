import { getInput, setOutput } from '@actions/core'
import github from '@actions/github'
// import Badge from './util/badge'

// const inputs: Badge[] = []

for (let i = 1; i <= 10; i++) {
  const index = i < 10 ? `0${i}` : i
  const input = getInput(`badge-${index}`)

  if (input) {
    // inputs.push(Badge.fromString(input))
    console.log(input)
  }
}

console.log(JSON.stringify(github))