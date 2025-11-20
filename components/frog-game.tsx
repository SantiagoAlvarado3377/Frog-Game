"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
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

const QUESTION_TIME_SECONDS = 30

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

// Shuffle the options for a question and update correctAnswer index
function shuffleQuestionOptions(question: Question): Question {
  const indices = question.options.map((_, idx) => idx)
  const shuffledIndices = shuffleArray(indices)

  const shuffledOptions = shuffledIndices.map((i) => question.options[i])
  const newCorrectIndex = shuffledIndices.indexOf(question.correctAnswer)

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex,
  }
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

  return selected.map(shuffleQuestionOptions)
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
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | "timeout" | null>(null)
  const [isJumping, setIsJumping] = useState(false)
  const [isFalling, setIsFalling] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium')
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timerEnabled, setTimerEnabled] = useState(true)
  // Per-question lives and timer
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  // Reset timer for each new question
  useEffect(() => {
    setTimeLeft(QUESTION_TIME_SECONDS)
    setHasAnswered(false)
  }, [currentQuestion])

  // Timer countdown effect
  useEffect(() => {
    if (!timerEnabled || showFeedback || gameComplete || isPaused || hasAnswered) return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showFeedback, gameComplete, isPaused, timerEnabled, hasAnswered]);

  // Handle what happens when time runs out


  // Audio feedback functions
  const playSound = (type: 'correct' | 'incorrect' | 'jump' | 'complete') => {
    if (!audioEnabled) return
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    switch (type) {
      case 'correct':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
      case 'incorrect':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break
      case 'jump':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
        break
      case 'complete':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.15)
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.3)
        oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.45)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.6)
        break
    }
  }

  // Text-to-speech function
  const speak = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined') return
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Auto-speak question when speech is enabled
  useEffect(() => {
    if (speechEnabled && questions.length > 0 && !gameComplete) {
      const question = questions[score]
      if (question) {
        speak(`Question ${score + 1} of ${questions.length}. ${question.question}`)
      }
    }
    return () => stopSpeaking()
  }, [score, speechEnabled, questions, gameComplete])

  // Generate both questions and lily pad positions only on client side to avoid hydration mismatch
  useEffect(() => {
    setQuestions(selectQuestions())
    setLilyPadPositions(generateLilyPadPositions())
    
    // Check for user's reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Reset the timer whenever we go to a new question
  useEffect(() => {
    setTimeLeft(QUESTION_TIME_SECONDS)
  }, [currentQuestion])

  // Handle what happens when time runs out
  const handleTimeOut = () => {
    if (showFeedback || questions.length === 0 || hasAnswered || gameComplete) return
    setSelectedAnswer(null)
    setShowFeedback("timeout")
    setIsFalling(true)
    setHasAnswered(true)
    playSound("incorrect")
    setTimeout(() => {
      setIsFalling(false)
      setLives(prevLives => {
        const newLives = prevLives - 1
        // No lives left → end the game (show results screen)
        if (newLives <= 0) {
          setShowFeedback(null)
          setGameComplete(true)
          return 0
        }
        // Still have lives → stay on SAME question, reset timer
        setShowFeedback(null)
        setSelectedAnswer(null)
        setHasAnswered(false)
        setTimeLeft(QUESTION_TIME_SECONDS)
        return newLives
      })
    }, 1500)

  };
  
  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore keyboard input if game is complete or showing feedback
      if (gameComplete || showFeedback || questions.length === 0) return

      const currentQ = questions[currentQuestion]
      if (!currentQ) return

      const numOptions = currentQ.options.length

      // Handle number keys (1-9)
      if (event.key >= '1' && event.key <= '9') {
        const index = parseInt(event.key) - 1
        if (index < numOptions) {
          handleAnswer(index)
        }
      }
      // Handle arrow keys for navigation through options
      else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault() // Prevent page scroll
        // Just highlight - could be extended to select on Enter
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentQuestion, gameComplete, showFeedback, questions])

  // Announce changes to screen readers
  useEffect(() => {
    if (showFeedback && questions[currentQuestion]) {
      const message = showFeedback === "correct" 
        ? `Correct! ${questions[currentQuestion].explanation}`
        : `Incorrect. ${questions[currentQuestion].explanation}`
      
      // Create a live region announcement
      const announcement = document.createElement('div')
      announcement.setAttribute('role', 'status')
      announcement.setAttribute('aria-live', 'polite')
      announcement.className = 'sr-only'
      announcement.textContent = message
      document.body.appendChild(announcement)
      
      setTimeout(() => document.body.removeChild(announcement), 3000)
    }
  }, [showFeedback, currentQuestion, questions])

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback || questions.length === 0 || gameComplete || hasAnswered) return;
    setHasAnswered(true);
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setShowFeedback("correct");
      setIsJumping(true);
      setScore(score + 1);
      playSound('jump');
      setTimeout(() => {
        playSound('correct');
      }, 200);
      setTimeout(() => {
        setIsJumping(false);
        setShowFeedback(null);
        setSelectedAnswer(null);
        setHasAnswered(false);
        if (currentQuestion + 1 >= questions.length) {
          setGameComplete(true);
          playSound('complete');
        } else {
          setCurrentQuestion(currentQuestion + 1);
        }
      }, 1500);
     } else {
      setShowFeedback("wrong")
      setIsFalling(true)
      playSound("incorrect")

      setTimeout(() => {
        setIsFalling(false)

        setLives(prevLives => {
          const newLives = prevLives - 1

          // No lives left → end the game
          if (newLives <= 0) {
            setShowFeedback(null)
            setGameComplete(true)
            return 0
          }

          // Still have lives → stay on SAME question, reset timer
          setShowFeedback(null)
          setSelectedAnswer(null)
          setHasAnswered(false)
          setTimeLeft(QUESTION_TIME_SECONDS)
          return newLives
        })
      }, 1500);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowFeedback(null)
    setIsJumping(false)
    setIsFalling(false)
    setGameComplete(false)
    setSelectedAnswer(null)
    setLives(3)
    setTimeLeft(QUESTION_TIME_SECONDS)
    setHasAnswered(false)

    setQuestions(selectQuestions())
    setLilyPadPositions(generateLilyPadPositions())
  }


  // Welcome screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-300 to-lime-300 flex items-center justify-center p-4">
        <Card className="max-w-xl w-full p-10 text-center shadow-2xl border-4 border-blue-400/40 bg-white/90 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-40 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-200 rounded-full blur-2xl opacity-40 animate-pulse" />
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="frog-character-large mb-2 animate-bounce" style={{ fontSize: 64 }} />
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 drop-shadow mb-2 tracking-tight">
              Professor Davis River Adventure
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              Help Professor Davis cross the river by answering fun questions about water, recycling, and more!<br/>
              <span className="inline-block mt-2 text-base text-green-500 font-semibold">Can you get him safely across?</span>
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-800  text-white text-xl px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform"
              onClick={() => {
                resetGame();
                setShowWelcome(false);
              }}
              aria-label="Start the game"
            >
              🚀 Start Adventure
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // NEW: protect against questions not being loaded yet
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-sky-100">
        <p className="text-lg font-semibold text-sky-900">
          Loading questions…
        </p>
      </div>
    )
  }

  if (gameComplete) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-300 to-lime-300 flex items-center justify-center p-4 font-size-${fontSize} ${dyslexiaFont ? 'dyslexia-font' : ''}`}>
        <Card 
          className={`max-w-2xl w-full p-8 text-center space-y-6 backdrop-blur ${highContrast ? 'bg-white border-black border-4' : 'bg-white/95'}`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex justify-center gap-4 items-center">
            <div className={`frog-character-large ${reducedMotion ? '' : 'animate-bounce'}`}></div>
            <Trophy className={`w-24 h-24 text-accent ${reducedMotion ? '' : 'animate-bounce'}`} aria-hidden="true" />
            <div className={`frog-character-large ${reducedMotion ? '' : 'animate-bounce'}`}></div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold ${highContrast ? 'text-black' : 'text-primary'}`}>
            {lives === 0 ? 'Game Over' : 'Congratulations! 🎉'}
          </h1>
          <p className={`text-2xl md:text-3xl font-semibold ${highContrast ? 'text-black' : 'text-foreground'}`}>
            {lives === 0
              ? 'Professor Davis ran out of lives!'
              : 'Professor Davis crossed the river!'}
          </p>
          <p className={`text-xl ${highContrast ? 'text-black' : 'text-muted-foreground'}`}>
            You answered <span className={`font-bold ${highContrast ? 'text-black underline' : 'text-primary'}`}>{score}</span> out of{" "}
            <span className="font-bold">{questions.length}</span> questions correctly!
          </p>
          <p className={`text-lg italic ${highContrast ? 'text-black' : 'text-foreground/80'}`}>
            {lives === 0
              ? '💧 Try again to help Professor Davis cross the river!'
              : '🌊 You\'re now a Water Conservation Champion! Keep protecting our precious water! 💧'}
          </p>
          <div className="flex flex-col gap-4 items-center mt-4">
            <Button 
              onClick={resetGame} 
              size="lg" 
              className={`text-lg px-8 py-6 ${highContrast ? 'bg-black text-white border-4 hover:bg-gray-800' : 'bg-primary hover:bg-primary/90'}`}
              aria-label="Play the game again from the beginning"
            >
              <RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />
              Play Again
            </Button>
            <Button
              onClick={() => setShowWelcome(true)}
              size="sm"
              className="bg-gradient-to-r from-green-800 text-white text-xl px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform transition-all duration-300"
              aria-label="Back to Welcome Screen"
            >
              ⬅ Home Screen
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-300 to-lime-300 p-4 md:p-8 font-size-${fontSize} ${dyslexiaFont ? 'dyslexia-font' : ''}`}>
      {/* Pause Screen Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <div className="frog-character-large mb-4 animate-bounce" style={{ fontSize: 64 }} />
            <h2 className="text-2xl font-bold mb-2 text-green-700">Game Paused</h2>
            <p className="mb-4 text-gray-700">Take a break! When you're ready, resume your adventure.</p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
              onClick={() => setIsPaused(false)}
              aria-label="Resume game"
            >
              ▶ Resume
            </Button>
          </div>
        </div>
      )}
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to game content
      </a>
      <div className="max-w-6xl mx-auto" id="main-content">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
        
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-label={reducedMotion ? "Enable animations" : "Reduce motion"}
              title={reducedMotion ? "Enable animations" : "Reduce motion for accessibility"}
            >
              {reducedMotion ? "🐢 Animations" : "⚡ Reduce Motion"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHighContrast(!highContrast)}
              aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
              title={highContrast ? "Disable high contrast mode" : "Enable high contrast for better visibility"}
            >
              {highContrast ? "🎨 Normal" : "🔆 High Contrast"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDyslexiaFont(!dyslexiaFont)}
              aria-label={dyslexiaFont ? "Disable dyslexia font" : "Enable dyslexia-friendly font"}
              title="Toggle dyslexia-friendly font"
            >
              {dyslexiaFont ? "Aa Regular" : "Aa Dyslexia"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge']
                const currentIndex = sizes.indexOf(fontSize)
                const nextIndex = (currentIndex + 1) % sizes.length
                setFontSize(sizes[nextIndex])
              }}
              aria-label={`Current font size: ${fontSize}. Click to change`}
              title="Adjust font size"
            >
              Text: {fontSize === 'small' ? 'S' : fontSize === 'medium' ? 'M' : fontSize === 'large' ? 'L' : 'XL'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              aria-label={audioEnabled ? "Mute sounds" : "Enable sounds"}
              title="Toggle audio feedback"
            >
              {audioEnabled ? "🔊 Sound" : "🔇 Muted"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (speechEnabled) {
                  stopSpeaking()
                }
                setSpeechEnabled(!speechEnabled)
              }}
              aria-label={speechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
              title="Toggle text-to-speech"
            >
              {speechEnabled ? "🗣️ Speech On" : "💬 Speech Off"}
            </Button>
            {isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                aria-label="Stop speaking"
                title="Stop current speech"
              >
                ⏸️ Stop
              </Button>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 text-balance">
            Professor Davis's River Adventure
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">
            Help Professor Davis cross the river by answering questions!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8" role="region" aria-label="Game progress">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">Progress</span>
            <span className="text-sm font-semibold text-foreground" aria-live="polite">
              {score} / {questions.length}
            </span>
          </div>
          <div 
            className="h-4 bg-white/50 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-label={`Progress: ${score} out of ${questions.length} questions correct`}
          >
            <div
              className={`h-full bg-primary rounded-full ${reducedMotion ? '' : 'transition-all duration-500 ease-out'}`}
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* River Visualization */}
          <Card 
            className={`p-6 bg-sky-200 border-4 overflow-hidden relative h-[520px] md:h-[620px] ${highContrast ? 'border-black border-8' : 'border-primary/20'}`}
            role="img" 
            aria-label={`River crossing visualization. Professor Davis has crossed ${score} out of ${questions.length} lily pads.`}
          >
            <div className="relative h-full">
              {/* Left Riverbank with grass and trees */}
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-green-700 to-green-600 rounded-l-lg border-r-4 border-green-800">
                <div className="absolute inset-0 flex flex-col justify-around items-center py-4">
                  <div className={reducedMotion ? "" : "animate-bounce"} style={reducedMotion ? {} : { animationDelay: "0s", animationDuration: "3s" }}>
                    <div className="css-tree"></div>
                  </div>
                  <div className={reducedMotion ? "" : "animate-bounce"} style={reducedMotion ? {} : { animationDelay: "0.5s", animationDuration: "3.5s" }}>
                    <div className="css-tree"></div>
                  </div>
                  <div className={reducedMotion ? "" : "animate-bounce"} style={reducedMotion ? {} : { animationDelay: "1s", animationDuration: "4s" }}>
                    <div className="css-tree"></div>
                  </div>
                  <span className={reducedMotion ? "text-xl" : "text-xl animate-pulse"} style={reducedMotion ? {} : { animationDelay: "0.3s" }}>
                    🌿
                  </span>
                  <div className="absolute bottom-100 left-2 md:left-3">
                    <Image
                      src="./graphics 2[21]/ff_bush.png"
                      alt="Bush near the riverbank"
                      width={40}
                      height={44}
                      className={reducedMotion ? "drop-shadow" : "drop-shadow animate-pulse"}
                    />
                  </div>

                </div>
              </div>

              {/* Right Riverbank with grass and trees */}
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-l from-green-700 to-green-600 rounded-r-lg border-l-4 border-green-800">
                <div className="absolute inset-0 flex flex-col justify-around items-center py-4">
                  <div className="animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "3.2s" }}>
                    <div className="css-tree"></div>
                  </div>
                  <span className="text-xl animate-pulse" style={{ animationDelay: "0.8s" }}>
                    🌿
                  </span>
                  <div className="animate-bounce" style={{ animationDelay: "0.7s", animationDuration: "3.8s" }}>
                    <div className="css-tree"></div>
                  </div>
                  <div className="animate-bounce" style={{ animationDelay: "1.2s", animationDuration: "4.2s" }}>
                    <div className="css-tree"></div>
                  </div>
                  <div className="absolute bottom-35 md:right-4">
                    <Image
                      src="./graphics 2[21]/ff_bush.png"
                      alt="Bush near the riverbank"
                      width={40}
                      height={44}
                      className={reducedMotion ? "drop-shadow" : "drop-shadow animate-pulse"}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute left-16 md:left-20 right-16 md:right-20 top-0 bottom-0 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
                {/* Animated fish swimming */}
                <div className="absolute top-[20%] left-0" style={reducedMotion ? {} : { animation: "swim 8s linear infinite" }}>
                  <div className="css-fish"></div>
                </div>
                <div className="absolute top-[60%] left-0" style={reducedMotion ? {} : { animation: "swim 12s linear infinite", animationDelay: "2s" }}>
                  <div className="css-fish" style={{ transform: "scaleY(1.1)" }}></div>
                </div>
                <div className="absolute top-[40%] left-0" style={reducedMotion ? {} : { animation: "swim 10s linear infinite", animationDelay: "4s" }}>
                  <div className="css-fish" style={{ transform: "scale(0.9)" }}></div>
                </div>
                
                {/* Dragonflies hovering above water */}
                <div className="absolute top-[10%] left-[30%]" style={reducedMotion ? {} : { animation: "float 2.5s ease-in-out infinite" }}>
                  <div className="css-dragonfly"><span></span></div>
                </div>
                <div className="absolute top-[15%] right-[25%]" style={reducedMotion ? {} : { animation: "float 3s ease-in-out infinite", animationDelay: "0.5s" }}>
                  <div className="css-dragonfly"><span></span></div>
                </div>
                
                {/* Butterflies */}
                <div className="absolute top-[8%] left-[60%]" style={reducedMotion ? {} : { animation: "float 3.5s ease-in-out infinite", animationDelay: "1s" }}>
                  <div className="css-butterfly"><span></span></div>
                </div>
                
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
                          className={`css-lilypad transition-all duration-300 ${
                            isPassed
                              ? "opacity-60 scale-90"
                              : isCurrent || isNext
                                ? "scale-100 shadow-lg ring-4 ring-green-300/50"
                                : "opacity-80 scale-95"
                          }`}
                          style={{ animation: "float 3s ease-in-out infinite" }}
                        >
                          {/* Ripple effect around current lily pad */}
                          {isCurrent && (
                            <div
                              className="absolute inset-0 border-2 border-green-400/50"
                              style={{ 
                                animation: "ripple 2s ease-out infinite",
                                borderRadius: '50% 50% 50% 0'
                              }}
                            />
                          )}

                          {/* Frog */}
                          {isCurrent && (
                            <>
                              <div
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                                  isJumping
                                    ? "animate-bounce scale-125"
                                    : isFalling
                                      ? "animate-pulse scale-75 opacity-50"
                                      : ""
                                }`}
                              >
                                {/* Custom CSS Frog */}
                                <div className="frog-character"></div>
                              </div>
                              {/* Splash effect when falling */}
                              {isFalling && (
                                <>
                                  <div
                                    className="absolute inset-0 text-2xl flex items-center justify-center text-blue-300"
                                    style={{ animation: "splash 1s ease-out" }}
                                  >
                                    💦
                                  </div>
                                  <div
                                    className="absolute inset-0 text-xl flex items-center justify-center text-blue-200"
                                    style={{ animation: "splash 1s ease-out 0.1s" }}
                                  >
                                    💧
                                  </div>
                                </>
                              )}
                            </>
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
          <Card 
            className={`p-6 md:p-8 backdrop-blur h-[520px] md:h-[620px] flex flex-col ${highContrast ? 'bg-white border-black border-4' : 'bg-white/95'}`}
            role="region"
            aria-label="Question area"
          >
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-3 flex-wrap">
                  <div className={`inline-block px-3 py-1.5 rounded-full ${highContrast ? 'bg-black text-white' : 'bg-secondary/20'}`}>
                    <span className="text-xs md:text-sm font-semibold">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                  <div className={`inline-block px-3 py-1.5 rounded-full ${highContrast ? 'bg-yellow-400 text-black' : 'bg-accent/30'}`}>
                    <span className="text-xs md:text-sm font-semibold">
                      {questions[currentQuestion].category}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <h2 
                    className={`text-xl md:text-2xl lg:text-3xl font-bold leading-tight break-words flex-1 ${highContrast ? 'text-black' : 'text-foreground'}`}
                    id="current-question"
                    tabIndex={-1}
                  >
                    {questions[currentQuestion].question}
                  </h2>
                  {speechEnabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speak(`${questions[currentQuestion].question}. ${questions[currentQuestion].options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ')}`)}
                      aria-label="Read question aloud"
                      title="Read question and options"
                      disabled={isSpeaking}
                    >
                      🔊
                    </Button>
                  )}
                </div>
              </div>

              {/* Timer Bar, Lives, and Countdown, with toggle button */}
              <div className="flex items-center justify-center mb-2 gap-2">
                {/* Lives display */}
                <div className="flex items-center mr-3" aria-label="Lives left">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        "mx-0.5 text-xl transition-opacity " +
                        (i < lives
                          ? "text-green-600 opacity-100"
                          : "text-gray-400 opacity-20")
                      }
                      role="img"
                      aria-label={i < lives ? "remaining life" : "lost life"}
                    >
                      🐸
                    </span>
                  ))}
                </div>
                {timerEnabled && (
                  <>
                    <div className="w-full max-w-xs h-4 bg-gray-200 rounded-full overflow-hidden mr-3" aria-label="Time left">
                      <div
                        className={`h-full ${timeLeft > 5 ? 'bg-green-400' : 'bg-red-400'} transition-all duration-500`}
                        style={{ width: `${(timeLeft / QUESTION_TIME_SECONDS) * 100}%` }}
                      />
                    </div>
                    <span className={`font-mono text-lg ${timeLeft > 5 ? 'text-green-700' : 'text-red-600'} min-w-[2ch] text-center`} aria-live="polite">
                      {timeLeft}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">sec</span>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimerEnabled((prev) => !prev)}
                  aria-label={timerEnabled ? "Disable timer" : "Enable timer"}
                  title={timerEnabled ? "Turn timer off" : "Turn timer on"}
                >
                  {timerEnabled ? "⏱️ Timer On" : "⏸️ Timer Off"}
                </Button>
              </div>

              <div className="grid gap-2.5" role="group" aria-labelledby="current-question">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback !== null}
                    size="lg"
                    variant={
                      selectedAnswer === index ? (showFeedback === "correct" ? "default" : "destructive") : "outline"
                    }
                    className={`text-sm md:text-base py-4 md:py-6 whitespace-normal h-auto min-h-[3rem] text-left relative ${
                      reducedMotion ? '' : 'transition-all'
                    } ${
                      selectedAnswer === index && showFeedback === "correct"
                        ? `${highContrast ? 'bg-green-600 border-4 border-black' : 'bg-primary hover:bg-primary/90'} ${reducedMotion ? '' : 'scale-105'}`
                        : selectedAnswer === index && showFeedback === "wrong"
                          ? `${highContrast ? 'bg-red-600 border-4 border-black' : 'bg-destructive hover:bg-destructive/90'} ${reducedMotion ? '' : 'scale-95'}`
                          : `${highContrast ? 'border-2 border-black bg-white text-black' : ''} ${reducedMotion ? '' : 'hover:scale-105 hover:bg-accent hover:text-accent-foreground'}`
                    }`}
                    aria-label={`Option ${index + 1}: ${option}. Press ${index + 1} on your keyboard to select.`}
                    aria-pressed={selectedAnswer === index}
                  >
                    <span className={`absolute left-2 top-2 text-xs font-mono ${highContrast ? 'opacity-100 font-bold' : 'opacity-50'}`}>
                      {index + 1}
                    </span>
                    <span className="pl-6">{option}</span>
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

              {/* Keyboard Hint */}
              {!showFeedback && (
                <div className="text-center text-xs text-muted-foreground/70 mt-2">
                  💡 Tip: Press 1-{questions[currentQuestion].options.length} on your keyboard to select an answer
                </div>
              )}
            </div>
          </Card>
        </div>
              {/* Bottom controls: Pause + Home */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
        <Button
          size="lg"
          className="w-full md:w-auto px-8 rounded-full bg-gradient-to-r text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all"
          onClick={() => setShowWelcome(true)}
          aria-label="Back to home screen"
          title="Back to home screen"
        >
          🏠 Home Screen
        </Button>
        
        <Button
          size="lg"
          className="w-full md:w-auto px-8 rounded-full shadow-md hover:shadow-lg transition-all"
          variant="outline"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? "Resume game" : "Pause game"}
          title={isPaused ? "Resume game" : "Pause game"}
        >
          {isPaused ? "▶️ Resume" : "⏸️ Pause"} Game
        </Button>

        
      </div>

      </div>
    </div>
  )
}
