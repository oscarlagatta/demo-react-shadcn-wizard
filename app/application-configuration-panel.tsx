"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  FileText,
  Users,
  Headphones,
  MapPin,
  Calendar,
  Mail,
  Edit,
  Save,
  X,
  Eye,
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

export default function ApplicationConfigurationPanel() {
  // Panel state
  const [currentSection, setCurrentSection] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Application data state - populated from selected application
  const [applicationData, setApplicationData] = useState({
    // Application Details
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

    // Organization Alignment
    techExec: "Thompson, Sarah K.",
    managementContact: "Chen, Michael R.",
    applicationManager: "Williams, Jennifer L.",
    portfolio: "apac",
    portfolioLead: "Anderson, David M.",
    team: "Australia Apps",
    organization: "gcib",
    lineOfBusiness: "treasury-payments",
    aligningOrg: "gcib-gts-tech",

    // Support Alignment
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

    // Other (read-only tracking)
    updatedBy: "Kumar, Vipin",
    updatedDate: "Oct 30, 2024, 2:36:48 PM",
    lastAttestedDate: "Oct 24, 2024, 10:25:31 AM",
    attestedBy: "Kumar, Vipin",
    nextDueAttestedDate: "Mar 31, 2025, 12:00:00 AM",
    createdBy: "Martinez, Carlos",
    createdDate: "Sep 15, 2024, 9:15:22 AM",
    version: "v2.1.3",
  })

  // Calculate progress through sections
  const progress = ((currentSection + 1) / configurationSections.length) * 100

  // Form change handler
  const handleInputChange = (field: string, value: string) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
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
      // Show confirmation dialog in real app
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
      if (!confirmDiscard) return
    }
    setIsEditMode(!isEditMode)
    setHasUnsavedChanges(false)
  }

  const handleSave = () => {
    // Save logic here
    setIsEditMode(false)
    setHasUnsavedChanges(false)
    // Show success message
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

  // Helper functions for display values
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

  // Section renderers
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
              value={applicationData.applicationId}
              readOnly
              className="bg-gray-50 h-9 lg:h-10 xl:h-11"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="applicationName" className="flex items-center text-sm lg:text-base">
              Application Name <InfoTooltip content="Full name of the application" />
            </Label>
            <Input
              id="applicationName"
              value={applicationData.applicationName}
              onChange={(e) => handleInputChange("applicationName", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortName" className="flex items-center text-sm lg:text-base">
              Short Name <InfoTooltip content="Abbreviated name for the application" />
            </Label>
            <Input
              id="shortName"
              value={applicationData.shortName}
              onChange={(e) => handleInputChange("shortName", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="flex items-center text-sm lg:text-base">
              Region <InfoTooltip content="Geographic region where the application operates" />
            </Label>
            <Select
              value={applicationData.region}
              onValueChange={(value) => handleInputChange("region", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
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
                  applicationData.status === "In Production" && "bg-green-100 text-green-800",
                  applicationData.status === "Retired" && "bg-gray-100 text-gray-800",
                )}
              >
                {applicationData.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twoDot" className="flex items-center text-sm lg:text-base">
              Two Dot <InfoTooltip content="Two-level application categorization code" />
            </Label>
            <Input
              id="twoDot"
              value={applicationData.twoDot}
              onChange={(e) => handleInputChange("twoDot", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twoDotDesc" className="flex items-center text-sm lg:text-base">
              Two Dot Description <InfoTooltip content="Description of the two-dot categorization" />
            </Label>
            <Input
              id="twoDotDesc"
              value={applicationData.twoDotDesc}
              onChange={(e) => handleInputChange("twoDotDesc", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threeDot" className="flex items-center text-sm lg:text-base">
              Three Dot <InfoTooltip content="Three-level application categorization code" />
            </Label>
            <Input
              id="threeDot"
              value={applicationData.threeDot}
              onChange={(e) => handleInputChange("threeDot", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threeDotDesc" className="flex items-center text-sm lg:text-base">
              Three Dot Description <InfoTooltip content="Description of the three-dot categorization" />
            </Label>
            <Input
              id="threeDotDesc"
              value={applicationData.threeDotDesc}
              onChange={(e) => handleInputChange("threeDotDesc", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center text-sm lg:text-base">
            Description <InfoTooltip content="Detailed description of the application functionality and purpose" />
          </Label>
          <Textarea
            id="description"
            value={applicationData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            disabled={!isEditMode}
            className={cn(
              "min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] text-sm lg:text-base",
              !isEditMode && "bg-gray-50",
              isEditMode && "focus:ring-2 focus:ring-blue-500",
            )}
          />
        </div>
      </div>

      {/* Recovery & Performance Section */}
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
              value={applicationData.rto}
              onValueChange={(value) => handleInputChange("rto", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="rpo" className="flex items-center text-sm lg:text-base">
              RPO (Recovery Point Objective) <InfoTooltip content="Maximum acceptable amount of data loss" />
            </Label>
            <Select
              value={applicationData.rpo}
              onValueChange={(value) => handleInputChange("rpo", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="rtoApprover" className="flex items-center text-sm lg:text-base">
              RTO/RPO Approver <InfoTooltip content="Person who approved the RTO/RPO settings" />
            </Label>
            <Input
              id="rtoApprover"
              value={applicationData.rtoApprover}
              onChange={(e) => handleInputChange("rtoApprover", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-blue-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rtoApproveDate" className="flex items-center text-sm lg:text-base">
              RTO/RPO Approve Date <InfoTooltip content="Date when RTO/RPO was approved" />
            </Label>
            <div className="relative">
              <Input
                id="rtoApproveDate"
                type="date"
                value={applicationData.rtoApproveDate}
                onChange={(e) => handleInputChange("rtoApproveDate", e.target.value)}
                disabled={!isEditMode}
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
                )}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
              value={applicationData.usesMainframe}
              onValueChange={(value) => handleInputChange("usesMainframe", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationHosting" className="flex items-center text-sm lg:text-base">
              Application Hosting <InfoTooltip content="Where and how the application is hosted" />
            </Label>
            <Select
              value={applicationData.applicationHosting}
              onValueChange={(value) => handleInputChange("applicationHosting", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-blue-500",
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
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-blue-800 font-semibold mb-3 text-sm lg:text-base">Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-blue-700">RTO:</span>{" "}
            <span className="text-blue-600 break-words">{getRTODisplayValue(applicationData.rto)}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">RPO:</span>{" "}
            <span className="text-blue-600 break-words">{getRPODisplayValue(applicationData.rpo)}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Hosting:</span>{" "}
            <span className="text-blue-600 break-words">
              {getHostingDisplayValue(applicationData.applicationHosting)}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Mainframe:</span>{" "}
            <span className="text-blue-600">
              {applicationData.usesMainframe === "yes"
                ? "Yes"
                : applicationData.usesMainframe === "no"
                  ? "No"
                  : "Partial"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

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
            <Input
              id="techExec"
              value={applicationData.techExec}
              onChange={(e) => handleInputChange("techExec", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-green-500",
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="managementContact" className="flex items-center text-sm lg:text-base">
              Management Contact <InfoTooltip content="Primary management contact for the application" />
            </Label>
            <Input
              id="managementContact"
              value={applicationData.managementContact}
              onChange={(e) => handleInputChange("managementContact", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-green-500",
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="applicationManager" className="flex items-center text-sm lg:text-base">
              Application Manager <InfoTooltip content="Manager responsible for application operations" />
            </Label>
            <Input
              id="applicationManager"
              value={applicationData.applicationManager}
              onChange={(e) => handleInputChange("applicationManager", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-green-500",
              )}
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
              value={applicationData.portfolio}
              onValueChange={(value) => handleInputChange("portfolio", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
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
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="portfolioLead" className="flex items-center text-sm lg:text-base">
              Portfolio Lead <InfoTooltip content="Lead person for the portfolio" />
            </Label>
            <Input
              id="portfolioLead"
              value={applicationData.portfolioLead}
              onChange={(e) => handleInputChange("portfolioLead", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-green-500",
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="team" className="flex items-center text-sm lg:text-base">
              Team <InfoTooltip content="Team responsible for the application" />
            </Label>
            <Input
              id="team"
              value={applicationData.team}
              onChange={(e) => handleInputChange("team", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-green-500",
              )}
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
              value={applicationData.organization}
              onValueChange={(value) => handleInputChange("organization", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
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
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="lineOfBusiness" className="flex items-center text-sm lg:text-base">
              Line of Business <InfoTooltip content="Specific business line or function" />
            </Label>
            <Select
              value={applicationData.lineOfBusiness}
              onValueChange={(value) => handleInputChange("lineOfBusiness", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
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
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="aligningOrg" className="flex items-center text-sm lg:text-base">
              Aligning Org <InfoTooltip content="Technology organization alignment" />
            </Label>
            <Select
              value={applicationData.aligningOrg}
              onValueChange={(value) => handleInputChange("aligningOrg", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-green-500",
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
              {applicationData.organization
                ? applicationData.organization
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Line of Business:</span>{" "}
            <span className="text-green-600 break-words">
              {applicationData.lineOfBusiness
                ? applicationData.lineOfBusiness
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Tech Alignment:</span>{" "}
            <span className="text-green-600 break-words">
              {applicationData.aligningOrg
                ? applicationData.aligningOrg
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Portfolio:</span>{" "}
            <span className="text-green-600">
              {applicationData.portfolio ? applicationData.portfolio.toUpperCase() : "Not selected"}
            </span>
          </div>
        </div>

        {/* Contact Summary */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <h5 className="font-medium text-green-700 mb-2 text-xs lg:text-sm">Key Contacts</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-green-600 break-words">
                Tech Exec: {applicationData.techExec || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                Management: {applicationData.managementContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                App Manager: {applicationData.applicationManager || "Not assigned"}
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
          <Headphones className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-purple-600" />
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
            <Input
              id="apsSupport"
              value={applicationData.apsSupport}
              onChange={(e) => handleInputChange("apsSupport", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-purple-500",
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="apsTechnicalLead" className="flex items-center text-sm lg:text-base">
              APS Technical Lead <InfoTooltip content="Technical lead for Application Production Support" />
            </Label>
            <Input
              id="apsTechnicalLead"
              value={applicationData.apsTechnicalLead}
              onChange={(e) => handleInputChange("apsTechnicalLead", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-purple-500",
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="l2SupportGroup" className="flex items-center text-sm lg:text-base">
              L2 Support Group <InfoTooltip content="Level 2 support group identifier and team name" />
            </Label>
            <Input
              id="l2SupportGroup"
              value={applicationData.l2SupportGroup}
              onChange={(e) => handleInputChange("l2SupportGroup", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-purple-500",
              )}
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
            <Input
              id="supportContact"
              value={applicationData.supportContact}
              onChange={(e) => handleInputChange("supportContact", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-purple-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportContactEmail" className="flex items-center text-sm lg:text-base">
              Support Contact Email <InfoTooltip content="Email address for the primary support contact" />
            </Label>
            <div className="relative">
              <Input
                id="supportContactEmail"
                type="email"
                value={applicationData.supportContactEmail}
                onChange={(e) => handleInputChange("supportContactEmail", e.target.value)}
                disabled={!isEditMode}
                className={cn(
                  "pl-9 lg:pl-10 h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
                )}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="l2SupportContact" className="flex items-center text-sm lg:text-base">
              L2 Support Contact <InfoTooltip content="Level 2 support contact person for technical escalations" />
            </Label>
            <Input
              id="l2SupportContact"
              value={applicationData.l2SupportContact}
              onChange={(e) => handleInputChange("l2SupportContact", e.target.value)}
              disabled={!isEditMode}
              className={cn(
                "h-9 lg:h-10 xl:h-11",
                !isEditMode && "bg-gray-50",
                isEditMode && "focus:ring-2 focus:ring-purple-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportRegion" className="flex items-center text-sm lg:text-base">
              Support Region <InfoTooltip content="Geographic region for support coverage" />
            </Label>
            <Select
              value={applicationData.supportRegion}
              onValueChange={(value) => handleInputChange("supportRegion", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
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
              value={applicationData.bpsSupported}
              onValueChange={(value) => handleInputChange("bpsSupported", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportModel" className="flex items-center text-sm lg:text-base">
              Support Model <InfoTooltip content="Type of support model and coverage hours" />
            </Label>
            <Select
              value={applicationData.supportModel}
              onValueChange={(value) => handleInputChange("supportModel", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportTimezone" className="flex items-center text-sm lg:text-base">
              Support Timezone <InfoTooltip content="Primary timezone for support operations" />
            </Label>
            <Select
              value={applicationData.supportTimezone}
              onValueChange={(value) => handleInputChange("supportTimezone", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={cn(
                  "h-9 lg:h-10 xl:h-11",
                  !isEditMode && "bg-gray-50",
                  isEditMode && "focus:ring-2 focus:ring-purple-500",
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
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="escalationPath" className="flex items-center text-sm lg:text-base">
            Escalation Path <InfoTooltip content="Detailed escalation procedure and contact hierarchy" />
          </Label>
          <Textarea
            id="escalationPath"
            value={applicationData.escalationPath}
            onChange={(e) => handleInputChange("escalationPath", e.target.value)}
            disabled={!isEditMode}
            className={cn(
              "min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] text-sm lg:text-base",
              !isEditMode && "bg-gray-50",
              isEditMode && "focus:ring-2 focus:ring-purple-500",
            )}
          />
        </div>
      </div>

      {/* Support Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-purple-800 font-semibold mb-3 text-sm lg:text-base">Support Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-purple-700">Support Model:</span>{" "}
            <span className="text-purple-600 break-words">
              {applicationData.supportModel
                ? applicationData.supportModel
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">BPS Supported:</span>{" "}
            <span className="text-purple-600">
              {applicationData.bpsSupported === "yes"
                ? "Yes"
                : applicationData.bpsSupported === "no"
                  ? "No"
                  : "Limited"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Support Region:</span>{" "}
            <span className="text-purple-600">
              {applicationData.supportRegion ? applicationData.supportRegion.toUpperCase() : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Timezone:</span>{" "}
            <span className="text-purple-600 break-words">
              {applicationData.supportTimezone
                ? applicationData.supportTimezone
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
                APS Manager: {applicationData.apsSupport || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Technical Lead: {applicationData.apsTechnicalLead || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Support Contact: {applicationData.supportContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                L2 Contact: {applicationData.l2SupportContact || "Not assigned"}
              </span>
            </div>
          </div>
          {applicationData.supportContactEmail && (
            <div className="mt-2 text-xs lg:text-sm">
              <span className="text-purple-600 break-all">Primary Email: {applicationData.supportContactEmail}</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="space-y-2">
          <Label htmlFor="updatedBy" className="flex items-center text-sm lg:text-base">
            Updated By <InfoTooltip content="Person who last updated this record" />
          </Label>
          <Input id="updatedBy" value={applicationData.updatedBy} readOnly className="bg-gray-50 h-9 lg:h-10 xl:h-11" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="updatedDate" className="flex items-center text-sm lg:text-base">
            Updated Date <InfoTooltip content="Date when this record was last updated" />
          </Label>
          <Input
            id="updatedDate"
            value={applicationData.updatedDate}
            readOnly
            className="bg-gray-50 h-9 lg:h-10 xl:h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastAttestedDate" className="flex items-center text-sm lg:text-base">
            Last Attested Date <InfoTooltip content="Date when this record was last attested" />
          </Label>
          <Input
            id="lastAttestedDate"
            value={applicationData.lastAttestedDate}
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
            value={applicationData.attestedBy}
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
            value={applicationData.nextDueAttestedDate}
            readOnly
            className="bg-gray-50 h-9 lg:h-10 xl:h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version" className="flex items-center text-sm lg:text-base">
            Version <InfoTooltip content="Current version of the application record" />
          </Label>
          <Input id="version" value={applicationData.version} readOnly className="bg-gray-50 h-9 lg:h-10 xl:h-11" />
        </div>
      </div>

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
                {applicationData.applicationId} - {applicationData.applicationName}
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
                  disabled={!hasUnsavedChanges}
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
