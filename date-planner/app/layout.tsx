import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import PinkCursor from "@/components/PinkCursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DateCraft - Your AI Date Planning Partner",
  description: "Where AI meets romance to craft your perfect date",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PinkCursor />
        {children}
      </body>
    </html>
  )
}
