"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/app/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card"
import { RadioGroup, RadioGroupItem } from "@/app/ui/radio-group"
import { Label } from "@/app/ui/label"
import { Textarea } from "@/app/ui/textarea"
import { Progress } from "@/app/ui/progress"
import { Heart, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

import { useRouter } from "next/navigation"



const questions = [
  {
    id: 1,
    question: "What's your current mood?",
    type: "radio",
    options: ["Romantic", "Adventurous", "Relaxed", "Playful"],
  },
  {
    id: 2,
    question: "What's your ideal date budget?",
    type: "text",
    placeholder: "₹‎ 1000 - ₹‎ 10000",
  },
{
    id: 3,
    question: "What's your relationship status?",
    type: "radio",
    options: ["First Date", "In a relationship", "Married", "Casual"],
  },
  {
    id:4,
    question: "What type of date location do you want?",
    type: "radio",
    options: ["Beach", "Mountains", "Restaurant", "Movie"],
  }
]


import { useAuth } from "@/lib/useAuth"

// Helper to map answers to field names
const fieldMap = ["mood", "budget", "location", "status"];

export default function FormPage() {
  const router = useRouter();
  useAuth(); // Redirects to /auth if not logged in
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Location popup state
  const [showLocationPopup, setShowLocationPopup] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  // Store lat/lng as state variables
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);


  // Check geolocation permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'permissions' in navigator) {
      // @ts-ignore
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          // If already granted, get location immediately
          if (latitude === null || longitude === null) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setLocationError(null);
              },
              (err) => {
                setLocationError("Failed to retrieve location.");
              }
            );
          }
          setShowLocationPopup(false);
        }
      });
    }
  }, []);

  // When lat/lng is set, close popup
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setShowLocationPopup(false);
    }
  }, [latitude, longitude]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Permission denied. Please allow location access.");
        } else {
          setLocationError("Failed to retrieve location.");
        }
      }
    );
  };

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

  // Submit handler for form data
  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);
    // Map answers to correct fields based on new questions
    const mood = answers[1] || "";
    const budget = answers[2] || "";
    const status = answers[3] || "";
    const locationType = answers[4] || "";
    // Save to localStorage for use in results page
    if (typeof window !== "undefined") {
      localStorage.setItem("mood", mood);
      localStorage.setItem("budget", budget);
      localStorage.setItem("status", status);
      localStorage.setItem("locationType", locationType);
      if (latitude !== null) localStorage.setItem("latitude", latitude.toString());
      if (longitude !== null) localStorage.setItem("longitude", longitude.toString());
    }
    setSubmitSuccess("Form data saved!");
    setSubmitting(false);
    router.push("/results");
  };

  return (
    <div className="flex-1 bg-[url('/form_bg.svg')] min-h-screen overflow-hidden h-screen h-[{height}px] w-screen w-[{width}px] bg-cover bg-center relative">
      {/* Location popup overlay */}
      {showLocationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center space-y-4 relative">
            <h2 className="text-xl font-semibold">Allow Location Access</h2>
            <p className="text-gray-700">To personalize your date plan, please allow access to your location.</p>
            <button
              onClick={handleGetLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get My Location
            </button>
            {locationError && <p className="text-red-600">{locationError}</p>}
          </div>
        </div>
      )}
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

      {/* Main form UI, hidden when popup is open */}
      <div className={`max-w-2xl mx-auto relative z-10${showLocationPopup ? ' pointer-events-none opacity-30 select-none' : ''}`}>
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
                <Button
                  onClick={handleSubmit}
                  disabled={!hasAnswer || submitting}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Create My Date Plan"}
                </Button>
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
            {/* Show error or success message */}
            {submitError && (
              <div className="text-red-500 text-sm text-center mt-4">{submitError}</div>
            )}
            {submitSuccess && (
              <div className="text-green-600 text-sm text-center mt-4">{submitSuccess}</div>
            )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
