export const initialSession = {
  quizId: null,
  answers: [],
  index: 0,
  startedAt: null,
  finishedAt: null,
}

export function sessionReducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        quizId: action.quizId,
        answers: [],
        index: 0,
        startedAt: action.now,
        finishedAt: null,
      }
    case 'answer': {
      if (state.answers[state.index] != null) return state
      const answers = [...state.answers]
      answers[state.index] = action.answer
      return { ...state, answers }
    }
    case 'next':
      return { ...state, index: state.index + 1 }
    case 'finish':
      return { ...state, finishedAt: action.now }
    case 'reset':
      return initialSession
    default:
      return state
  }
}
