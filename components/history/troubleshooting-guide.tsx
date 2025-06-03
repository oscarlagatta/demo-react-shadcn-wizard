"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Code, Bug } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface TroubleshootingStep {
  title: string
  description: string
  code?: string
  solution: string
}

const troubleshootingSteps: TroubleshootingStep[] = [
  {
    title: "Button Not Responding to Clicks",
    description: "The View History button appears but doesn't respond when clicked.",
    code: `// Check if event handlers are properly attached
const button = document.querySelector('[data-testid="view-history-button"]');
console.log('Button found:', !!button);
console.log('Button disabled:', button?.disabled);
console.log('Button event listeners:', getEventListeners(button));`,
    solution:
      "Ensure the button is not disabled and event handlers are properly attached. Check for CSS pointer-events: none or z-index issues.",
  },
  {
    title: "Modal Not Opening",
    description: "Button clicks are registered but the modal dialog doesn't appear.",
    code: `// Check modal state and Dialog component
console.log('Modal open state:', isOpen);
console.log('Dialog component in DOM:', document.querySelector('[role="dialog"]'));
console.log('Dialog trigger:', document.querySelector('[data-radix-collection-item]'));`,
    solution:
      "Verify that the Dialog component is properly imported and the open state is being managed correctly. Check for CSS display or visibility issues.",
  },
  {
    title: "JavaScript Errors in Console",
    description: "Console shows errors when attempting to open the history view.",
    code: `// Common error patterns to look for:
// 1. Cannot read property 'X' of undefined
// 2. Module not found errors
// 3. Hook call errors
// 4. Event handler errors`,
    solution:
      "Check the browser console for specific error messages. Common issues include missing dependencies, incorrect hook usage, or undefined props.",
  },
  {
    title: "Network/API Issues",
    description: "Modal opens but fails to load history data.",
    code: `// Test API connectivity
fetch('/api/applications/100/history')
  .then(response => console.log('API Response:', response.status))
  .catch(error => console.error('API Error:', error));`,
    solution:
      "Verify that the history API endpoints are available and returning valid responses. Check network tab for failed requests.",
  },
  {
    title: "CSS/Styling Conflicts",
    description: "Button or modal appears but is not visually accessible or properly styled.",
    code: `// Check computed styles
const button = document.querySelector('[data-testid="view-history-button"]');
const styles = window.getComputedStyle(button);
console.log('Display:', styles.display);
console.log('Visibility:', styles.visibility);
console.log('Pointer Events:', styles.pointerEvents);
console.log('Z-Index:', styles.zIndex);`,
    solution:
      "Inspect element styles to identify conflicting CSS rules. Look for display: none, visibility: hidden, or pointer-events: none.",
  },
]

export function TroubleshootingGuide() {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSteps(newExpanded)
  }

  const runQuickFix = () => {
    // Attempt common fixes
    const fixes = [
      () => {
        // Clear any stuck modal states
        const modals = document.querySelectorAll('[role="dialog"]')
        modals.forEach((modal) => modal.remove())
        console.log("Cleared stuck modals")
      },
      () => {
        // Reset button states
        const buttons = document.querySelectorAll("button[disabled]")
        buttons.forEach((button) => button.removeAttribute("disabled"))
        console.log("Reset disabled buttons")
      },
      () => {
        // Clear localStorage issues
        try {
          localStorage.removeItem("history-modal-state")
          console.log("Cleared localStorage cache")
        } catch (e) {
          console.log("localStorage not available")
        }
      },
    ]

    fixes.forEach((fix, index) => {
      try {
        fix()
      } catch (error) {
        console.error(`Fix ${index + 1} failed:`, error)
      }
    })

    alert("Quick fixes applied. Try clicking the View History button again.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Troubleshooting Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            If the View History button is not working, follow these troubleshooting steps in order.
          </AlertDescription>
        </Alert>

        <Button onClick={runQuickFix} variant="outline" className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          Try Quick Fixes
        </Button>

        <div className="space-y-2">
          {troubleshootingSteps.map((step, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto" onClick={() => toggleStep(index)}>
                  <div className="text-left">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-gray-500">{step.description}</div>
                  </div>
                  {expandedSteps.has(index) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3">
                  {step.code && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4" />
                        <span className="text-sm font-medium">Debug Code:</span>
                      </div>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">{step.code}</pre>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Solution:</span>
                    </div>
                    <p className="text-sm text-gray-700">{step.solution}</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Still having issues?</strong> Open your browser's Developer Tools (F12), go to the Console tab, and
            look for any error messages when clicking the button. Copy any error messages and include them when
            reporting the issue.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
