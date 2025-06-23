"use client"

import type { UseFormReturn } from "react-hook-form"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"

interface SectionStatusIndicatorProps {
  form: UseFormReturn<FullConfigurationForm>
  sectionFields: (keyof FullConfigurationForm)[]
  isSaving?: boolean
  className?: string
}

export function SectionStatusIndicator({
  form,
  sectionFields,
  isSaving = false,
  className,
}: SectionStatusIndicatorProps) {
  // Check if any fields in this section have been modified
  const dirtyFields = form.formState.dirtyFields
  const hasSectionChanges = sectionFields.some((field) => dirtyFields[field])

  // Check for validation errors in this section
  const errors = form.formState.errors
  const hasSectionErrors = sectionFields.some((field) => errors[field])

  const getStatusColor = () => {
    if (isSaving) return "text-blue-500"
    if (hasSectionErrors) return "text-red-500"
    if (hasSectionChanges) return "text-orange-500"
    return "text-green-500"
  }

  const getStatusIcon = () => {
    if (isSaving) return <Loader2 className="h-3 w-3 animate-spin" />
    if (hasSectionErrors) return <AlertCircle className="h-3 w-3" />
    if (hasSectionChanges) return <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
    return <Check className="h-3 w-3" />
  }

  return <div className={cn("flex items-center justify-center", getStatusColor(), className)}>{getStatusIcon()}</div>
}
