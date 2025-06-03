"use client"

import { AlertCircle } from "lucide-react"

interface FieldErrorProps {
  error?: string
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) {
    return null
  }

  return (
    <div className="flex items-center space-x-1 text-red-600 text-xs">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )
}
