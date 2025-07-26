"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Heart, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const questions = [
  {
    id: 1,
    question: "What's your relationship status?",
    type: "radio",
    options: ["Single", "In a relationship", "It's complicated", "Prefer not to say"],
  },
  {
    id: 2,
    question: "What's your ideal date budget?",
    type: "radio",
    options: ["Under $50", "$50-$100", "$100-$200", "$200+", "Money is no object"],
  },
  {
    id: 3,
    question: "What time of day do you prefer for dates?",
    type: "radio",
    options: ["Morning (8AM-12PM)", "Afternoon (12PM-5PM)", "Evening (5PM-9PM)", "Late night (9PM+)"],
  },
  {
    id: 4,
    question: "What type of activities do you enjoy most?",
    type: "radio",
    options: ["Outdoor adventures", "Cultural experiences", "Food & drinks", "Entertainment", "Relaxing activities"],
  },
  {
    id: 5,
    question: "How would you describe your personality?",
    type: "radio",
    options: ["Outgoing & social", "Quiet & intimate", "Adventurous & spontaneous", "Thoughtful & planned"],
  },
  {
    id: 6,
    question: "What's your location or preferred area?",
    type: "text",
    placeholder: "Enter your city or preferred location...",
  },
  {
    id: 7,
    question: "Tell us about your interests and hobbies",
    type: "text",
    placeholder: "What do you love doing in your free time?",
  },
  {
    id: 8,
    question: "Any specific preferences or things to avoid?",
    type: "text",
    placeholder: "Dietary restrictions, accessibility needs, dislikes, etc.",
  },
]

import { useAuth } from "@/lib/useAuth"

export default function FormPage() {
  useAuth(); // Redirects to /auth if not logged in
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([])

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const createFloatingHeart = (e: React.MouseEvent) => {
    const newHeart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    }
    setFloatingHearts((prev) => [...prev, newHeart])

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
    }, 2000)
  }



  const currentQ = questions[currentQuestion]
  const hasAnswer = answers[currentQ.id]
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-rose-300 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <Heart className="text-pink-400" size={20} />
          </div>
        ))}
      </div>

      {/* Floating hearts from interactions */}
      {/* {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: heart.x - 10,
            top: heart.y - 10,
            animation: "floatUp 2s ease-out forwards",
          }}
        >
          💕
        </div>
      ))} */}

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 bg-white/10">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-pink-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>

        <Card className="glass-effect bg-white/60 border-pink-50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-rose-500/5" />

          <CardHeader className="text-center relative z-10">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{currentQ.question}</CardTitle>
            <div className="flex justify-center">
              <Heart className="text-pink-500 animate-pulse" size={24} />
            </div>
          </CardHeader>

          <CardContent className="relative z-10" onMouseMove={createFloatingHeart}>
            {currentQ.type === "radio" ? (
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
                className="space-y-4"
              >
                {currentQ.options?.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="text-pink-500" />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder}
                className="min-h-32 border-pink-300 focus:border-pink-400 focus:ring-pink-400 resize-none"
              />
            )}

            <div className="flex justify-between mt-8">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50 disabled:opacity-50 bg-transparent"
              >
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Link href="/results">
                  <Button
                    disabled={!hasAnswer}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white disabled:opacity-50"
                  >
                    Create My Date Plan 💕
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!hasAnswer}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white disabled:opacity-50"
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
