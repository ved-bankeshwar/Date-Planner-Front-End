"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Sparkles, Star, Users, Coffee, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebaseAuth"
import Image from "next/image"
import LocationButton from "@/components/location_btn"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

export default function LandingPage() {
  const router = useRouter();
  // Register GSAP plugin
  gsap.registerPlugin(ScrollTrigger)
  // Smooth scroll to Contact Us section
  const handleContactScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Refs for all main sections/components
  const heroRef = useRef<HTMLDivElement>(null)
  const getStartedRef = useRef<HTMLDivElement>(null)
  const cardRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const contactLeftRef = useRef<HTMLDivElement>(null)
  const contactFormRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  // Optimized GSAP ScrollTrigger for only key content blocks
  useEffect(() => {
    if (!isLoaded) return;
    // Feature cards (slide from sides)
    cardRefs.forEach((ref, idx) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { x: idx === 1 ? 0 : (idx === 0 ? -100 : 100), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.1 * idx,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              once: true
            }
          }
        )
      }
    })
    // Contact left (slide from left)
    if (contactLeftRef.current) {
      gsap.fromTo(
        contactLeftRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactLeftRef.current,
            start: "top 85%",
            once: true
          }
        }
      )
    }
    // Contact form (slide from right)
    if (contactFormRef.current) {
      gsap.fromTo(
        contactFormRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactFormRef.current,
            start: "top 85%",
            once: true
          }
        }
      )
    }
    // Testimonials (fade in up)
    if (testimonialsRef.current) {
      gsap.fromTo(
        testimonialsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 90%",
            once: true
          }
        }
      )
    }
    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [isLoaded])

  // Typewriter effect for hero text
  const line1 = "A  dating concierge....kinda";
  const line2 = "UUnlimited date ideas unlimited fun.";
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");

  useEffect(() => {
    let i = 0;
    let j = 0;
    let typingLine1 = true;
    const interval = setInterval(() => {
      if (typingLine1) {
        if (i < line1.length - 1) {
          setTypedLine1(prev => prev + line1[i]);
          i++;
        } else {
          typingLine1 = false;
        }
      } else {
        if (j < line2.length -1) {
          setTypedLine2(prev => prev + line2[j]);
          j++;
        } else {
          clearInterval(interval);
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { text: "Meet Me Amore planned the most magical evening! Every detail was perfect 💕", author: "Sarah & Mike" },
    { text: "The AI suggestions were spot-on. Best date planning app ever! ✨", author: "Emma & Jake" },
    { text: "From outfit to conversation starters, everything was amazing!", author: "Lisa & David" },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <Heart className="text-white animate-pulse" size={60} />
            <div className="absolute inset-0 animate-ping">
              <Heart className="text-white/50" size={60} />
            </div>
          </div>
          <p className="text-white mt-4 text-xl font-semibold">Creating Magic...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navigation with wavy bottom */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
              Meet Me Amore
            </div>
            <div className="hidden md:flex items-center space-x-8">
              
              <a
                href="#contact"
                className="text-gray-700 hover:text-pink-600 transition-colors"
                onClick={handleContactScroll}
              >
                Contact Us
              </a>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Wavy bottom border */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 20" className="w-full h-3 fill-current text-white/90" preserveAspectRatio="none">
            <path d="M0,10 C300,0 600,20 900,10 C1050,5 1150,15 1200,10 L1200,20 L0,20 Z"></path>
          </svg>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 flex items-center justify-start overflow-hidden">

        <div className="relative z-10  grid lg:grid-cols-2 gap-12 items-center justify-start px-20 w-full">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <Sparkles className="text-white" size={16} />
              <span className="text-white font-medium">AI-Powered Date Planning</span>
            </div>

            <h1 className="text-8xl lg:text-9xl text-white mb-6 leading-tight font-thin flex flex-col">
              <div className=" bg-clip-text text-white font-bold indie-flower-regular text-5xl flex-[1.5] flex items-end px-5">
                meet me
              </div>
              
              <div className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent indie-flower-regular flex-[1.5] flex items-start justify-start">
                Amore
              </div>
            </h1>


            <p className="text-xl text-white/90 mb-8 leading-relaxed font-mono min-h-[2.5rem]">
              {typedLine1}
              {typedLine1.length < line1.length && <span className="animate-pulse">|</span>}
            </p>
            <p className="text-lg text-white/80 mb-10 max-w-md font-mono min-h-[2.5rem]">
              {typedLine2}
              {typedLine1.length === line1.length && typedLine2.length < line2.length && <span className="animate-pulse">|</span>}
            </p>

            <Button
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={async () => {
                onAuthStateChanged(auth, (user) => {
                  if (user) {
                    router.push("/form");
                  } else {
                    router.push("/auth");
                  }
                });
              }}
            >
              Get Started
            </Button>
          </div>

          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] group">
              <Image
                src="/table.png"
                alt="3D illustration of romantic date planning elements"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wavy Divider */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-orange-300" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Get Started Section */}
      <section id="get-started" ref={getStartedRef} className="bg-gradient-to-br from-orange-300 to-yellow-400 py-20 -mt-1">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-8">
            Ready to Find
            <br />
            Your Perfect Date?
          </h2>

          <p className="text-xl text-gray-800 mb-12">
            Join thousands who've discovered the magic of AI-powered romance. Start your journey to unforgettable dates
            today!
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div ref={cardRefs[0]} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl opacity-0 will-change-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-orange-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Setup</h3>
              <p className="text-gray-800">Get started in just 5 minutes with our simple questionnaire</p>
            </div>

            <div ref={cardRefs[1]} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl opacity-0 will-change-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-orange-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Magic</h3>
              <p className="text-gray-800">Our AI creates personalized date plans just for you</p>
            </div>

            <div ref={cardRefs[2]} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl opacity-0 will-change-transform">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-orange-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Dates</h3>
              <p className="text-gray-800">Enjoy memorable experiences tailored to your preferences</p>
            </div>
          </div>

          <Link href="/auth">
            <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Start Your Love Story
            </Button>
          </Link>
        </div>
      </section>

      {/* Wavy Divider */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-pink-300" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1050,120 1150,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Contact Us Section */}
      <section id="contact" className="bg-gradient-to-br from-pink-300 to-rose-400 py-20 -mt-1">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-white text-center mb-16">Contact Us</h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div ref={contactLeftRef} className="opacity-0 will-change-transform">
              <h3 className="text-3xl font-bold text-white mb-8">Get in Touch</h3>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Have questions about our service? Want to share feedback? We'd love to hear from you!
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Address</h4>
                    <p className="text-white/80">123 Romance Street, Love City, LC 12345</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500">
                    <Coffee className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Email</h4>
                    <p className="text-white/80">hello@meetmeamore.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500">
                    <Heart className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Phone</h4>
                    <p className="text-white/80">+1 (555) LOVE-DATE</p>
                  </div>
                </div>
              </div>
            </div>

            <Card ref={contactFormRef} className="bg-white rounded-3xl shadow-xl overflow-hidden opacity-0 will-change-transform">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                      placeholder="Tell us how we can help..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white py-3 rounded-lg font-semibold transition-all duration-300">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Another Wavy Divider */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-white" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* Testimonials Section - Now at the end */}
      <section ref={testimonialsRef} className="bg-white py-20 -mt-1 opacity-0 will-change-transform">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">What Our Users Say</h2>
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-12">
            <p className="text-2xl text-gray-800 italic mb-6 transition-all duration-500">
              "{testimonials[currentTestimonial].text}"
            </p>
            <p className="text-pink-600 font-bold text-lg">- {testimonials[currentTestimonial].author}</p>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-pink-500 w-8" : "bg-pink-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
