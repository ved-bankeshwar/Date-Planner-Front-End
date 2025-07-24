"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Clock, DollarSign, MessageCircle, Shirt, Car, Star, Calendar } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const [chatMessages, setChatMessages] = useState<Array<{ type: "user" | "ai"; message: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [showChat, setShowChat] = useState(false)

  const dateIdea = {
    title: "Sunset Picnic & Stargazing Adventure",
    description: "A romantic evening combining nature, good food, and intimate conversation under the stars.",
    location: "Griffith Observatory, Los Angeles",
    duration: "4-5 hours",
    budget: "$75-100",
    time: "5:00 PM - 10:00 PM",
    activities: [
      { time: "5:00 PM", activity: "Meet at Griffith Observatory parking", icon: MapPin },
      { time: "5:30 PM", activity: "Set up picnic spot with city view", icon: Heart },
      { time: "6:00 PM", activity: "Enjoy gourmet picnic dinner", icon: DollarSign },
      { time: "7:30 PM", activity: "Watch the sunset together", icon: Clock },
      { time: "8:30 PM", activity: "Explore the observatory", icon: Star },
      { time: "9:30 PM", activity: "Stargazing with telescope", icon: Star },
    ],
  }

  const outfitSuggestions = [
    { type: "Casual Chic", description: "Comfortable jeans, cozy sweater, and stylish sneakers" },
    { type: "Romantic", description: "Flowy dress with a light cardigan and comfortable flats" },
    { type: "Adventurous", description: "Cute hiking outfit with layers for temperature changes" },
  ]

  const conversationStarters = [
    "What's the most beautiful sunset you've ever seen?",
    "If you could travel to any planet, which would you choose?",
    "What's your favorite childhood memory under the stars?",
    "What's something that always makes you smile?",
  ]

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    setChatMessages((prev) => [...prev, { type: "user", message: chatInput }])

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "ai",
          message: "I'd be happy to help you adjust your date plan! What specific changes would you like to make?",
        },
      ])
    }, 1000)

    setChatInput("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Your Perfect Date Plan ✨</h1>
          <p className="text-gray-600">Crafted specially for you by our AI cupid</p>
        </div>

        {/* Main Date Idea */}
        <Card className="glass-effect border-pink-200 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center gap-2">
              <Heart className="text-pink-500" size={28} />
              {dateIdea.title}
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">{dateIdea.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Info */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                <MapPin className="text-pink-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">{dateIdea.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Clock className="text-purple-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-800">{dateIdea.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-lg">
                <DollarSign className="text-rose-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold text-gray-800">{dateIdea.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <Calendar className="text-yellow-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold text-gray-800">{dateIdea.time}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-pink-500" size={24} />
                Your Date Timeline
              </h3>
              <div className="space-y-4">
                {dateIdea.activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                    <Badge variant="outline" className="border-pink-300 text-pink-600">
                      {activity.time}
                    </Badge>
                    <activity.icon className="text-gray-500" size={20} />
                    <span className="text-gray-700">{activity.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Suggestions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Outfit Suggestions */}
          <Card className="glass-effect border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Shirt className="text-pink-500" size={24} />
                Outfit Ideas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outfitSuggestions.map((outfit, index) => (
                <div key={index} className="p-3 bg-pink-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{outfit.type}</h4>
                  <p className="text-sm text-gray-600">{outfit.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Conversation Starters */}
          <Card className="glass-effect border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MessageCircle className="text-pink-500" size={24} />
                Conversation Starters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversationStarters.map((starter, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-gray-700">"{starter}"</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => setShowChat(!showChat)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            <MessageCircle size={20} className="mr-2" />
            Chat to Refine
          </Button>
          <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent">
            <MapPin size={20} className="mr-2" />
            Book Restaurant
          </Button>
          <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent">
            <Car size={20} className="mr-2" />
            Book Transportation
          </Button>
          <Link href="/feedback">
            <Button variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50 bg-transparent">
              <Star size={20} className="mr-2" />
              Complete Date
            </Button>
          </Link>
        </div>

        {/* Chat Interface */}
        {showChat && (
          <Card className="glass-effect border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MessageCircle className="text-pink-500" size={24} />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center">Ask me anything about your date plan!</p>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.type === "user" ? "bg-pink-500 text-white ml-auto" : "bg-white text-gray-800 border"
                      }`}
                    >
                      {msg.message}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about changes to your date..."
                  className="flex-1 p-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                />
                <Button type="submit" size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
