"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, RotateCcw } from "lucide-react"

type Question = {
  question: string
  options: string[]
  correctAnswer: number
  category: string
  explanation: string
}

// All available questions from Greener Davis Game
const allQuestions: Question[] = [
  // Stormwater
  {
    question: "What should you do if you accidentally drop trash on the ground?",
    options: ["Pick it up right away", "Walk away and leave it", "Try to remember to come back and pick it up later"],
    correctAnswer: 0,
    category: "Stormwater",
    explanation: "Always pick up litter immediately. Every piece of litter is important.",
  },
  {
    question: "After you put something in your outdoor trash bin, what should you do?",
    options: ["Make sure the trash bin lid closes completely", "Leave the lid open"],
    correctAnswer: 0,
    category: "Stormwater",
    explanation: "Leaving the lid open could cause wind to blow the trash away and cause litter. Always keep the lids to outdoor trash bins closed.",
  },
  // Water Conservation
  {
    question: "What should you do if you find a leaky faucet?",
    options: ["Tell someone so it can get repaired", "Ignore it. It's just a little drip."],
    correctAnswer: 0,
    category: "Water Conservation",
    explanation: "Water is precious and every drop counts.",
  },
  {
    question: "What is the best time to water your yard?",
    options: ["Early morning or at night", "Noon", "Anytime", "Afternoon"],
    correctAnswer: 0,
    category: "Water Conservation",
    explanation: "Watering during the early morning or at night prevents water from being lost due to evaporation during the warmer and sunnier parts of the day.",
  },
  // Recycling
  {
    question: "What should you do with a large empty cardboard box?",
    options: [
      "Flatten it and place it on the ground next to the recycling cart",
      "Stuff it in the recycling cart",
      "Throw it in the trash",
    ],
    correctAnswer: 0,
    category: "Recycling",
    explanation: "Empty and flattened cardboard boxes can be recycled if they are placed on the ground for collection.",
  },
  {
    question: "What should you do with an apple core?",
    options: ["Place it in the organics bin", "Place it in the trash", "It doesn't matter which bin you put it in"],
    correctAnswer: 0,
    category: "Recycling",
    explanation: "Always place food scraps in the organics bin so they can be turned into compost.",
  },
  {
    question: "Which statement is true about recyclables?",
    options: [
      "Don't bag recyclables – place recyclables loose in the recycling cart",
      "It's ok to put bagged recyclables in your recycling cart",
    ],
    correctAnswer: 0,
    category: "Recycling",
    explanation: "Recyclables should never be in a plastic bag. If you collect your recyclables in a bag, empty the bag into the recycling cart, then put the bag in the trash.",
  },
  // IPM (Integrated Pest Management)
  {
    question: "Which statement is true about insects?",
    options: ["Not all insects are bad – many are helpful", "All insects are harmful to your garden"],
    correctAnswer: 0,
    category: "IPM",
    explanation: "There are many insects that are helpful partners in your garden.",
  },
  {
    question: "If you have a fruit tree at home, what should you do?",
    options: ["Pick up fallen fruit to prevent pests", "Leave the fruit on the ground, it won't matter"],
    correctAnswer: 0,
    category: "IPM",
    explanation: "Picking up fallen fruit helps discourage pests from coming into your yard. Leaving fallen fruit on the ground can attract pests like wasps and rats.",
  },
  // Pretreatment
  {
    question: "What should you do with extra oils and grease after cooking?",
    options: [
      "Wipe up small amounts with paper towels and place them in the organics bin",
      "Pour oils and grease down the drain",
    ],
    correctAnswer: 0,
    category: "Pretreatment",
    explanation: "Never pour grease or oil down the drain, it will clog your sewer pipes.",
  },
  {
    question: "Is it OK to flush wipes down the toilet?",
    options: ["No", "Yes, wipes are ok to flush"],
    correctAnswer: 0,
    category: "Pretreatment",
    explanation: "The toilet is not a trash can. Wipes clog pipes. Only flush poo, pee and toilet paper.",
  },
  // Wildlife
  {
    question: "Is it ok to feed ducks and geese at a pond?",
    options: ["No", "Yes, especially if they look hungry"],
    correctAnswer: 0,
    category: "Wildlife",
    explanation: "Never feed wild animals, it does more harm than good. Wild animals are capable of finding their own food.",
  },
  // Water Quality
  {
    question: "What's the better environmental choice?",
    options: ["Drink tap water instead of buying bottled water", "Always buy bottled water"],
    correctAnswer: 0,
    category: "Water Quality",
    explanation: "Davis tap water meets all State and Federal drinking water standards. Buying bottled water increases plastic waste, plus there's the environmental footprint of producing and shipping bottled water.",
  },
]

