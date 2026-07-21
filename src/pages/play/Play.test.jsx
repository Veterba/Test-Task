import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

const RAW = Array.from({ length: 5 }, (_, i) => ({
  type: 'multiple',
  difficulty: 'easy',
  category: 'General',
  question: `Q${i}`,
  correct_answer: 'Right',
  incorrect_answers: ['Wrong A', 'Wrong B', 'Wrong C'],
}))

vi.mock('../../api/opentdb', () => ({
  fetchQuestions: vi.fn(() => Promise.resolve(RAW)),
}))

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('Play page', () => {
  it('reveals the correct answer and locks after choosing', async () => {
    const user = userEvent.setup()
    renderAt('/play/quiz-1')

    const wrong = await screen.findByRole('button', { name: 'Wrong A' })
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()

    await user.click(wrong)

    expect(screen.getByRole('button', { name: 'Right' }).className).toContain(
      'bg-accent-500/15',
    )
    expect(screen.getByRole('button', { name: 'Wrong A' }).className).toContain(
      'bg-red-100',
    )
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Wrong B' })).toBeDisabled()
  })

  it('plays through every question and reaches Finish', async () => {
    const user = userEvent.setup()
    renderAt('/play/quiz-1')

    for (let i = 0; i < 5; i++) {
      const right = await screen.findByRole('button', { name: 'Right' })
      await user.click(right)
      await user.click(
        screen.getByRole('button', { name: i === 4 ? 'Finish' : 'Next' }),
      )
    }

    expect(await screen.findByText(/Quiz complete/i)).toBeInTheDocument()
  })

  it('cancels back to Home', async () => {
    const user = userEvent.setup()
    renderAt('/play/quiz-1')

    await screen.findByRole('button', { name: 'Right' })
    await user.click(screen.getByRole('button', { name: 'Cancel quiz' }))

    expect(await screen.findByText('Quiz Arcade')).toBeInTheDocument()
  })
})
