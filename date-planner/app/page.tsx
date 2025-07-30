"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/ui/button"
import { Card, CardContent } from "@/app/ui/card"
import { Heart, Sparkles, Star, Users, Coffee, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebaseAuth"
import Image from "next/image"
import LocationButton from "@/components/location_btn"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"


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
        if (j < line2.length - 1) {
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
  const height = window.innerHeight;
  const width = window.innerWidth;

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center w-full h-full">

        </div>
        <p className="text-white mt-4 text-xl font-semibold text-center flex justify-center items-center">Creating Magic...</p>
      </div>

    )
  }

  return (
    <div className="min-h-screen bg-white  relative overflow-hidden flex flex-col items-center">
      <div className=" flex-1 bg-[url('/main_bg.svg')] min-h-screen overflow-hidden h-screen h-[{height}px] w-screen w-[{width}px] bg-cover bg-center relative">
        <div className="absolute left-[280px] top-[200px] flex items-center justify-center">


        </div>
        <div className="absolute left-[280px] top-[350px] flex items-center justify-center px-[180px] ">
          <button
            className="bg-black rounded-xl h-[30px] w-[200px] text-white text-lg "
            onClick={() => router.push('/auth')}
          >
            Get Started
          </button>
        </div>

      </div>
      <div className="flex-1 bg-[url('/bg3.svg')] min-h-screen overflow-hidden h-screen h-[{height}px] w-screen w-[{width}px] bg-cover bg-center relative">
      </div>

      <div>
      <div className="flex-1 bg-[url('/bg4.svg')] min-h-screen overflow-hidden h-screen h-[{height}px] w-screen w-[{width}px] bg-cover bg-center relative"></div>
      </div>

      
      
    </div>
  )
}