// Fisher-Yates shuffle algorithm to randomize questions
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Select 8 random questions ensuring category diversity
function selectQuestions(): Question[] {
  const shuffled = shuffleArray(allQuestions)
  const selected: Question[] = []
  const categoryCounts: { [key: string]: number } = {}

  // Try to get diverse categories
  for (const question of shuffled) {
    const count = categoryCounts[question.category] || 0
    // Limit each category to max 3 questions to ensure diversity
    if (count < 3 && selected.length < 8) {
      selected.push(question)
      categoryCounts[question.category] = count + 1
    }
  }

  // If we need more questions to reach 8, add remaining ones
  for (const question of shuffled) {
    if (selected.length >= 8) break
    if (!selected.includes(question)) {
      selected.push(question)
    }
  }

  return selected
}

// Generate random lily pad positions that progress left to right
function generateLilyPadPositions(): Array<{ left: number; top: number }> {
  const positions: Array<{ left: number; top: number }> = []
  
  for (let i = 0; i < 8; i++) {
    const progress = i / 7
    // Add randomness to horizontal position but keep general left-to-right progression
    const baseLeft = 5 + progress * 90
    const leftVariation = (Math.random() - 0.5) * 8 // +/- 4% variation
    const left = Math.max(5, Math.min(95, baseLeft + leftVariation))
    
    // Randomize vertical position within safe bounds
    const top = 25 + Math.random() * 50 // Random between 25% and 75%
    
    positions.push({ left, top })
  }
  
  return positions
}

export default function FrogGame() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lilyPadPositions, setLilyPadPositions] = useState<Array<{ left: number; top: number }>>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null)
  const [isJumping, setIsJumping] = useState(false)
  const [isFalling, setIsFalling] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Generate both questions and lily pad positions only on client side to avoid hydration mismatch
  useEffect(() => {
    setQuestions(selectQuestions())
    setLilyPadPositions(generateLilyPadPositions())
  }, [])

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback || questions.length === 0) return

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
    // Note: questions remain the same for this game session
    // To get new random questions, the component would need to be remounted
  }

  // Show loading state while questions are being generated
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex items-center justify-center p-4">
        <div className="text-2xl font-bold text-primary">Loading game...</div>
      </div>
    )
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center space-y-6 bg-white/95 backdrop-blur">
          <div className="flex justify-center">
            <Trophy className="w-24 h-24 text-accent animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Congratulations! 🎉</h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">Professor Davis crossed the river!</p>
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
            Professor Davis's River Adventure
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">
            Help Professor Davis cross the river by answering questions!
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

                    // Use randomized positions if available, otherwise use default positions
                    const position = lilyPadPositions[index] || {
                      left: 5 + (index / 7) * 90,
                      top: 50,
                    }
                    const { left: leftPosition, top: topPosition } = position

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
          <Card className="p-6 md:p-8 bg-white/95 backdrop-blur h-[400px] md:h-[500px] flex flex-col">
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-3 flex-wrap">
                  <div className="inline-block px-3 py-1.5 bg-secondary/20 rounded-full">
                    <span className="text-xs md:text-sm font-semibold text-secondary-foreground">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                  <div className="inline-block px-3 py-1.5 bg-accent/30 rounded-full">
                    <span className="text-xs md:text-sm font-semibold text-accent-foreground">
                      {questions[currentQuestion].category}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight break-words">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="grid gap-2.5">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback !== null}
                    size="lg"
                    variant={
                      selectedAnswer === index ? (showFeedback === "correct" ? "default" : "destructive") : "outline"
                    }
                    className={`text-sm md:text-base py-4 md:py-6 transition-all whitespace-normal h-auto min-h-[3rem] text-left ${
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
                  className={`text-center p-3 rounded-lg animate-in fade-in slide-in-from-bottom-4 ${
                    showFeedback === "correct" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  <p className="font-semibold text-base md:text-lg mb-1.5">
                    {showFeedback === "correct"
                      ? "🎉 Great job! Professor Davis jumps forward!"
                      : "💦 Oops! Try again - Professor Davis fell in the water!"}
                  </p>
                  <p className="text-xs md:text-sm opacity-90 leading-relaxed break-words">
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
