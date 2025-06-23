"use client"

import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface UnsavedChangesIndicatorProps {
  hasUnsavedChanges: boolean
  isSaving?: boolean
  variant?: "badge" | "dot" | "icon" | "text"
  size?: "sm" | "md" | "lg"
  className?: string
  showTooltip?: boolean
  tooltipContent?: string
}

export function UnsavedChangesIndicator({
  hasUnsavedChanges,
  isSaving = false,
  variant = "badge",
  size = "md",
  className,
  showTooltip = true,
  tooltipContent,
}: UnsavedChangesIndicatorProps) {
  const getIndicatorContent = () => {
    if (isSaving) {
      switch (variant) {
        case "badge":
          return (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Saving...
            </Badge>
          )
        case "dot":
          return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        case "icon":
          return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
        case "text":
          return <span className="text-blue-600 text-sm animate-pulse">Saving...</span>
      }
    }

    if (hasUnsavedChanges) {
      switch (variant) {
        case "badge":
          return (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved
            </Badge>
          )
        case "dot":
          return <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        case "icon":
          return <AlertCircle className="h-4 w-4 text-orange-500" />
        case "text":
          return <span className="text-orange-600 text-sm">Unsaved changes</span>
      }
    }

    // Clean state
    switch (variant) {
      case "badge":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Saved
          </Badge>
        )
      case "dot":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "icon":
        return <Check className="h-4 w-4 text-green-500" />
      case "text":
        return <span className="text-green-600 text-sm">All changes saved</span>
    }
  }

  const getTooltipContent = () => {
    if (tooltipContent) return tooltipContent

    if (isSaving) return "Saving changes..."
    if (hasUnsavedChanges) return "You have unsaved changes"
    return "All changes are saved"
  }

  const indicator = <div className={cn("flex items-center", className)}>{getIndicatorContent()}</div>

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{indicator}</TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return indicator
}
