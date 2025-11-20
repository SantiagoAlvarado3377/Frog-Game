"use client"

import { useState } from "react"
import FrogGame from "@/components/frog-game"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex items-center justify-center p-4">
      <div className="w-full">
        <FrogGame />
      </div>
    </main>
  )
}
