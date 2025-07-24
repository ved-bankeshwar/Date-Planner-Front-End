"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Calendar, MessageCircle, Star } from "lucide-react"
import Link from "next/link"

// Particle class for canvas animation
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.life = Math.random() * 200 + 100
    this.maxLife = this.life
    this.size = Math.random() * 2 + 1
    this.color = "rgba(173, 20, 87, 0.4)"
  }

  update(canvas: HTMLCanvasElement) {
    this.x += this.vx
    this.y += this.vy
    this.life--

    if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.life = this.maxLife
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = (this.life / this.maxLife) * 0.6
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [mouseTrails, setMouseTrails] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [titleParticles, setTitleParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  const testimonials = [
    { text: "Meet Me Amore planned the most magical evening! Every detail was perfect 💕", author: "Sarah & Mike" },
    { text: "The AI suggestions were spot-on. Best date planning app ever! ✨", author: "Emma & Jake" },
    { text: "From outfit to conversation starters, everything was amazing!", author: "Lisa & David" },
  ]

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const newParticles: Particle[] = []
    for (let i = 0; i < 30; i++) {
      newParticles.push(new Particle(canvas))
    }
    setParticles(newParticles)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      newParticles.forEach((particle) => {
        particle.update(canvas)
        particle.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Mouse movement effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Add mouse trail
      const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() }
      setMouseTrails((prev) => [...prev.slice(-8), newTrail])
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [particles])

  // Remove old mouse trails
  useEffect(() => {
    const interval = setInterval(() => {
      setMouseTrails((prev) => prev.slice(-6))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Create title particles around the hero title
  useEffect(() => {
    if (isLoaded) {
      const particles = []
      for (let i = 0; i < 8; i++) {
        particles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 8,
        })
      }
      setTitleParticles(particles)
    }
  }, [isLoaded])

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-light flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <Heart className="text-primary animate-pulse" size={60} />
            <div className="absolute inset-0 animate-ping">
              <Heart className="text-primary-light opacity-30" size={60} />
            </div>
          </div>
          <p className="text-text mt-4 text-xl font-semibold">Creating Magic...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-light">
      {/* Dynamic Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none z-5 gradient-overlay" />

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-5 opacity-8">
        <div className="grid-line horizontal" style={{ top: "20%", animationDelay: "0s" }} />
        <div className="grid-line horizontal" style={{ top: "60%", animationDelay: "5s" }} />
        <div className="grid-line vertical" style={{ left: "30%", animationDelay: "2s" }} />
        <div className="grid-line vertical" style={{ left: "70%", animationDelay: "7s" }} />
      </div>

      {/* Mouse Trails */}
      {mouseTrails.map((trail, index) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-40 transition-all duration-300"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            width: 8,
            height: 8,
            background: `radial-gradient(circle, rgba(173, 20, 87, ${0.6 - index * 0.1}) 0%, transparent 70%)`,
            borderRadius: "50%",
            transform: `scale(${1 - index * 0.1})`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Hero Badge */}
        <div className="hero-badge mb-8">
          <span className="sparkle-icon">✨</span>
          AI-Powered Date Planning
        </div>

        {/* Logo section with enhanced effects */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="relative">
            <h1 className="hero-title text-center">Meet Me Amore</h1>
            {/* Title Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {titleParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="title-particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <p className="hero-subtitle text-center">
              From dinner reservations to outfit suggestions, let our AI concierge craft unforgettable moments. Just
              share your vibe, budget, and preferences — we'll handle the magic.
            </p>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="mt-12 flex gap-5 flex-wrap justify-center">
          <Link href="/auth">
            <Button className="btn-primary">Plan My Date</Button>
          </Link>
          <Button className="btn-secondary">Learn More</Button>
        </div>

        {/* Enhanced feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          {[
            {
              icon: Calendar,
              title: "Smart Planning",
              desc: "AI-powered date ideas tailored just for you",
            },
            {
              icon: MessageCircle,
              title: "Chat & Refine",
              desc: "Perfect your date with interactive chat",
            },
            {
              icon: Star,
              title: "Complete Experience",
              desc: "Outfits, bookings, and conversation starters",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="feature-card"
              onMouseEnter={(e) => {
                // Create ripple effect
                const rect = e.currentTarget.getBoundingClientRect()
                const ripple = document.createElement("div")
                ripple.style.cssText = `
                  position: absolute;
                  border-radius: 50%;
                  background: rgba(173, 20, 87, 0.2);
                  transform: scale(0);
                  animation: ripple 0.6s linear;
                  left: ${e.clientX - rect.left - 25}px;
                  top: ${e.clientY - rect.top - 25}px;
                  width: 50px;
                  height: 50px;
                  pointer-events: none;
                `
                e.currentTarget.appendChild(ripple)
                setTimeout(() => ripple.remove(), 600)
              }}
            >
              <CardContent className="p-8 text-center relative z-10 flex flex-col items-center">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dynamic testimonial */}
        <div className="mt-20 max-w-2xl mx-auto">
          <div className="testimonial-card">
            <div className="relative z-10 text-center">
              <p className="text-text italic text-xl mb-6 transition-all duration-500">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-primary font-bold text-lg">- {testimonials[currentTestimonial].author}</p>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-primary w-6" : "bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive cursor */}
      <div
        className="fixed pointer-events-none z-50 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          width: 16,
          height: 16,
          background: "radial-gradient(circle, rgba(173, 20, 87, 0.6) 0%, rgba(230, 81, 0, 0.4) 50%, transparent 70%)",
          borderRadius: "50%",
          transform: "scale(0.8)",
        }}
      />
    </div>
  )
}
