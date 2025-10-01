"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, RotateCcw } from "lucide-react"

type Question = {
  question: string
  options: string[]
  correctAnswer: number
}

const questions: Question[] = [
  {
    question: "What percentage of Earth's surface is covered by water?",
    options: ["50%", "60%", "71%", "80%"],
    correctAnswer: 2,
  },
  {
    question: "How long should you turn off the tap while brushing your teeth to save water?",
    options: ["Don't turn it off", "Only when done", "While brushing", "Just at the start"],
    correctAnswer: 2,
  },
  {
    question: "Which of these uses the most water at home?",
    options: ["Washing dishes", "Taking a shower", "Flushing the toilet", "Watering plants"],
    correctAnswer: 1,
  },
  {
    question: "What is the best way to water your garden?",
    options: ["Midday sun", "Early morning", "Anytime", "Late afternoon"],
    correctAnswer: 1,
  },
  {
    question: "How much of Earth's water is fresh water we can drink?",
    options: ["50%", "25%", "10%", "Less than 3%"],
    correctAnswer: 3,
  },
  {
    question: "Which animal needs clean water to survive, just like us?",
    options: ["Only fish", "Only frogs", "All animals", "Only birds"],
    correctAnswer: 2,
  },
  {
    question: "What happens when we pollute rivers and lakes?",
    options: ["Nothing changes", "Water gets cleaner", "Animals and plants suffer", "Water tastes better"],
    correctAnswer: 2,
  },
  {
    question: "How can you help save water when washing your hands?",
    options: ["Use hot water only", "Keep tap running", "Turn off while soaping", "Use more soap"],
    correctAnswer: 2,
  },
]

