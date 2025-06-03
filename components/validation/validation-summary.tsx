"use client"

import { AlertTriangle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useValidation } from "@/lib/validation/validation-context"

interface ValidationSummaryProps {
  onSectionClick: (section: number) => void
}

const sectionNames = {
  0: "Application Details",
  1: "Organization Alignment",
  2: "Support Alignment",
  3: "Other Information",
}

export function ValidationSummary({ onSectionClick }: ValidationSummaryProps) {
  const { state, getSectionErrors } = useValidation()

  const sectionsWithErrors = Object.keys(state.sectionErrors)
    .map(Number)
    .filter((section) => getSectionErrors(section).length > 0)

  if (sectionsWithErrors.length === 0) {
    return null
  }

  const totalErrors = sectionsWithErrors.reduce((total, section) => total + getSectionErrors(section).length, 0)

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <span>Validation Errors ({totalErrors})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-red-700">Please fix the following validation errors before saving:</p>

        <div className="space-y-2">
          {sectionsWithErrors.map((section) => {
            const errors = getSectionErrors(section)
            const sectionName = sectionNames[section as keyof typeof sectionNames]

            return (
              <div
                key={section}
                className="flex items-center justify-between p-2 bg-white rounded border border-red-200"
              >
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs">
                    {errors.length}
                  </Badge>
                  <span className="text-sm font-medium text-red-800">{sectionName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSectionClick(section)}
                  className="text-xs h-7 border-red-300 text-red-700 hover:bg-red-100"
                >
                  View Section
                </Button>
              </div>
            )
          })}
        </div>

        <div className="pt-2 border-t border-red-200">
          <div className="space-y-1">
            {sectionsWithErrors.map((section) => {
              const errors = getSectionErrors(section)
              const sectionName = sectionNames[section as keyof typeof sectionNames]

              return (
                <div key={`details-${section}`} className="text-xs text-red-600">
                  <span className="font-medium">{sectionName}:</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <X className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{error.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
