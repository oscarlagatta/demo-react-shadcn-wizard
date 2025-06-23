"use client"

import { Save, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnhancedSaveButtonProps {
  hasUnsavedChanges: boolean
  isSaving: boolean
  onSave: () => void
  disabled?: boolean
  className?: string
}

export function EnhancedSaveButton({
  hasUnsavedChanges,
  isSaving,
  onSave,
  disabled = false,
  className,
}: EnhancedSaveButtonProps) {
  const getButtonContent = () => {
    if (isSaving) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Saving...
        </>
      )
    }

    if (hasUnsavedChanges) {
      return (
        <>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
          <div className="ml-2 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        </>
      )
    }

    return (
      <>
        <Check className="h-4 w-4 mr-2" />
        All Saved
      </>
    )
  }

  const getButtonVariant = () => {
    if (hasUnsavedChanges) return "default"
    return "outline"
  }

  const getButtonClassName = () => {
    return cn(
      "transition-all duration-200",
      hasUnsavedChanges && "bg-green-600 hover:bg-green-700 shadow-lg",
      !hasUnsavedChanges && "bg-gray-100 text-gray-600",
      isSaving && "bg-blue-600 hover:bg-blue-700",
      className,
    )
  }

  return (
    <Button
      onClick={onSave}
      disabled={disabled || isSaving || !hasUnsavedChanges}
      variant={getButtonVariant()}
      className={getButtonClassName()}
    >
      {getButtonContent()}
    </Button>
  )
}
