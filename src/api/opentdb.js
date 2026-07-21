const API_URL = 'https://opentdb.com/api.php'

const RESPONSE_MESSAGES = {
  1: 'Not enough questions available for this request.',
  2: 'Invalid request to the trivia API.',
  3: 'Session token not found.',
  4: 'All questions for this category have been exhausted.',
  5: 'Too many requests — please wait a moment and try again.',
}

/**
 * Fetch trivia questions from the Open Trivia DB.
 * Throws a descriptive Error on network failure or a non-zero response code.
 */
export async function fetchQuestions(amount = 50) {
  const res = await fetch(`${API_URL}?amount=${amount}`)
  if (!res.ok) {
    throw new Error(`Failed to reach the trivia API (HTTP ${res.status}).`)
  }
  const data = await res.json()
  if (data.response_code !== 0 || !data.results?.length) {
    throw new Error(
      RESPONSE_MESSAGES[data.response_code] ?? 'Could not load questions.',
    )
  }
  return data.results
}
