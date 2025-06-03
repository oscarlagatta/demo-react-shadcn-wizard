"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DebugHistoryModalProps {
  applicationId: string
  trigger?: React.ReactNode
}

export function DebugHistoryModal({ applicationId, trigger }: DebugHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [hasError, setHasError] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string>("")

  const addDebugInfo = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo((prev) => [...prev, `[${timestamp}] ${message}`])
    console.log(`[History Debug] ${message}`)
  }, [])

  const handleButtonClick = useCallback(
    (event: React.MouseEvent) => {
      try {
        addDebugInfo("Button clicked - event triggered")
        addDebugInfo(`Event target: ${event.target}`)
        addDebugInfo(`Current target: ${event.currentTarget}`)
        addDebugInfo(`Application ID: ${applicationId}`)

        // Check if event is properly propagating
        if (event.defaultPrevented) {
          addDebugInfo("WARNING: Event default was prevented")
        }

        // Check if button is disabled
        const button = event.currentTarget as HTMLButtonElement
        if (button.disabled) {
          addDebugInfo("ERROR: Button is disabled")
          setHasError(true)
          setErrorDetails("Button is disabled")
          return
        }

        // Attempt to open modal
        addDebugInfo("Attempting to open modal...")
        setIsOpen(true)
        addDebugInfo("Modal state set to true")
      } catch (error) {
        addDebugInfo(`ERROR in button click handler: ${error}`)
        setHasError(true)
        setErrorDetails(error instanceof Error ? error.message : String(error))
      }
    },
    [applicationId, addDebugInfo],
  )

  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      addDebugInfo(`Modal open state changing to: ${open}`)
      setIsOpen(open)

      if (!open) {
        addDebugInfo("Modal closed - clearing debug info")
        // Clear debug info when modal closes
        setTimeout(() => {
          setDebugInfo([])
          setHasError(false)
          setErrorDetails("")
        }, 1000)
      }
    },
    [addDebugInfo],
  )

  // Component mount debugging
  useEffect(() => {
    addDebugInfo("DebugHistoryModal component mounted")
    addDebugInfo(`Props - applicationId: ${applicationId}`)
    addDebugInfo(`Props - trigger provided: ${!!trigger}`)

    return () => {
      addDebugInfo("DebugHistoryModal component unmounting")
    }
  }, [applicationId, trigger, addDebugInfo])

  // Modal state debugging
  useEffect(() => {
    addDebugInfo(`Modal isOpen state changed to: ${isOpen}`)
  }, [isOpen, addDebugInfo])

  return (
    <>
      {/* Debug Information Display */}
      {debugInfo.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert className={hasError ? "border-red-500 bg-red-50" : "border-blue-500 bg-blue-50"}>
            <div className="flex items-center gap-2 mb-2">
              {hasError ? (
                <XCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-blue-600" />
              )}
              <span className="font-medium">Debug Information</span>
            </div>
            <AlertDescription>
              <div className="max-h-32 overflow-y-auto text-xs font-mono space-y-1">
                {debugInfo.slice(-10).map((info, index) => (
                  <div key={index} className="text-gray-700">
                    {info}
                  </div>
                ))}
              </div>
              {hasError && (
                <div className="mt-2 p-2 bg-red-100 rounded text-red-800 text-xs">
                  <strong>Error:</strong> {errorDetails}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="sm"
              onClick={handleButtonClick}
              className="debug-history-button"
              data-testid="view-history-button"
            >
              <Clock className="h-4 w-4 mr-2" />
              View History (Debug)
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Debug History Modal - Application {applicationId}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a debug version of the History Modal. The modal opened successfully!
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="font-medium">Debug Information:</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono max-h-40 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="text-gray-700">
                    {info}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setIsOpen(false)}>Close Debug Modal</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
