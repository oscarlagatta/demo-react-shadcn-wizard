"use client"

import { useValidation } from "@/lib/validation/validation-context"
import { cn } from "@/lib/utils"

interface SectionIndicatorProps {
  section: number
  title: string
  className?: string
}

export function SectionIndicator({ section, title, className }: SectionIndicatorProps) {
  const { isSectionValid, getSectionErrors } = useValidation()

  const isValid = isSectionValid(section)
  const errorCount = getSectionErrors(section).length

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <span className={cn(isValid ? "text-current" : "text-red-600")}>{title}</span>
      {!isValid && errorCount > 0 && (
        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
          {errorCount}
        </span>
      )}
    </div>
  )
}
