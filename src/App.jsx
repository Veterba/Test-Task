import { Navigate, Route, Routes } from 'react-router-dom'
import { QuizProvider } from './store/QuizProvider'
import BottomNav from './components/BottomNav'
import Home from './pages/home/Home'
import AiQuiz from './pages/ai/AiQuiz'
import Play from './pages/play/Play'
import Finish from './pages/finish/Finish'

export default function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AiQuiz />} />
        <Route path="/play/:quizId" element={<Play />} />
        <Route path="/finish/:quizId" element={<Finish />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </QuizProvider>
  )
}