export default function FrogGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null)
  const [isJumping, setIsJumping] = useState(false)
  const [isFalling, setIsFalling] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return

    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer

    if (isCorrect) {
      setShowFeedback("correct")
      setIsJumping(true)
      setScore(score + 1)

      setTimeout(() => {
        setIsJumping(false)
        setShowFeedback(null)
        setSelectedAnswer(null)

        if (currentQuestion + 1 >= questions.length) {
          setGameComplete(true)
        } else {
          setCurrentQuestion(currentQuestion + 1)
        }
      }, 1500)
    } else {
      setShowFeedback("wrong")
      setIsFalling(true)

      setTimeout(() => {
        setIsFalling(false)
        setShowFeedback(null)
        setSelectedAnswer(null)
      }, 1500)
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowFeedback(null)
    setIsJumping(false)
    setIsFalling(false)
    setGameComplete(false)
    setSelectedAnswer(null)
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6 bg-white/95 backdrop-blur">
          <div className="flex justify-center">
            <Trophy className="w-24 h-24 text-accent animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Congratulations! 🎉</h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">Professor Dave crossed the river!</p>
          <p className="text-xl text-muted-foreground">
            You answered <span className="font-bold text-primary">{score}</span> out of{" "}
            <span className="font-bold">{questions.length}</span> questions correctly!
          </p>
          <p className="text-lg text-foreground/80 italic">
            🌊 You're now a Water Conservation Champion! Keep protecting our precious water! 💧
          </p>
          <Button onClick={resetGame} size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 text-balance">
            Professor Dave's River Adventure
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">
            Help Professor Dave cross the river by answering questions!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">Progress</span>
            <span className="text-sm font-semibold text-foreground">
              {score} / {questions.length}
            </span>
          </div>
          <div className="h-4 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* River Visualization */}
          <Card className="p-6 bg-sky-200 border-4 border-primary/20 overflow-hidden">
            <div className="relative h-[400px] md:h-[500px]">
              {/* Left Riverbank with grass and trees */}
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-green-700 to-green-600 rounded-l-lg border-r-4 border-green-800">
                <div className="absolute inset-0 flex flex-col justify-around items-center py-4">
                  <span className="text-2xl">🌳</span>
                  <span className="text-2xl">🌲</span>
                  <span className="text-2xl">🌳</span>
                  <span className="text-xl">🌿</span>
                </div>
              </div>

              {/* Right Riverbank with grass and trees */}
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-l from-green-700 to-green-600 rounded-r-lg border-l-4 border-green-800">
                <div className="absolute inset-0 flex flex-col justify-around items-center py-4">
                  <span className="text-2xl">🌳</span>
                  <span className="text-xl">🌿</span>
                  <span className="text-2xl">🌲</span>
                  <span className="text-2xl">🌳</span>
                </div>
              </div>

              <div className="absolute left-16 md:left-20 right-16 md:right-20 top-0 bottom-0 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
                {/* Water waves animation */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-6 bg-white/20 animate-pulse rounded-full"
                      style={{
                        top: `${i * 15}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: "2s",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute left-16 md:left-20 right-16 md:right-20 top-0 bottom-0 flex items-center">
                <div className="w-full relative h-full py-12">
                  {[...Array(8)].map((_, index) => {
                    const isPassed = index < score
                    const isCurrent = index === score
                    const isNext = index === score + 1

                    const progress = index / 7
                    const leftPosition = 5 + progress * 90 // Spread from 5% to 95% for maximum spacing

                    // Create more dramatic vertical variation with different patterns
                    const waveOffset = Math.sin(progress * Math.PI * 2) * 35 // Increased amplitude
                    const zigzagOffset = (index % 2 === 0 ? 1 : -1) * 15 // Add zigzag pattern
                    const topPosition = 50 + waveOffset + zigzagOffset

                    return (
                      <div
                        key={index}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: `${leftPosition}%`,
                          top: `${topPosition}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {/* Lily Pad */}
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
                            isPassed
                              ? "bg-green-400/60 scale-90"
                              : isCurrent || isNext
                                ? "bg-green-500 scale-100 shadow-lg ring-4 ring-green-300/50"
                                : "bg-green-500/80 scale-95"
                          }`}
                        >
                          <div className="absolute inset-0 rounded-full border-2 border-green-600/30" />
                          <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-green-600/20 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                          <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-green-600/20 -translate-x-1/2 -translate-y-1/2 -rotate-45" />

                          {/* Frog */}
                          {isCurrent && (
                            <div
                              className={`absolute inset-0 flex items-center justify-center text-2xl md:text-3xl transition-all duration-500 ${
                                isJumping
                                  ? "animate-bounce scale-125"
                                  : isFalling
                                    ? "animate-pulse scale-75 opacity-50"
                                    : ""
                              }`}
                            >
                              🐸
                            </div>
                          )}

                          {/* Start Flag */}
                          {index === 0 && (
                            <div className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 text-xl md:text-2xl">
                              🏠
                            </div>
                          )}

                          {/* Goal Flag */}
                          {index === 7 && (
                            <div className="absolute -right-6 md:-right-8 top-1/2 -translate-y-1/2 text-xl md:text-2xl">
                              🏁
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Question Card */}
          <Card className="p-6 md:p-8 bg-white/95 backdrop-blur">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-secondary/20 rounded-full mb-4">
                  <span className="text-sm font-semibold text-secondary-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="grid gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback !== null}
                    size="lg"
                    variant={
                      selectedAnswer === index ? (showFeedback === "correct" ? "default" : "destructive") : "outline"
                    }
                    className={`text-lg py-6 transition-all ${
                      selectedAnswer === index && showFeedback === "correct"
                        ? "bg-primary hover:bg-primary/90 scale-105"
                        : selectedAnswer === index && showFeedback === "wrong"
                          ? "bg-destructive hover:bg-destructive/90 scale-95"
                          : "hover:scale-105 hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Feedback Messages */}
              {showFeedback && (
                <div
                  className={`text-center p-4 rounded-lg font-semibold text-lg animate-in fade-in slide-in-from-bottom-4 ${
                    showFeedback === "correct" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {showFeedback === "correct"
                    ? "🎉 Great job! Professor Dave jumps forward!"
                    : "💦 Oops! Try again - Professor Dave fell in the water!"}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
