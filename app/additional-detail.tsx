"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Edit,
  Save,
  X,
  Eye,
  Plus,
  Trash2,
  Building,
  Clock,
  Link,
  Mail,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Configuration sections
const configurationSections = [
  {
    id: "support-coordination",
    title: "Support & Coordination",
    description: "Support contacts and coordination information",
    icon: Building,
    color: "blue",
  },
  {
    id: "operation-hours",
    title: "Operation Hours",
    description: "AIT hours of operation and shift management",
    icon: Clock,
    color: "orange",
  },
]

interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  timezone: string
}

interface DaySchedule {
  day: string
  shifts: Shift[]
}

export default function AdditionalDetailPage() {
  // Panel state
  const [currentSection, setCurrentSection] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Calculate progress through sections
  const progress = ((currentSection + 1) / configurationSections.length) * 100

  // State for form data
  const [formData, setFormData] = useState({
    // Support & Coordination Information
    l3SupportContact: "",
    l3SupportGroup: "APPS-GWB-APDV AAREC-US",
    problemCoordinatorLead: "",
    problemCoordinatorGroup: "ITOP-GWB-GTST TCCM PROBCOORD-GLBL",
    portfolioDelegate: "",
    knowledgeRepository: "http://flagscape.bankofamerica.com/portal/site/enterprise/",
    appSupportDG: "dg.bfps_e2e_services_tools@bofa.com",
    tags: ["TestVipin"],

    // Hours of Operation
    operationHours: [
      {
        day: "Monday",
        shifts: [
          {
            id: "monday1",
            name: "test444",
            startTime: "5:00 AM",
            endTime: "7:00 AM",
            timezone: "Eastern Standard Time",
          },
          {
            id: "monday2",
            name: "",
            startTime: "8:40 AM",
            endTime: "11:00 PM",
            timezone: "Eastern Standard Time",
          },
        ],
      },
      {
        day: "Tuesday",
        shifts: [
          {
            id: "tuesday1",
            name: "Martin",
            startTime: "3:30 AM",
            endTime: "12:30 PM",
            timezone: "Eastern Standard Time",
          },
          {
            id: "tuesday2",
            name: "Tuesday-2",
            startTime: "12:35 PM",
            endTime: "6:30 PM",
            timezone: "Eastern Standard Time",
          },
        ],
      },
      {
        day: "Wednesday",
        shifts: [
          {
            id: "wednesday1",
            name: "Test-123",
            startTime: "1:05 AM",
            endTime: "6:15 AM",
            timezone: "Eastern Standard Time",
          },
          {
            id: "wednesday2",
            name: "Test123345",
            startTime: "6:45 AM",
            endTime: "11:15 AM",
            timezone: "Eastern Standard Time",
          },
          {
            id: "wednesday3",
            name: "Test345",
            startTime: "12:05 PM",
            endTime: "6:15 PM",
            timezone: "Eastern Standard Time",
          },
        ],
      },
      {
        day: "Thursday",
        shifts: [
          {
            id: "thursday1",
            name: "Test-1",
            startTime: "12:02 AM",
            endTime: "5:00 AM",
            timezone: "Eastern Standard Time",
          },
          {
            id: "thursday2",
            name: "test-2",
            startTime: "5:05 AM",
            endTime: "11:00 AM",
            timezone: "Eastern Standard Time",
          },
        ],
      },
      {
        day: "Friday",
        shifts: [
          {
            id: "friday1",
            name: "Test123",
            startTime: "12:05 AM",
            endTime: "6:00 AM",
            timezone: "Eastern Standard Time",
          },
        ],
      },
      {
        day: "Saturday",
        shifts: [],
      },
      {
        day: "Sunday",
        shifts: [],
      },
    ] as DaySchedule[],
  })

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateTime = (time: string): boolean => {
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i
    return timeRegex.test(time)
  }

  // Handle input change with validation
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Validate specific fields
    const newErrors: Record<string, string> = {}

    if (field === "appSupportDG" && value && !validateEmail(value)) {
      newErrors[field] = "Please enter a valid email address"
    }

    if (field === "knowledgeRepository" && value && !validateURL(value)) {
      newErrors[field] = "Please enter a valid URL"
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, ...newErrors }))
    }
  }

  // Handle operation hours change with validation
  const handleOperationHoursChange = (dayIndex: number, shiftIndex: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedHours = [...prev.operationHours]
      updatedHours[dayIndex].shifts[shiftIndex] = {
        ...updatedHours[dayIndex].shifts[shiftIndex],
        [field]: value,
      }
      return {
        ...prev,
        operationHours: updatedHours,
      }
    })
    setHasUnsavedChanges(true)

    // Validate time format
    if ((field === "startTime" || field === "endTime") && value && !validateTime(value)) {
      const errorKey = `${dayIndex}-${shiftIndex}-${field}`
      setValidationErrors((prev) => ({
        ...prev,
        [errorKey]: "Please enter time in format: HH:MM AM/PM",
      }))
    } else {
      const errorKey = `${dayIndex}-${shiftIndex}-${field}`
      if (validationErrors[errorKey]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[errorKey]
          return newErrors
        })
      }
    }
  }

  // Add new shift to a day
  const handleAddShift = (dayIndex: number) => {
    setFormData((prev) => {
      const updatedHours = [...prev.operationHours]
      const day = updatedHours[dayIndex].day.toLowerCase()
      const newShiftId = `${day}${updatedHours[dayIndex].shifts.length + 1}`

      updatedHours[dayIndex].shifts.push({
        id: newShiftId,
        name: "",
        startTime: "9:00 AM",
        endTime: "5:00 PM",
        timezone: "Eastern Standard Time",
      })

      return {
        ...prev,
        operationHours: updatedHours,
      }
    })
    setHasUnsavedChanges(true)
  }

  // Remove shift from a day
  const handleRemoveShift = (dayIndex: number, shiftIndex: number) => {
    setFormData((prev) => {
      const updatedHours = [...prev.operationHours]
      updatedHours[dayIndex].shifts.splice(shiftIndex, 1)
      return {
        ...prev,
        operationHours: updatedHours,
      }
    })
    setHasUnsavedChanges(true)
  }

  // Add new tag
  const handleAddTag = () => {
    const newTag = prompt("Enter new tag:")
    if (newTag && newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()])
    }
  }

  // Remove tag
  const handleRemoveTag = (index: number) => {
    const newTags = [...formData.tags]
    newTags.splice(index, 1)
    handleInputChange("tags", newTags)
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentSection < configurationSections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSectionClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  // Edit mode handlers
  const handleEditToggle = () => {
    if (isEditMode && hasUnsavedChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
      if (!confirmDiscard) return
    }
    setIsEditMode(!isEditMode)
    setHasUnsavedChanges(false)
    setValidationErrors({})
  }

  const handleSave = () => {
    // Validate all fields before saving
    const errors: Record<string, string> = {}

    if (formData.appSupportDG && !validateEmail(formData.appSupportDG)) {
      errors.appSupportDG = "Please enter a valid email address"
    }

    if (formData.knowledgeRepository && !validateURL(formData.knowledgeRepository)) {
      errors.knowledgeRepository = "Please enter a valid URL"
    }

    // Validate operation hours
    formData.operationHours.forEach((day, dayIndex) => {
      day.shifts.forEach((shift, shiftIndex) => {
        if (shift.startTime && !validateTime(shift.startTime)) {
          errors[`${dayIndex}-${shiftIndex}-startTime`] = "Invalid time format"
        }
        if (shift.endTime && !validateTime(shift.endTime)) {
          errors[`${dayIndex}-${shiftIndex}-endTime`] = "Invalid time format"
        }
      })
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    // Save logic here
    setIsEditMode(false)
    setHasUnsavedChanges(false)
    setValidationErrors({})

    // Show success message (in real app, this would be a toast notification)
    alert("Additional details saved successfully!")
  }

  // Tooltip component
  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1 flex-shrink-0" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  // Section renderers
  const renderSupportCoordination = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Building className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Support & Coordination
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Configure support contacts and coordination information for this application
        </p>
      </div>

      {/* Support Contacts Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Support Contacts</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="l3SupportContact" className="flex items-center text-sm lg:text-base">
              L3 Support Contact <InfoTooltip content="Level 3 support contact person for escalations" />
            </Label>
            <Input
              id="l3SupportContact"
              value={formData.l3SupportContact}
              onChange={(e) => handleInputChange("l3SupportContact", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
                validationErrors.l3SupportContact && "border-red-300 focus:ring-red-500",
              )}
              placeholder={isEditMode ? "Enter L3 support contact name" : ""}
            />
            {validationErrors.l3SupportContact && (
              <p className="text-sm text-red-600">{validationErrors.l3SupportContact}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="l3SupportGroup" className="flex items-center text-sm lg:text-base">
              L3 Support Group <InfoTooltip content="Level 3 support group identifier" />
            </Label>
            <Input
              id="l3SupportGroup"
              value={formData.l3SupportGroup}
              onChange={(e) => handleInputChange("l3SupportGroup", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemCoordinatorLead" className="flex items-center text-sm lg:text-base">
              Problem Coordinator Lead <InfoTooltip content="Lead person for problem coordination" />
            </Label>
            <Input
              id="problemCoordinatorLead"
              value={formData.problemCoordinatorLead}
              onChange={(e) => handleInputChange("problemCoordinatorLead", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
              placeholder={isEditMode ? "Enter problem coordinator lead name" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemCoordinatorGroup" className="flex items-center text-sm lg:text-base">
              Problem Coordinator Group <InfoTooltip content="Group responsible for problem coordination" />
            </Label>
            <Input
              id="problemCoordinatorGroup"
              value={formData.problemCoordinatorGroup}
              onChange={(e) => handleInputChange("problemCoordinatorGroup", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioDelegate" className="flex items-center text-sm lg:text-base">
              Portfolio Delegate <InfoTooltip content="Delegate for the portfolio management" />
            </Label>
            <Input
              id="portfolioDelegate"
              value={formData.portfolioDelegate}
              onChange={(e) => handleInputChange("portfolioDelegate", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
              placeholder={isEditMode ? "Enter portfolio delegate name" : ""}
            />
          </div>
        </div>
      </div>

      {/* Repository & Communication Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Repository & Communication
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="knowledgeRepository" className="flex items-center text-sm lg:text-base">
              Knowledge Repository <InfoTooltip content="URL to the knowledge repository for this application" />
            </Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="knowledgeRepository"
                type="url"
                value={formData.knowledgeRepository}
                onChange={(e) => handleInputChange("knowledgeRepository", e.target.value)}
                disabled={!isEditMode}
                className={cn(
                  "h-9 lg:h-10 xl:h-11 pl-10",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
                  validationErrors.knowledgeRepository && "border-red-300 focus:ring-red-500",
                )}
                placeholder={isEditMode ? "https://example.com/knowledge-base" : ""}
              />
            </div>
            {validationErrors.knowledgeRepository && (
              <p className="text-sm text-red-600">{validationErrors.knowledgeRepository}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="appSupportDG" className="flex items-center text-sm lg:text-base">
              App Support DG <InfoTooltip content="Application support distribution group email address" />
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="appSupportDG"
                type="email"
                value={formData.appSupportDG}
                onChange={(e) => handleInputChange("appSupportDG", e.target.value)}
                disabled={!isEditMode}
                className={cn(
                  "h-9 lg:h-10 xl:h-11 pl-10",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
                  validationErrors.appSupportDG && "border-red-300 focus:ring-red-500",
                )}
                placeholder={isEditMode ? "support@example.com" : ""}
              />
            </div>
            {validationErrors.appSupportDG && <p className="text-sm text-red-600">{validationErrors.appSupportDG}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center text-sm lg:text-base">
              Tags <InfoTooltip content="Tags associated with this application for categorization" />
            </Label>
            <div className="flex flex-wrap gap-2 min-h-[2.75rem] p-3 border border-gray-300 rounded-md bg-white">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {tag}
                  {isEditMode && (
                    <button
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      onClick={() => handleRemoveTag(index)}
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 text-xs border-dashed border-gray-400 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                  onClick={handleAddTag}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-blue-800 font-semibold mb-3 text-sm lg:text-base">Support Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-blue-700">L3 Support Contact:</span>{" "}
            <span className="text-blue-600 break-words">{formData.l3SupportContact || "Not assigned"}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Problem Coordinator:</span>{" "}
            <span className="text-blue-600 break-words">{formData.problemCoordinatorLead || "Not assigned"}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Portfolio Delegate:</span>{" "}
            <span className="text-blue-600 break-words">{formData.portfolioDelegate || "Not assigned"}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Total Tags:</span>{" "}
            <span className="text-blue-600">{formData.tags.length}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOperationHours = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Clock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-orange-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">Operation Hours</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Configure AIT hours of operation and shift management for this application
        </p>
      </div>

      {/* Operation Hours Configuration */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-orange-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Weekly Schedule Configuration
          </h4>
        </div>

        <div className="space-y-6">
          {formData.operationHours.map((day, dayIndex) => (
            <Card key={day.day} className="shadow-sm">
              <div className="p-4 lg:p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h5 className="font-semibold text-gray-900 text-base lg:text-lg">{day.day}</h5>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddShift(dayIndex)}
                    className="flex items-center space-x-2 h-8 px-3 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Shift</span>
                  </Button>
                )}
              </div>
              <CardContent className="p-0">
                {day.shifts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-25">
                          <TableHead className="w-[20%] font-medium">Shift Name</TableHead>
                          <TableHead className="w-[18%] font-medium">Start Time</TableHead>
                          <TableHead className="w-[4%] text-center font-medium">to</TableHead>
                          <TableHead className="w-[18%] font-medium">End Time</TableHead>
                          <TableHead className="w-[30%] font-medium">Timezone</TableHead>
                          {isEditMode && <TableHead className="w-[10%] font-medium">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {day.shifts.map((shift, shiftIndex) => (
                          <TableRow key={shift.id} className="hover:bg-gray-50">
                            <TableCell className="py-3">
                              {isEditMode ? (
                                <Input
                                  value={shift.name}
                                  onChange={(e) =>
                                    handleOperationHoursChange(dayIndex, shiftIndex, "name", e.target.value)
                                  }
                                  className="h-9 text-sm"
                                  placeholder="Enter shift name"
                                />
                              ) : (
                                <span className="text-sm">{shift.name || "—"}</span>
                              )}
                            </TableCell>
                            <TableCell className="py-3">
                              {isEditMode ? (
                                <Input
                                  value={shift.startTime}
                                  onChange={(e) =>
                                    handleOperationHoursChange(dayIndex, shiftIndex, "startTime", e.target.value)
                                  }
                                  className={cn(
                                    "h-9 text-sm",
                                    validationErrors[`${dayIndex}-${shiftIndex}-startTime`] && "border-red-300",
                                  )}
                                  placeholder="9:00 AM"
                                />
                              ) : (
                                <span className="text-sm">{shift.startTime}</span>
                              )}
                              {validationErrors[`${dayIndex}-${shiftIndex}-startTime`] && (
                                <p className="text-xs text-red-600 mt-1">
                                  {validationErrors[`${dayIndex}-${shiftIndex}-startTime`]}
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="py-3 text-center text-gray-500 text-sm">to</TableCell>
                            <TableCell className="py-3">
                              {isEditMode ? (
                                <Input
                                  value={shift.endTime}
                                  onChange={(e) =>
                                    handleOperationHoursChange(dayIndex, shiftIndex, "endTime", e.target.value)
                                  }
                                  className={cn(
                                    "h-9 text-sm",
                                    validationErrors[`${dayIndex}-${shiftIndex}-endTime`] && "border-red-300",
                                  )}
                                  placeholder="5:00 PM"
                                />
                              ) : (
                                <span className="text-sm">{shift.endTime}</span>
                              )}
                              {validationErrors[`${dayIndex}-${shiftIndex}-endTime`] && (
                                <p className="text-xs text-red-600 mt-1">
                                  {validationErrors[`${dayIndex}-${shiftIndex}-endTime`]}
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="py-3">
                              <span className="text-sm text-gray-600">{shift.timezone}</span>
                            </TableCell>
                            {isEditMode && (
                              <TableCell className="py-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveShift(dayIndex, shiftIndex)}
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No Hours have been defined</p>
                    {isEditMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddShift(dayIndex)}
                        className="mt-4 flex items-center space-x-2 mx-auto"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add First Shift</span>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <h4 className="text-orange-800 font-semibold mb-3 text-sm lg:text-base">Operation Hours Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-orange-700">Total Days Configured:</span>{" "}
            <span className="text-orange-600">
              {formData.operationHours.filter((day) => day.shifts.length > 0).length}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">Total Shifts:</span>{" "}
            <span className="text-orange-600">
              {formData.operationHours.reduce((total, day) => total + day.shifts.length, 0)}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">Weekend Coverage:</span>{" "}
            <span className="text-orange-600">
              {formData.operationHours.filter(
                (day) => (day.day === "Saturday" || day.day === "Sunday") && day.shifts.length > 0,
              ).length > 0
                ? "Yes"
                : "No"}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">Last Updated:</span>{" "}
            <span className="text-orange-600">Oct 30, 2024, 2:36:48 PM</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderSupportCoordination()
      case 1:
        return renderOperationHours()
      default:
        return renderSupportCoordination()
    }
  }

  return (
    <div className="w-full">
      {/* Ultra-wide responsive container */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto p-4 lg:p-6 xl:p-8">
        {/* Panel Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Additional Details</h2>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs lg:text-sm",
                    isEditMode ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800",
                  )}
                >
                  {isEditMode ? "Edit Mode" : "View Mode"}
                </Badge>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Configure support information and operational hours for this application
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">
                Section {currentSection + 1} of {configurationSections.length}
              </span>
              <div className="w-full sm:w-32 lg:w-48">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
            {!isEditMode ? (
              <Button onClick={handleEditToggle} className="flex items-center space-x-2 h-9 lg:h-10">
                <Edit className="h-4 w-4" />
                <span>Edit Configuration</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="flex items-center space-x-2 h-9 lg:h-10 bg-green-600 hover:bg-green-700"
                  disabled={!hasUnsavedChanges || Object.keys(validationErrors).length > 0}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  className="flex items-center space-x-2 h-9 lg:h-10"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}
            <Button variant="outline" className="flex items-center space-x-2 h-9 lg:h-10">
              <Eye className="h-4 w-4" />
              <span>View History</span>
            </Button>
          </div>

          {/* Validation Errors Alert */}
          {Object.keys(validationErrors).length > 0 && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Please correct the validation errors before saving.
              </AlertDescription>
            </Alert>
          )}

          {/* Section Navigator */}
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-max lg:min-w-0 lg:justify-center xl:justify-between gap-2 lg:gap-4">
              {configurationSections.map((section, index) => {
                const Icon = section.icon
                const isActive = index === currentSection

                return (
                  <div key={section.id} className="flex items-center">
                    <button
                      onClick={() => handleSectionClick(index)}
                      className={cn(
                        "flex flex-col items-center space-y-1 lg:space-y-2 p-2 lg:p-3 rounded-lg transition-all duration-200 min-w-[80px] lg:min-w-[120px]",
                        isActive && "bg-blue-50 border-2 border-blue-200",
                        !isActive && "hover:bg-gray-50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-all duration-200",
                          isActive && "bg-blue-500 text-white",
                          !isActive && "bg-gray-200 text-gray-600",
                        )}
                      >
                        <Icon className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            "text-xs lg:text-sm xl:text-base font-medium",
                            isActive && "text-blue-700",
                            !isActive && "text-gray-600",
                          )}
                        >
                          {section.title}
                        </div>
                        <div className="text-xs text-gray-500 hidden lg:block">{section.description}</div>
                      </div>
                    </button>
                    {index < configurationSections.length - 1 && (
                      <div className="w-4 lg:w-8 xl:w-12 h-px bg-gray-300 mx-1 lg:mx-2" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-10">{renderCurrentSection()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 lg:mt-8 gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className="flex items-center space-x-2 h-9 lg:h-10 xl:h-11 w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Section</span>
          </Button>

          <div className="flex items-center space-x-2">
            {configurationSections.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-200",
                  index === currentSection && "bg-blue-500",
                  index !== currentSection && "bg-gray-300",
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentSection === configurationSections.length - 1}
            className="flex items-center space-x-2 h-9 lg:h-10 xl:h-11 w-full sm:w-auto"
          >
            <span>Next Section</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-yellow-800 text-sm">
                You have unsaved changes. Remember to save before leaving.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
