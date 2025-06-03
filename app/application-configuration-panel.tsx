"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Info,
  FileText,
  Users,
  Headphones,
  MapPin,
  Edit,
  Save,
  X,
  Eye,
  AlertTriangle,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ValidationProvider, useValidation } from "@/lib/validation/validation-context"
import { ValidationSummary } from "@/components/validation/validation-summary"
import { FieldError } from "@/components/validation/field-error"
import { SectionIndicator } from "@/components/validation/section-indicator"

// Configuration sections
const configurationSections = [
  {
    id: "application-details",
    title: "Application Details",
    description: "Basic application information and technical specifications",
    icon: FileText,
    color: "blue",
  },
  {
    id: "organization-alignment",
    title: "Organization Alignment",
    description: "Organizational contacts and business structure",
    icon: Users,
    color: "green",
  },
  {
    id: "support-alignment",
    title: "Support Alignment",
    description: "Support team configuration and contacts",
    icon: Headphones,
    color: "purple",
  },
  {
    id: "other",
    title: "Other Information",
    description: "Additional metadata and tracking information",
    icon: MapPin,
    color: "orange",
  },
]

function ApplicationConfigurationPanelContent() {
  // Panel state
  const [currentSection, setCurrentSection] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Validation context
  const {
    validateSection,
    validateAllSections,
    clearSectionErrors,
    getSectionErrors,
    isSectionValid,
    hasAnyErrors,
    setValidationMode,
    state: validationState,
  } = useValidation()

  // Application data state
  const [applicationData, setApplicationData] = useState({
    applicationDetails: {
      applicationId: "100",
      applicationName: "Account Analysis Receivables (AAR)",
      shortName: "AAR",
      region: "apac-latam",
      twoDot: "VM",
      twoDotDesc: "GCIB AND GTS TECH",
      threeDot: "VMB",
      threeDotDesc: "GCIB AND GTS TECH",
      description:
        "Performs all billing and receivables functions for analyzed accounts. It provides a GUI interface for billed accounts to recognize income. Collections are done via direct debit of customer accounts or by checks remitted to Bank Physical Lockboxes.",
      rto: "tier-5-24-48",
      rpo: "tier-5-daily-backup",
      rtoApprover: "Rodriguez, Maria C.",
      rtoApproveDate: "2024-09-20",
      usesMainframe: "no",
      applicationHosting: "in-house",
      status: "In Production",
    },
    organizationAlignment: {
      techExec: "Thompson, Sarah K.",
      managementContact: "Chen, Michael R.",
      applicationManager: "Williams, Jennifer L.",
      portfolio: "apac",
      portfolioLead: "Anderson, David M.",
      team: "Australia Apps",
      organization: "gcib",
      lineOfBusiness: "treasury-payments",
      aligningOrg: "gcib-gts-tech",
    },
    supportAlignment: {
      apsSupport: "Kumar, Vipin",
      apsTechnicalLead: "Mengupta, Venkata Kumar",
      l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
      l2SupportContact: "Martinez, Carlos",
      supportContact: "Johnson, Emily R.",
      supportContactEmail: "emily.johnson@bank.com",
      bpsSupported: "yes",
      supportModel: "bps-24x7",
      escalationPath: "L1 → L2 Support Group → APS Support Manager → APS Technical Lead",
      supportRegion: "apac",
      supportTimezone: "asia-pacific",
    },
    otherInformation: {
      updatedBy: "Kumar, Vipin",
      updatedDate: "Oct 30, 2024, 2:36:48 PM",
      lastAttestedDate: "Oct 24, 2024, 10:25:31 AM",
      attestedBy: "Kumar, Vipin",
      nextDueAttestedDate: "Mar 31, 2025, 12:00:00 AM",
      createdBy: "Martinez, Carlos",
      createdDate: "Sep 15, 2024, 9:15:22 AM",
      version: "v2.1.3",
    },
  })

  // Calculate progress through sections
  const progress = ((currentSection + 1) / configurationSections.length) * 100

  // Set validation mode to trigger on blur for immediate feedback
  useEffect(() => {
    setValidationMode("onBlur")
  }, [setValidationMode])

  // Form change handler with validation
  const handleInputChange = async (section: keyof typeof applicationData, field: string, value: string) => {
    const updatedData = {
      ...applicationData,
      [section]: {
        ...applicationData[section],
        [field]: value,
      },
    }

    setApplicationData(updatedData)
    setHasUnsavedChanges(true)

    // Validate the current section if in edit mode
    if (isEditMode && validationState.validationMode === "onChange") {
      const sectionIndex = Object.keys(applicationData).indexOf(section)
      await validateSection(sectionIndex, updatedData)
    }
  }

  // Handle field blur for validation
  const handleFieldBlur = async (section: keyof typeof applicationData) => {
    if (isEditMode && validationState.validationMode === "onBlur") {
      const sectionIndex = Object.keys(applicationData).indexOf(section)
      await validateSection(sectionIndex, applicationData)
    }
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

    if (!isEditMode) {
      // Clear all validation errors when entering edit mode
      Object.keys(applicationData).forEach((_, index) => {
        clearSectionErrors(index)
      })
    }
  }

  const handleSave = async () => {
    // Validate all sections before saving
    const isValid = await validateAllSections(applicationData)

    if (!isValid) {
      // Show validation summary and don't save
      return
    }

    // Save logic here
    setIsEditMode(false)
    setHasUnsavedChanges(false)
    // Show success message
    console.log("Application data saved successfully")
  }

  // Get field error for a specific field
  const getFieldError = (section: number, fieldName: string): string | undefined => {
    const errors = getSectionErrors(section)
    return errors.find((error) => error.field === fieldName)?.message
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

  // Enhanced input component with validation
  const ValidatedInput = ({
    section,
    field,
    value,
    onChange,
    onBlur,
    disabled,
    className,
    ...props
  }: {
    section: number
    field: string
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    disabled?: boolean
    className?: string
    [key: string]: any
  }) => {
    const error = getFieldError(section, field)
    const hasError = !!error

    return (
      <div className="space-y-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            className,
            hasError && "border-red-300 focus:ring-red-500 focus:border-red-500",
            !disabled && !hasError && "focus:ring-2 focus:ring-blue-500",
          )}
          {...props}
        />
        <FieldError error={error} />
      </div>
    )
  }

  // Section renderers with validation
  const renderApplicationDetails = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Application Details
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Basic information and technical specifications for this application
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Basic Information</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="applicationId" className="flex items-center text-sm lg:text-base">
              Application ID <InfoTooltip content="Unique identifier for the application" />
            </Label>
            <Input
              id="applicationId"
              value={applicationData.applicationDetails.applicationId}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="applicationName" className="flex items-center text-sm lg:text-base">
              Application Name <InfoTooltip content="Full name of the application" />
            </Label>
            <ValidatedInput
              section={0}
              field="applicationName"
              id="applicationName"
              value={applicationData.applicationDetails.applicationName}
              onChange={(value) => handleInputChange("applicationDetails", "applicationName", value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortName" className="flex items-center text-sm lg:text-base">
              Short Name <InfoTooltip content="Abbreviated name for the application" />
            </Label>
            <ValidatedInput
              section={0}
              field="shortName"
              id="shortName"
              value={applicationData.applicationDetails.shortName}
              onChange={(value) => handleInputChange("applicationDetails", "shortName", value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="flex items-center text-sm lg:text-base">
              Region <InfoTooltip content="Geographic region where the application operates" />
            </Label>
            <Select
              value={applicationData.applicationDetails.region}
              onValueChange={(value) => handleInputChange("applicationDetails", "region", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
                  getFieldError(0, "region") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apac-latam">APAC, LATAM</SelectItem>
                <SelectItem value="emea">EMEA</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(0, "region")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center text-sm lg:text-base">
              Status <InfoTooltip content="Current application status" />
            </Label>
            <div className="flex items-center h-9 lg:h-10 xl:h-11">
              <Badge
                variant="default"
                className={cn(
                  "text-xs lg:text-sm",
                  applicationData.applicationDetails.status === "In Production" && "bg-green-100 text-green-800",
                  applicationData.applicationDetails.status === "Retired" && "bg-gray-100 text-gray-800",
                )}
              >
                {applicationData.applicationDetails.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twoDot" className="flex items-center text-sm lg:text-base">
              Two Dot <InfoTooltip content="Two-level application categorization code" />
            </Label>
            <ValidatedInput
              section={0}
              field="twoDot"
              id="twoDot"
              value={applicationData.applicationDetails.twoDot}
              onChange={(value) => handleInputChange("applicationDetails", "twoDot", value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twoDotDesc" className="flex items-center text-sm lg:text-base">
              Two Dot Description <InfoTooltip content="Description of the two-dot categorization" />
            </Label>
            <ValidatedInput
              section={0}
              field="twoDotDesc"
              id="twoDotDesc"
              value={applicationData.applicationDetails.twoDotDesc}
              onChange={(value) => handleInputChange("applicationDetails", "twoDotDesc", value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threeDot" className="flex items-center text-sm lg:text-base">
              Three Dot <InfoTooltip content="Three-level application categorization code" />
            </Label>
            <ValidatedInput
              section={0}
              field="threeDot"
              id="threeDot"
              value={applicationData.applicationDetails.threeDot}
              onChange={(value) => handleInputChange("applicationDetails", "threeDot", value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threeDotDesc" className="flex items-center text-sm lg:text-base">
              Three Dot Description <InfoTooltip content="Description of the three-dot categorization" />
            </Label>
            <ValidatedInput
              section={0}
              field="threeDotDesc"
              id="threeDotDesc"
              value={applicationData.applicationDetails.threeDotDesc}
              onChange={(value) => handleInputChange("applicationDetails", "threeDotDesc", value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center text-sm lg:text-base">
            Description <InfoTooltip content="Detailed description of the application functionality and purpose" />
          </Label>
          <div className="space-y-1">
            <Textarea
              id="description"
              value={applicationData.applicationDetails.description}
              onChange={(e) => handleInputChange("applicationDetails", "description", e.target.value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className={cn(
                "min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] text-sm lg:text-base",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
                getFieldError(0, "description") && "border-red-300 focus:ring-red-500",
              )}
            />
            <FieldError error={getFieldError(0, "description")} />
          </div>
        </div>
      </div>

      {/* Recovery & Performance Objectives Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Recovery & Performance Objectives
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="rto" className="flex items-center text-sm lg:text-base">
              RTO (Recovery Time Objective) <InfoTooltip content="Maximum acceptable time to restore service" />
            </Label>
            <Select
              value={applicationData.applicationDetails.rto}
              onValueChange={(value) => handleInputChange("applicationDetails", "rto", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
                  getFieldError(0, "rto") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tier-1-immediate">Tier 1: Immediate (0-15 minutes)</SelectItem>
                <SelectItem value="tier-2-15min-2hr">Tier 2: 15 minutes to 2 hours</SelectItem>
                <SelectItem value="tier-3-2hr-8hr">Tier 3: 2 hours to 8 hours</SelectItem>
                <SelectItem value="tier-4-8hr-24hr">Tier 4: 8 hours to 24 hours</SelectItem>
                <SelectItem value="tier-5-24-48">Tier 5: Greater than 24 hours, up to 48 hours</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(0, "rto")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rpo" className="flex items-center text-sm lg:text-base">
              RPO (Recovery Point Objective) <InfoTooltip content="Maximum acceptable amount of data loss" />
            </Label>
            <Select
              value={applicationData.applicationDetails.rpo}
              onValueChange={(value) => handleInputChange("applicationDetails", "rpo", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
                  getFieldError(0, "rpo") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tier-1-no-loss">Tier 1: No data loss (Real-time replication)</SelectItem>
                <SelectItem value="tier-2-15min">Tier 2: Up to 15 minutes data loss</SelectItem>
                <SelectItem value="tier-3-1hr">Tier 3: Up to 1 hour data loss</SelectItem>
                <SelectItem value="tier-4-4hr">Tier 4: Up to 4 hours data loss</SelectItem>
                <SelectItem value="tier-5-daily-backup">Tier 5: Daily backup (4-24 hours data loss)</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(0, "rpo")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rtoApprover" className="flex items-center text-sm lg:text-base">
              RTO/RPO Approver <InfoTooltip content="Person who approved the RTO/RPO settings" />
            </Label>
            <ValidatedInput
              section={0}
              field="rtoApprover"
              id="rtoApprover"
              value={applicationData.applicationDetails.rtoApprover}
              onChange={(value) => handleInputChange("applicationDetails", "rtoApprover", value)}
              onBlur={() => handleFieldBlur("applicationDetails")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rtoApproveDate" className="flex items-center text-sm lg:text-base">
              RTO/RPO Approve Date <InfoTooltip content="Date when RTO/RPO was approved" />
            </Label>
            <div className="relative">
              <ValidatedInput
                section={0}
                field="rtoApproveDate"
                id="rtoApproveDate"
                type="date"
                value={applicationData.applicationDetails.rtoApproveDate}
                onChange={(value) => handleInputChange("applicationDetails", "rtoApproveDate", value)}
                onBlur={() => handleFieldBlur("applicationDetails")}
                disabled={!isEditMode}
                className="h-9 lg:h-10 xl:h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Technical Configuration Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Technical Configuration
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="usesMainframe" className="flex items-center text-sm lg:text-base">
              Uses Mainframe <InfoTooltip content="Whether the application uses mainframe technology" />
            </Label>
            <Select
              value={applicationData.applicationDetails.usesMainframe}
              onValueChange={(value) => handleInputChange("applicationDetails", "usesMainframe", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
                  getFieldError(0, "usesMainframe") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="partial">Partial (Some components)</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(0, "usesMainframe")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationHosting" className="flex items-center text-sm lg:text-base">
              Application Hosting <InfoTooltip content="Where and how the application is hosted" />
            </Label>
            <Select
              value={applicationData.applicationDetails.applicationHosting}
              onValueChange={(value) => handleInputChange("applicationDetails", "applicationHosting", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
                  getFieldError(0, "applicationHosting") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-house">In-house (Bank network)</SelectItem>
                <SelectItem value="cloud-public">Public Cloud</SelectItem>
                <SelectItem value="cloud-private">Private Cloud</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="third-party">Third-party hosted</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(0, "applicationHosting")} />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-blue-800 font-semibold mb-3 text-sm lg:text-base">Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-blue-700">RTO:</span>{" "}
            <span className="text-blue-600 break-words">
              {getRTODisplayValue(applicationData.applicationDetails.rto)}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">RPO:</span>{" "}
            <span className="text-blue-600 break-words">
              {getRPODisplayValue(applicationData.applicationDetails.rpo)}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Hosting:</span>{" "}
            <span className="text-blue-600 break-words">
              {getHostingDisplayValue(applicationData.applicationDetails.applicationHosting)}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Mainframe:</span>{" "}
            <span className="text-blue-600">
              {applicationData.applicationDetails.usesMainframe === "yes"
                ? "Yes"
                : applicationData.applicationDetails.usesMainframe === "no"
                  ? "No"
                  : "Partial"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  // Add the helper functions that were missing
  const getRTODisplayValue = (value: string) => {
    const rtoOptions: Record<string, string> = {
      "tier-1-immediate": "Tier 1: Immediate (0-15 minutes)",
      "tier-2-15min-2hr": "Tier 2: 15 minutes to 2 hours",
      "tier-3-2hr-8hr": "Tier 3: 2 hours to 8 hours",
      "tier-4-8hr-24hr": "Tier 4: 8 hours to 24 hours",
      "tier-5-24-48": "Tier 5: Greater than 24 hours, up to and including 48 hours",
    }
    return rtoOptions[value] || value
  }

  const getRPODisplayValue = (value: string) => {
    const rpoOptions: Record<string, string> = {
      "tier-1-no-loss": "Tier 1: No data loss (Real-time replication)",
      "tier-2-15min": "Tier 2: Up to 15 minutes data loss",
      "tier-3-1hr": "Tier 3: Up to 1 hour data loss",
      "tier-4-4hr": "Tier 4: Up to 4 hours data loss",
      "tier-5-daily-backup": "Tier 5: Daily backup: Greater than 4 hours, up to and including 24 hours",
    }
    return rpoOptions[value] || value
  }

  const getHostingDisplayValue = (value: string) => {
    const hostingOptions: Record<string, string> = {
      "in-house": "In-house (Hosted entirely inside the bank network)",
      "cloud-public": "Public Cloud (AWS, Azure, GCP)",
      "cloud-private": "Private Cloud",
      hybrid: "Hybrid (Mix of on-premise and cloud)",
      "third-party": "Third-party hosted",
    }
    return hostingOptions[value] || value
  }

  // Similar implementations for other sections...
  const renderOrganizationAlignment = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Organization Alignment
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Organizational structure, key contacts, and business alignment
        </p>
      </div>

      {/* Key Contacts Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Key Contacts</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="techExec" className="flex items-center text-sm lg:text-base">
              Tech Exec <InfoTooltip content="Technology Executive responsible for the application" />
            </Label>
            <ValidatedInput
              section={1}
              field="techExec"
              id="techExec"
              value={applicationData.organizationAlignment.techExec}
              onChange={(value) => handleInputChange("organizationAlignment", "techExec", value)}
              onBlur={() => handleFieldBlur("organizationAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="managementContact" className="flex items-center text-sm lg:text-base">
              Management Contact <InfoTooltip content="Primary management contact for the application" />
            </Label>
            <ValidatedInput
              section={1}
              field="managementContact"
              id="managementContact"
              value={applicationData.organizationAlignment.managementContact}
              onChange={(value) => handleInputChange("organizationAlignment", "managementContact", value)}
              onBlur={() => handleFieldBlur("organizationAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="applicationManager" className="flex items-center text-sm lg:text-base">
              Application Manager <InfoTooltip content="Manager responsible for application operations" />
            </Label>
            <ValidatedInput
              section={1}
              field="applicationManager"
              id="applicationManager"
              value={applicationData.organizationAlignment.applicationManager}
              onChange={(value) => handleInputChange("organizationAlignment", "applicationManager", value)}
              onBlur={() => handleFieldBlur("organizationAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>
        </div>
      </div>

      {/* Portfolio & Team Structure Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Portfolio & Team Structure
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="portfolio" className="flex items-center text-sm lg:text-base">
              Portfolio <InfoTooltip content="Portfolio this application belongs to" />
            </Label>
            <Select
              value={applicationData.organizationAlignment.portfolio}
              onValueChange={(value) => handleInputChange("organizationAlignment", "portfolio", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
                  getFieldError(1, "portfolio") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apac">APAC</SelectItem>
                <SelectItem value="emea">EMEA</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(1, "portfolio")} />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="portfolioLead" className="flex items-center text-sm lg:text-base">
              Portfolio Lead <InfoTooltip content="Lead person for the portfolio" />
            </Label>
            <ValidatedInput
              section={1}
              field="portfolioLead"
              id="portfolioLead"
              value={applicationData.organizationAlignment.portfolioLead}
              onChange={(value) => handleInputChange("organizationAlignment", "portfolioLead", value)}
              onBlur={() => handleFieldBlur("organizationAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="team" className="flex items-center text-sm lg:text-base">
              Team <InfoTooltip content="Team responsible for the application" />
            </Label>
            <ValidatedInput
              section={1}
              field="team"
              id="team"
              value={applicationData.organizationAlignment.team}
              onChange={(value) => handleInputChange("organizationAlignment", "team", value)}
              onBlur={() => handleFieldBlur("organizationAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>
        </div>
      </div>

      {/* Business Alignment Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Business Alignment</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="organization" className="flex items-center text-sm lg:text-base">
              Organization <InfoTooltip content="Primary organizational unit or division" />
            </Label>
            <Select
              value={applicationData.organizationAlignment.organization}
              onValueChange={(value) => handleInputChange("organizationAlignment", "organization", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
                  getFieldError(1, "organization") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gcib">Global Corporate & Investment Banking (GCIB)</SelectItem>
                <SelectItem value="gts">Global Transaction Services (GTS)</SelectItem>
                <SelectItem value="ccb">Consumer & Community Banking (CCB)</SelectItem>
                <SelectItem value="pbwm">Private Bank & Wealth Management (PBWM)</SelectItem>
                <SelectItem value="operations">Operations & Technology</SelectItem>
                <SelectItem value="risk">Risk Management</SelectItem>
                <SelectItem value="compliance">Compliance & Controls</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(1, "organization")} />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="lineOfBusiness" className="flex items-center text-sm lg:text-base">
              Line of Business <InfoTooltip content="Specific business line or function" />
            </Label>
            <Select
              value={applicationData.organizationAlignment.lineOfBusiness}
              onValueChange={(value) => handleInputChange("organizationAlignment", "lineOfBusiness", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
                  getFieldError(1, "lineOfBusiness") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="treasury-payments">Treasury & Trade Solutions</SelectItem>
                <SelectItem value="securities-services">Securities & Fund Services</SelectItem>
                <SelectItem value="commercial-cards">Commercial Cards</SelectItem>
                <SelectItem value="cash-management">Cash Management</SelectItem>
                <SelectItem value="trade-finance">Trade Finance</SelectItem>
                <SelectItem value="foreign-exchange">Foreign Exchange</SelectItem>
                <SelectItem value="lending-services">Lending Services</SelectItem>
                <SelectItem value="investment-banking">Investment Banking</SelectItem>
                <SelectItem value="markets">Markets & Securities</SelectItem>
                <SelectItem value="private-banking">Private Banking</SelectItem>
                <SelectItem value="retail-banking">Retail Banking</SelectItem>
                <SelectItem value="credit-cards">Credit Cards</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(1, "lineOfBusiness")} />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="aligningOrg" className="flex items-center text-sm lg:text-base">
              Aligning Org <InfoTooltip content="Technology organization alignment" />
            </Label>
            <Select
              value={applicationData.organizationAlignment.aligningOrg}
              onValueChange={(value) => handleInputChange("organizationAlignment", "aligningOrg", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
                  getFieldError(1, "aligningOrg") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gcib-gts-tech">GCIB AND GTS TECH</SelectItem>
                <SelectItem value="ccb-tech">CCB TECHNOLOGY</SelectItem>
                <SelectItem value="pbwm-tech">PBWM TECHNOLOGY</SelectItem>
                <SelectItem value="enterprise-tech">ENTERPRISE TECHNOLOGY</SelectItem>
                <SelectItem value="infrastructure-tech">INFRASTRUCTURE TECHNOLOGY</SelectItem>
                <SelectItem value="cybersecurity-tech">CYBERSECURITY TECHNOLOGY</SelectItem>
                <SelectItem value="data-analytics-tech">DATA & ANALYTICS TECHNOLOGY</SelectItem>
                <SelectItem value="digital-tech">DIGITAL TECHNOLOGY</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(1, "aligningOrg")} />
          </div>
        </div>
      </div>

      {/* Organizational Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-green-800 font-semibold mb-3 text-sm lg:text-base">Organizational Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-green-700">Primary Organization:</span>{" "}
            <span className="text-green-600 break-words">
              {applicationData.organizationAlignment.organization
                ? applicationData.organizationAlignment.organization
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Line of Business:</span>{" "}
            <span className="text-green-600 break-words">
              {applicationData.organizationAlignment.lineOfBusiness
                ? applicationData.organizationAlignment.lineOfBusiness
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Tech Alignment:</span>{" "}
            <span className="text-green-600 break-words">
              {applicationData.organizationAlignment.aligningOrg
                ? applicationData.organizationAlignment.aligningOrg
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Portfolio:</span>{" "}
            <span className="text-green-600">
              {applicationData.organizationAlignment.portfolio
                ? applicationData.organizationAlignment.portfolio.toUpperCase()
                : "Not selected"}
            </span>
          </div>
        </div>

        {/* Contact Summary */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <h5 className="font-medium text-green-700 mb-2 text-xs lg:text-sm">Key Contacts</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-green-600 break-words">
                Tech Exec: {applicationData.organizationAlignment.techExec || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                Management: {applicationData.organizationAlignment.managementContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                App Manager: {applicationData.organizationAlignment.applicationManager || "Not assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSupportAlignment = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Headphones className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:h-10 text-purple-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Support Alignment
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Support team structure, contacts, and service delivery model
        </p>
      </div>

      {/* Support Management Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Support Management</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="apsSupport" className="flex items-center text-sm lg:text-base">
              APS Support Manager{" "}
              <InfoTooltip content="Application Production Support Manager responsible for overall support" />
            </Label>
            <ValidatedInput
              section={2}
              field="apsSupport"
              id="apsSupport"
              value={applicationData.supportAlignment.apsSupport}
              onChange={(value) => handleInputChange("supportAlignment", "apsSupport", value)}
              onBlur={() => handleFieldBlur("supportAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="apsTechnicalLead" className="flex items-center text-sm lg:text-base">
              APS Technical Lead <InfoTooltip content="Technical lead for Application Production Support" />
            </Label>
            <ValidatedInput
              section={2}
              field="apsTechnicalLead"
              id="apsTechnicalLead"
              value={applicationData.supportAlignment.apsTechnicalLead}
              onChange={(value) => handleInputChange("supportAlignment", "apsTechnicalLead", value)}
              onBlur={() => handleFieldBlur("supportAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="l2SupportGroup" className="flex items-center text-sm lg:text-base">
              L2 Support Group <InfoTooltip content="Level 2 support group identifier and team name" />
            </Label>
            <ValidatedInput
              section={2}
              field="l2SupportGroup"
              id="l2SupportGroup"
              value={applicationData.supportAlignment.l2SupportGroup}
              onChange={(value) => handleInputChange("supportAlignment", "l2SupportGroup", value)}
              onBlur={() => handleFieldBlur("supportAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>
        </div>
      </div>

      {/* Support Contacts Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Support Contacts</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="supportContact" className="flex items-center text-sm lg:text-base">
              Support Contact <InfoTooltip content="Primary support contact person for escalations and coordination" />
            </Label>
            <ValidatedInput
              section={2}
              field="supportContact"
              id="supportContact"
              value={applicationData.supportAlignment.supportContact}
              onChange={(value) => handleInputChange("supportAlignment", "supportContact", value)}
              onBlur={() => handleFieldBlur("supportAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportContactEmail" className="flex items-center text-sm lg:text-base">
              Support Contact Email <InfoTooltip content="Email address for the primary support contact" />
            </Label>
            <ValidatedInput
              section={2}
              field="supportContactEmail"
              id="supportContactEmail"
              type="email"
              value={applicationData.supportAlignment.supportContactEmail}
              onChange={(value) => handleInputChange("supportAlignment", "supportContactEmail", value)}
              onBlur={() => handleFieldBlur("supportAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="l2SupportContact" className="flex items-center text-sm lg:text-base">
              L2 Support Contact <InfoTooltip content="Level 2 support contact person for technical escalations" />
            </Label>
            <ValidatedInput
              section={2}
              field="l2SupportContact"
              id="l2SupportContact"
              value={applicationData.supportAlignment.l2SupportContact}
              onChange={(value) => handleInputChange("supportAlignment", "l2SupportContact", value)}
              onBlur={() => handleFieldBlur("supportAlignment")}
              disabled={!isEditMode}
              className="h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportRegion" className="flex items-center text-sm lg:text-base">
              Support Region <InfoTooltip content="Geographic region for support coverage" />
            </Label>
            <Select
              value={applicationData.supportAlignment.supportRegion}
              onValueChange={(value) => handleInputChange("supportAlignment", "supportRegion", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
                  getFieldError(2, "supportRegion") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apac">APAC</SelectItem>
                <SelectItem value="emea">EMEA</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="global">Global (24x7)</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(2, "supportRegion")} />
          </div>
        </div>
      </div>

      {/* Service Delivery Model Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Service Delivery Model
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="bpsSupported" className="flex items-center text-sm lg:text-base">
              BPS Supported <InfoTooltip content="Whether Business Process Support is available" />
            </Label>
            <Select
              value={applicationData.supportAlignment.bpsSupported}
              onValueChange={(value) => handleInputChange("supportAlignment", "bpsSupported", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
                  getFieldError(2, "bpsSupported") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(2, "bpsSupported")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportModel" className="flex items-center text-sm lg:text-base">
              Support Model <InfoTooltip content="Type of support model and coverage hours" />
            </Label>
            <Select
              value={applicationData.supportAlignment.supportModel}
              onValueChange={(value) => handleInputChange("supportAlignment", "supportModel", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
                  getFieldError(2, "supportModel") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bps-24x7">BPS - 24x7</SelectItem>
                <SelectItem value="bps-business-hours">BPS - Business Hours</SelectItem>
                <SelectItem value="standard-24x7">Standard - 24x7</SelectItem>
                <SelectItem value="standard-business-hours">Standard - Business Hours</SelectItem>
                <SelectItem value="on-demand">On-Demand</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(2, "supportModel")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportTimezone" className="flex items-center text-sm lg:text-base">
              Support Timezone <InfoTooltip content="Primary timezone for support operations" />
            </Label>
            <Select
              value={applicationData.supportAlignment.supportTimezone}
              onValueChange={(value) => handleInputChange("supportAlignment", "supportTimezone", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
                  getFieldError(2, "supportTimezone") && "border-red-300 focus:ring-red-500",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-pacific">Asia Pacific (GMT+8 to GMT+12)</SelectItem>
                <SelectItem value="europe-africa">Europe & Africa (GMT+0 to GMT+3)</SelectItem>
                <SelectItem value="americas">Americas (GMT-8 to GMT-3)</SelectItem>
                <SelectItem value="global">Global (Follow-the-Sun)</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={getFieldError(2, "supportTimezone")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="escalationPath" className="flex items-center text-sm lg:text-base">
            Escalation Path <InfoTooltip content="Detailed escalation procedure and contact hierarchy" />
          </Label>
          <div className="space-y-1">
            <Textarea
              id="escalationPath"
              value={applicationData.supportAlignment.escalationPath}
              onChange={(e) => handleInputChange("supportAlignment", "escalationPath", e.target.value)}
              onBlur={() => handleFieldBlur("supportAlignment")}
              disabled={!isEditMode}
              className={cn(
                "min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] text-sm lg:text-base",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-purple-500",
                getFieldError(2, "escalationPath") && "border-red-300 focus:ring-red-500",
              )}
            />
            <FieldError error={getFieldError(2, "escalationPath")} />
          </div>
        </div>
      </div>

      {/* Support Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-purple-800 font-semibold mb-3 text-sm lg:text-base">Support Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-purple-700">Support Model:</span>{" "}
            <span className="text-purple-600 break-words">
              {applicationData.supportAlignment.supportModel
                ? applicationData.supportAlignment.supportModel
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">BPS Supported:</span>{" "}
            <span className="text-purple-600">
              {applicationData.supportAlignment.bpsSupported === "yes"
                ? "Yes"
                : applicationData.supportAlignment.bpsSupported === "no"
                  ? "No"
                  : "Limited"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Support Region:</span>{" "}
            <span className="text-purple-600">
              {applicationData.supportAlignment.supportRegion
                ? applicationData.supportAlignment.supportRegion.toUpperCase()
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Timezone:</span>{" "}
            <span className="text-purple-600 break-words">
              {applicationData.supportAlignment.supportTimezone
                ? applicationData.supportAlignment.supportTimezone
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
        </div>

        {/* Support Contacts Summary */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <h5 className="font-medium text-purple-700 mb-2 text-xs lg:text-sm">Support Team</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-purple-600 break-words">
                APS Manager: {applicationData.supportAlignment.apsSupport || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Technical Lead: {applicationData.supportAlignment.apsTechnicalLead || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Support Contact: {applicationData.supportAlignment.supportContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                L2 Contact: {applicationData.supportAlignment.l2SupportContact || "Not assigned"}
              </span>
            </div>
          </div>
          {applicationData.supportAlignment.supportContactEmail && (
            <div className="mt-2 text-xs lg:text-sm">
              <span className="text-purple-600 break-all">
                Primary Email: {applicationData.supportAlignment.supportContactEmail}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderOther = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <MapPin className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-orange-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Other Information
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Additional tracking and metadata information
        </p>
      </div>

      {/* Tracking Information Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-orange-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Tracking Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="updatedBy" className="flex items-center text-sm lg:text-base">
              Updated By <InfoTooltip content="Person who last updated this record" />
            </Label>
            <Input
              id="updatedBy"
              value={applicationData.otherInformation.updatedBy}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="updatedDate" className="flex items-center text-sm lg:text-base">
              Updated Date <InfoTooltip content="Date when this record was last updated" />
            </Label>
            <Input
              id="updatedDate"
              value={applicationData.otherInformation.updatedDate}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version" className="flex items-center text-sm lg:text-base">
              Version <InfoTooltip content="Current version of the application record" />
            </Label>
            <Input
              id="version"
              value={applicationData.otherInformation.version}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>
        </div>
      </div>

      {/* Attestation Information Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Attestation Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="lastAttestedDate" className="flex items-center text-sm lg:text-base">
              Last Attested Date <InfoTooltip content="Date when this record was last attested" />
            </Label>
            <Input
              id="lastAttestedDate"
              value={applicationData.otherInformation.lastAttestedDate}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attestedBy" className="flex items-center text-sm lg:text-base">
              Attested By <InfoTooltip content="Person who last attested this record" />
            </Label>
            <Input
              id="attestedBy"
              value={applicationData.otherInformation.attestedBy}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextDueAttestedDate" className="flex items-center text-sm lg:text-base">
              Next Due Attested Date <InfoTooltip content="Next date when attestation is due" />
            </Label>
            <Input
              id="nextDueAttestedDate"
              value={applicationData.otherInformation.nextDueAttestedDate}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>
        </div>
      </div>

      {/* Creation Information Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Creation Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="createdBy" className="flex items-center text-sm lg:text-base">
              Created By <InfoTooltip content="Person who originally created this record" />
            </Label>
            <Input
              id="createdBy"
              value={applicationData.otherInformation.createdBy}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="createdDate" className="flex items-center text-sm lg:text-base">
              Created Date <InfoTooltip content="Date when this record was originally created" />
            </Label>
            <Input
              id="createdDate"
              value={applicationData.otherInformation.createdDate}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
          </div>
          <div>
            <h4 className="text-orange-800 font-semibold text-sm lg:text-base">Configuration Review Complete</h4>
            <p className="text-orange-700 text-xs lg:text-sm">
              All application configuration sections have been reviewed.{" "}
              {isEditMode
                ? "Save your changes to update the application record."
                : "Click Edit to modify any settings."}
            </p>
          </div>
        </div>

        {/* Record Summary */}
        <div className="mt-4 pt-4 border-t border-orange-200">
          <h5 className="font-medium text-orange-700 mb-2 text-xs lg:text-sm">Record Summary</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-orange-600">Version: {applicationData.otherInformation.version}</span>
            </div>
            <div>
              <span className="text-orange-600">
                Last Updated: {new Date(applicationData.otherInformation.updatedDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-orange-600">
                Last Attested: {new Date(applicationData.otherInformation.lastAttestedDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-orange-600">
                Next Attestation: {new Date(applicationData.otherInformation.nextDueAttestedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderApplicationDetails()
      case 1:
        return renderOrganizationAlignment()
      case 2:
        return renderSupportAlignment()
      case 3:
        return renderOther()
      default:
        return renderApplicationDetails()
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
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                  Application Configuration Panel
                </h2>
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
                {applicationData.applicationDetails.applicationId} -{" "}
                {applicationData.applicationDetails.applicationName}
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

          {/* Validation Summary */}
          {isEditMode && hasAnyErrors() && (
            <div className="mb-4 lg:mb-6">
              <ValidationSummary onSectionClick={handleSectionClick} />
            </div>
          )}

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
                  disabled={!hasUnsavedChanges || hasAnyErrors()}
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

          {/* Section Navigator with Validation Indicators */}
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-max lg:min-w-0 lg:justify-center xl:justify-between gap-2 lg:gap-4">
              {configurationSections.map((section, index) => {
                const Icon = section.icon
                const isActive = index === currentSection
                const sectionValid = isSectionValid(index)
                const sectionErrors = getSectionErrors(index)

                return (
                  <div key={section.id} className="flex items-center">
                    <button
                      onClick={() => handleSectionClick(index)}
                      className={cn(
                        "flex flex-col items-center space-y-1 lg:space-y-2 p-2 lg:p-3 rounded-lg transition-all duration-200 min-w-[80px] lg:min-w-[120px] relative",
                        isActive && "bg-blue-50 border-2 border-blue-200",
                        !isActive && "hover:bg-gray-50",
                        !sectionValid && isEditMode && "bg-red-50 border-2 border-red-200",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-all duration-200 relative",
                          isActive && sectionValid && "bg-blue-500 text-white",
                          isActive && !sectionValid && isEditMode && "bg-red-500 text-white",
                          !isActive && sectionValid && "bg-gray-200 text-gray-600",
                          !isActive && !sectionValid && isEditMode && "bg-red-200 text-red-600",
                        )}
                      >
                        <Icon className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                        {!sectionValid && isEditMode && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <SectionIndicator
                          section={index}
                          title={section.title}
                          className="text-xs lg:text-sm xl:text-base font-medium"
                        />
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
                  index !== currentSection && isSectionValid(index) && "bg-gray-300",
                  index !== currentSection && !isSectionValid(index) && isEditMode && "bg-red-300",
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
                You have unsaved changes.{" "}
                {hasAnyErrors() ? "Please fix validation errors before saving." : "Remember to save before leaving."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ApplicationConfigurationPanel() {
  return (
    <ValidationProvider>
      <ApplicationConfigurationPanelContent />
    </ValidationProvider>
  )
}
