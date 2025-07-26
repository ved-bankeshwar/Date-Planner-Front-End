"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebaseAuth"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Sparkles, Mail, Lock, User } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const createFloatingHeart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newHeart = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setFloatingHearts((prev) => [...prev, newHeart])

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Optionally update profile with name
      }
      router.push("/form");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-200 to-rose-300 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="text-pink-400" size={16} />
            ) : i % 3 === 1 ? (
              <Sparkles className="text-purple-400" size={14} />
            ) : (
              <div className="w-2 h-2 bg-rose-400 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Floating hearts from interactions */}
      {/* {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: heart.x,
            top: heart.y,
            animation: "floatUp 2s ease-out forwards",
          }}
        >
          💕
        </div>
      ))} */}

      <Card className="w-full max-w-md glass-effect bg-white/60 border-pink-200 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-rose-500/5" />

        <CardHeader className="text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Heart className="text-pink-500 animate-pulse" size={48} />
              <div className="absolute inset-0 animate-ping opacity-30">
                <Heart className="text-pink-400" size={48} />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text">
            {isLogin ? "Welcome Back" : "Join DateCraft"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isLogin ? "Sign in to continue your love story" : "Start your romantic journey today"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">

          <form className="space-y-4" onMouseMove={createFloatingHeart} onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={18} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-pink-500 hover:text-pink-600 font-semibold transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <div className="text-center">
            <Link href="/form">
              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent">
                Continue as Guest ✨
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
