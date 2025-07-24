"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Star, Smile, Meh, Frown } from "lucide-react"
import Link from "next/link"

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0)
  const [highlights, setHighlights] = useState<string[]>([])
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const ratingEmojis = [
    { icon: Frown, label: "Disappointing", color: "text-red-500" },
    { icon: Meh, label: "Okay", color: "text-yellow-500" },
    { icon: Smile, label: "Good", color: "text-green-500" },
    { icon: Heart, label: "Amazing", color: "text-pink-500" },
    { icon: Star, label: "Perfect", color: "text-purple-500" },
  ]

  const highlightOptions = [
    "Great location choice",
    "Perfect timing",
    "Loved the activities",
    "Outfit suggestions were spot-on",
    "Conversation starters helped",
    "Budget was just right",
    "Easy to follow timeline",
    "Romantic atmosphere",
  ]

  const toggleHighlight = (highlight: string) => {
    setHighlights((prev) => (prev.includes(highlight) ? prev.filter((h) => h !== highlight) : [...prev, highlight]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 flex items-center justify-center p-4">
        <Card className="glass-effect border-pink-200 shadow-2xl max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <Heart className="text-pink-500 mx-auto animate-pulse" size={64} />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-4">Thank You! 💕</h1>
            <p className="text-gray-600 mb-6">
              Your feedback helps us create even more magical dates for you and others!
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                Plan Another Date
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">How Was Your Date? ✨</h1>
          <p className="text-gray-600">Help us make your next date even more perfect!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <Card className="glass-effect border-pink-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-gray-800">Overall Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                {ratingEmojis.map((emoji, index) => {
                  const IconComponent = emoji.icon
                  const isSelected = rating === index + 1
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index + 1)}
                      className={`p-4 rounded-full transition-all duration-300 ${
                        isSelected ? "bg-pink-100 scale-110 shadow-lg" : "hover:bg-gray-100 hover:scale-105"
                      }`}
                    >
                      <IconComponent size={32} className={isSelected ? emoji.color : "text-gray-400"} />
                    </button>
                  )
                })}
              </div>
              {rating > 0 && (
                <p className="text-center mt-4 text-gray-600 font-medium">{ratingEmojis[rating - 1].label}</p>
              )}
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card className="glass-effect border-pink-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800">What did you love most?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {highlightOptions.map((highlight, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleHighlight(highlight)}
                    className={`p-3 rounded-lg text-sm transition-all duration-300 ${
                      highlights.includes(highlight)
                        ? "bg-pink-500 text-white shadow-lg"
                        : "bg-white border border-pink-200 text-gray-700 hover:bg-pink-50"
                    }`}
                  >
                    {highlight}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Feedback */}
          <Card className="glass-effect border-pink-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800">Tell us more (optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What could we improve? Any special moments you'd like to share? Your feedback helps us create better experiences..."
                className="min-h-32 border-pink-200 focus:border-pink-400 focus:ring-pink-400 resize-none"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={rating === 0}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
            >
              Share Feedback 💕
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
