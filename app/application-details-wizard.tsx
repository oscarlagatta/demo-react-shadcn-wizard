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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Wizard steps configuration
const wizardSteps = [
  {
    id: "application-details",
    title: "Application Details",
    description: "Basic application information",
    icon: FileText,
    color: "blue",
  },
  {
    id: "organization-alignment",
    title: "Organization Alignment",
    description: "Organizational contacts and structure",
    icon: Users,
    color: "green",
  },
  {
    id: "support-alignment",
    title: "Support Alignment",
    description: "Support team configuration",
    icon: Headphones,
    color: "purple",
  },
  {
    id: "other",
    title: "Other Information",
    description: "Additional metadata and tracking",
    icon: MapPin,
    color: "orange",
  },
]

export default function ApplicationDetailsWizard() {
  // Wizard navigation state
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isWizardMode, setIsWizardMode] = useState(true)

  // Form data state with expanded Support Alignment fields
  const [formData, setFormData] = useState({
    // Application Details - Expanded with all required fields
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

    // Organization Alignment - Expanded with new fields
    techExec: "Thompson, Sarah K.",
    managementContact: "Chen, Michael R.",
    applicationManager: "Williams, Jennifer L.",
    portfolio: "apac",
    portfolioLead: "Anderson, David M.",
    team: "Australia Apps",
    organization: "gcib",
    lineOfBusiness: "treasury-payments",
    aligningOrg: "gcib-gts-tech",

    // Support Alignment - Refactored with new fields
    apsSupport: "Kumar, Rajesh",
    apsTechnicalLead: "Patel, Priya S.",
    l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
    l2SupportContact: "Martinez, Carlos",
    supportContact: "Johnson, Emily R.",
    supportContactEmail: "emily.johnson@bank.com",
    bpsSupported: "yes",
    supportModel: "bps-24x7",
    escalationPath: "L1 → L2 Support Group → APS Support Manager → APS Technical Lead",
    supportRegion: "apac",
    supportTimezone: "asia-pacific",

    // Other (read-only)
    updatedBy: "Kumar, Rajesh",
    updatedDate: "Oct 30, 2024, 2:36:48 PM",
    lastAttestedDate: "Oct 24, 2024, 10:25:31 AM",
    attestedBy: "Kumar, Rajesh",
    nextDueAttestedDate: "Mar 31, 2025, 12:00:00 AM",
  })

  // Calculate progress
  const progress = ((currentStep + 1) / wizardSteps.length) * 100

  // Form change handler
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= Math.max(...completedSteps, currentStep)) {
      setCurrentStep(stepIndex)
    }
  }

  const handleCompleteWizard = () => {
    setCompletedSteps([...completedSteps, currentStep])
    setIsWizardMode(false)
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

  // Helper function to format RTO/RPO display values
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

  // Responsive Application Details section renderer
  const renderApplicationDetails = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section - Responsive */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Application Details
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Configure the basic information and technical specifications for your application
        </p>
      </div>

      {/* Basic Information Section - Ultra-wide responsive */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Basic Information</h4>
        </div>

        {/* Responsive grid - adapts from 1 to 4 columns on ultra-wide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="shortName" className="flex items-center text-sm lg:text-base">
              Short Name <InfoTooltip content="Abbreviated name for the application (typically 3-5 characters)" />
            </Label>
            <Input
              id="shortName"
              value={formData.shortName}
              onChange={(e) => handleInputChange("shortName", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter short name"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="flex items-center text-sm lg:text-base">
              Region <InfoTooltip content="Geographic region where the application operates" />
            </Label>
            <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11">
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
            <Label htmlFor="twoDot" className="flex items-center text-sm lg:text-base">
              Two Dot <InfoTooltip content="Two-level application categorization code" />
            </Label>
            <Input
              id="twoDot"
              value={formData.twoDot}
              onChange={(e) => handleInputChange("twoDot", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter two dot code"
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twoDotDesc" className="flex items-center text-sm lg:text-base">
              Two Dot Description <InfoTooltip content="Description of the two-dot categorization" />
            </Label>
            <Input
              id="twoDotDesc"
              value={formData.twoDotDesc}
              onChange={(e) => handleInputChange("twoDotDesc", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threeDot" className="flex items-center text-sm lg:text-base">
              Three Dot <InfoTooltip content="Three-level application categorization code" />
            </Label>
            <Input
              id="threeDot"
              value={formData.threeDot}
              onChange={(e) => handleInputChange("threeDot", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter three dot code"
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threeDotDesc" className="flex items-center text-sm lg:text-base">
              Three Dot Description <InfoTooltip content="Description of the three-dot categorization" />
            </Label>
            <Input
              id="threeDotDesc"
              value={formData.threeDotDesc}
              onChange={(e) => handleInputChange("threeDotDesc", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter description"
            />
          </div>
        </div>

        {/* Description - Full width with responsive sizing */}
        <div className="space-y-2 xl:col-span-2">
          <Label htmlFor="description" className="flex items-center text-sm lg:text-base">
            Description <InfoTooltip content="Detailed description of the application functionality and purpose" />
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] text-sm lg:text-base"
            placeholder="Enter detailed application description"
          />
        </div>
      </div>

      {/* Recovery & Performance Section - Responsive grid */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Recovery & Performance Objectives
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Label htmlFor="rto" className="flex items-center text-sm lg:text-base">
              RTO (Recovery Time Objective){" "}
              <InfoTooltip content="Maximum acceptable time to restore service after an outage" />
            </Label>
            <Select value={formData.rto} onValueChange={(value) => handleInputChange("rto", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11">
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
              RPO (Recovery Point Objective){" "}
              <InfoTooltip content="Maximum acceptable amount of data loss measured in time" />
            </Label>
            <Select value={formData.rpo} onValueChange={(value) => handleInputChange("rpo", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11">
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
              value={formData.rtoApprover}
              onChange={(e) => handleInputChange("rtoApprover", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter approver name"
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
                value={formData.rtoApproveDate}
                onChange={(e) => handleInputChange("rtoApproveDate", e.target.value)}
                className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Technical Configuration Section - Responsive */}
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
            <Select value={formData.usesMainframe} onValueChange={(value) => handleInputChange("usesMainframe", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11">
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
              value={formData.applicationHosting}
              onValueChange={(value) => handleInputChange("applicationHosting", value)}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-9 lg:h-10 xl:h-11">
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

      {/* Summary Section - Responsive */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-blue-800 font-semibold mb-3 text-sm lg:text-base">Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-blue-700">RTO:</span>{" "}
            <span className="text-blue-600 break-words">{getRTODisplayValue(formData.rto)}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">RPO:</span>{" "}
            <span className="text-blue-600 break-words">{getRPODisplayValue(formData.rpo)}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Hosting:</span>{" "}
            <span className="text-blue-600 break-words">{getHostingDisplayValue(formData.applicationHosting)}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Mainframe:</span>{" "}
            <span className="text-blue-600">
              {formData.usesMainframe === "yes" ? "Yes" : formData.usesMainframe === "no" ? "No" : "Partial"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOrganizationAlignment = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section - Responsive */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Organization Alignment
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Define the organizational structure, key contacts, and business alignment
        </p>
      </div>

      {/* Key Contacts Section - Ultra-wide responsive */}
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
              value={formData.techExec}
              onChange={(e) => handleInputChange("techExec", e.target.value)}
              className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter tech executive name"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="managementContact" className="flex items-center text-sm lg:text-base">
              Management Contact <InfoTooltip content="Primary management contact for the application" />
            </Label>
            <Input
              id="managementContact"
              value={formData.managementContact}
              onChange={(e) => handleInputChange("managementContact", e.target.value)}
              className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter management contact"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="applicationManager" className="flex items-center text-sm lg:text-base">
              Application Manager <InfoTooltip content="Manager responsible for application operations" />
            </Label>
            <Input
              id="applicationManager"
              value={formData.applicationManager}
              onChange={(e) => handleInputChange("applicationManager", e.target.value)}
              className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter application manager"
            />
          </div>
        </div>
      </div>

      {/* Portfolio & Team Structure Section - Responsive */}
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
            <Select value={formData.portfolio} onValueChange={(value) => handleInputChange("portfolio", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11">
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
              value={formData.portfolioLead}
              onChange={(e) => handleInputChange("portfolioLead", e.target.value)}
              className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter portfolio lead"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="team" className="flex items-center text-sm lg:text-base">
              Team <InfoTooltip content="Team responsible for the application" />
            </Label>
            <Input
              id="team"
              value={formData.team}
              onChange={(e) => handleInputChange("team", e.target.value)}
              className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter team name"
            />
          </div>
        </div>
      </div>

      {/* Business Alignment Section - Ultra-wide responsive */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Business Alignment</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="organization" className="flex items-center text-sm lg:text-base">
              Organization <InfoTooltip content="Primary organizational unit or division" />
            </Label>
            <Select value={formData.organization} onValueChange={(value) => handleInputChange("organization", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11">
                <SelectValue placeholder="Select organization" />
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
              value={formData.lineOfBusiness}
              onValueChange={(value) => handleInputChange("lineOfBusiness", value)}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11">
                <SelectValue placeholder="Select line of business" />
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
            <Select value={formData.aligningOrg} onValueChange={(value) => handleInputChange("aligningOrg", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-green-500 h-9 lg:h-10 xl:h-11">
                <SelectValue placeholder="Select aligning organization" />
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

      {/* Organizational Summary Section - Responsive */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-green-800 font-semibold mb-3 text-sm lg:text-base">Organizational Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-green-700">Primary Organization:</span>{" "}
            <span className="text-green-600 break-words">
              {formData.organization
                ? formData.organization
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Line of Business:</span>{" "}
            <span className="text-green-600 break-words">
              {formData.lineOfBusiness
                ? formData.lineOfBusiness
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Tech Alignment:</span>{" "}
            <span className="text-green-600 break-words">
              {formData.aligningOrg
                ? formData.aligningOrg
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Portfolio:</span>{" "}
            <span className="text-green-600">
              {formData.portfolio ? formData.portfolio.toUpperCase() : "Not selected"}
            </span>
          </div>
        </div>

        {/* Contact Summary - Responsive */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <h5 className="font-medium text-green-700 mb-2 text-xs lg:text-sm">Key Contacts</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-green-600 break-words">Tech Exec: {formData.techExec || "Not assigned"}</span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                Management: {formData.managementContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                App Manager: {formData.applicationManager || "Not assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSupportAlignment = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section - Responsive */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Headphones className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-purple-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Support Alignment
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Configure support team structure, contacts, and service delivery model
        </p>
      </div>

      {/* Support Management Section - Ultra-wide responsive */}
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
              value={formData.apsSupport}
              onChange={(e) => handleInputChange("apsSupport", e.target.value)}
              className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter APS support manager"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="apsTechnicalLead" className="flex items-center text-sm lg:text-base">
              APS Technical Lead <InfoTooltip content="Technical lead for Application Production Support" />
            </Label>
            <Input
              id="apsTechnicalLead"
              value={formData.apsTechnicalLead}
              onChange={(e) => handleInputChange("apsTechnicalLead", e.target.value)}
              className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter technical lead"
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <Label htmlFor="l2SupportGroup" className="flex items-center text-sm lg:text-base">
              L2 Support Group <InfoTooltip content="Level 2 support group identifier and team name" />
            </Label>
            <Input
              id="l2SupportGroup"
              value={formData.l2SupportGroup}
              onChange={(e) => handleInputChange("l2SupportGroup", e.target.value)}
              className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter L2 support group"
            />
          </div>
        </div>
      </div>

      {/* Support Contacts Section - Responsive */}
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
              value={formData.supportContact}
              onChange={(e) => handleInputChange("supportContact", e.target.value)}
              className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter support contact name"
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
                value={formData.supportContactEmail}
                onChange={(e) => handleInputChange("supportContactEmail", e.target.value)}
                className="focus:ring-2 focus:ring-purple-500 pl-9 lg:pl-10 h-9 lg:h-10 xl:h-11"
                placeholder="Enter support contact email"
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
              value={formData.l2SupportContact}
              onChange={(e) => handleInputChange("l2SupportContact", e.target.value)}
              className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11"
              placeholder="Enter L2 support contact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportRegion" className="flex items-center text-sm lg:text-base">
              Support Region <InfoTooltip content="Geographic region for support coverage" />
            </Label>
            <Select value={formData.supportRegion} onValueChange={(value) => handleInputChange("supportRegion", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11">
                <SelectValue placeholder="Select support region" />
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

      {/* Service Delivery Model Section - Responsive */}
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
            <Select value={formData.bpsSupported} onValueChange={(value) => handleInputChange("bpsSupported", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11">
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
            <Select value={formData.supportModel} onValueChange={(value) => handleInputChange("supportModel", value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11">
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
              value={formData.supportTimezone}
              onValueChange={(value) => handleInputChange("supportTimezone", value)}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 h-9 lg:h-10 xl:h-11">
                <SelectValue placeholder="Select timezone" />
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
            value={formData.escalationPath}
            onChange={(e) => handleInputChange("escalationPath", e.target.value)}
            className="focus:ring-2 focus:ring-purple-500 min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] text-sm lg:text-base"
            placeholder="Define the escalation path and procedures"
          />
        </div>
      </div>

      {/* Support Summary Section - Responsive */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-purple-800 font-semibold mb-3 text-sm lg:text-base">Support Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-purple-700">Support Model:</span>{" "}
            <span className="text-purple-600 break-words">
              {formData.supportModel
                ? formData.supportModel
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">BPS Supported:</span>{" "}
            <span className="text-purple-600">
              {formData.bpsSupported === "yes" ? "Yes" : formData.bpsSupported === "no" ? "No" : "Limited"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Support Region:</span>{" "}
            <span className="text-purple-600">
              {formData.supportRegion ? formData.supportRegion.toUpperCase() : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Timezone:</span>{" "}
            <span className="text-purple-600 break-words">
              {formData.supportTimezone
                ? formData.supportTimezone
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
        </div>

        {/* Support Contacts Summary - Responsive */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <h5 className="font-medium text-purple-700 mb-2 text-xs lg:text-sm">Support Team</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-purple-600 break-words">APS Manager: {formData.apsSupport || "Not assigned"}</span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Technical Lead: {formData.apsTechnicalLead || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Support Contact: {formData.supportContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                L2 Contact: {formData.l2SupportContact || "Not assigned"}
              </span>
            </div>
          </div>
          {formData.supportContactEmail && (
            <div className="mt-2 text-xs lg:text-sm">
              <span className="text-purple-600 break-all">Primary Email: {formData.supportContactEmail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderOther = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section - Responsive */}
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
          <Input id="updatedBy" defaultValue={formData.updatedBy} readOnly className="bg-gray-50 h-9 lg:h-10 xl:h-11" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="updatedDate" className="flex items-center text-sm lg:text-base">
            Updated Date <InfoTooltip content="Date when this record was last updated" />
          </Label>
          <Input
            id="updatedDate"
            defaultValue={formData.updatedDate}
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
            defaultValue={formData.lastAttestedDate}
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
            defaultValue={formData.attestedBy}
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
            defaultValue={formData.nextDueAttestedDate}
            readOnly
            className="bg-gray-50 h-9 lg:h-10 xl:h-11"
          />
        </div>
      </div>

      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
          </div>
          <div>
            <h4 className="text-green-800 font-semibold text-sm lg:text-base">Setup Complete!</h4>
            <p className="text-green-700 text-xs lg:text-sm">
              You've successfully configured all application details. The information has been saved and is ready for
              review.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
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

  if (!isWizardMode) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center mb-6 lg:mb-8">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <Check className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Setup Complete</h2>
          <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
            Your application details have been successfully configured.
          </p>
          <Button onClick={() => setIsWizardMode(true)} variant="outline" className="h-9 lg:h-10">
            Edit Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Ultra-wide responsive container */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto p-4 lg:p-6 xl:p-8">
        {/* Wizard Header - Responsive */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Application Setup Wizard</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Complete your application configuration step by step
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">
                Step {currentStep + 1} of {wizardSteps.length}
              </span>
              <div className="w-full sm:w-32 lg:w-48">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Step Indicator - Ultra-wide responsive */}
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between min-w-max lg:min-w-0 lg:justify-center xl:justify-between gap-2 lg:gap-4">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = completedSteps.includes(index)
                const isClickable = index <= Math.max(...completedSteps, currentStep)

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => isClickable && handleStepClick(index)}
                      disabled={!isClickable}
                      className={cn(
                        "flex flex-col items-center space-y-1 lg:space-y-2 p-2 lg:p-3 rounded-lg transition-all duration-200 min-w-[80px] lg:min-w-[120px]",
                        isActive && "bg-blue-50 border-2 border-blue-200",
                        isCompleted && !isActive && "bg-green-50 border-2 border-green-200",
                        !isActive && !isCompleted && "hover:bg-gray-50",
                        !isClickable && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-all duration-200",
                          isActive && "bg-blue-500 text-white",
                          isCompleted && !isActive && "bg-green-500 text-white",
                          !isActive && !isCompleted && "bg-gray-200 text-gray-600",
                        )}
                      >
                        {isCompleted && !isActive ? (
                          <Check className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                        ) : (
                          <Icon className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                        )}
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            "text-xs lg:text-sm xl:text-base font-medium",
                            isActive && "text-blue-700",
                            isCompleted && !isActive && "text-green-700",
                            !isActive && !isCompleted && "text-gray-600",
                          )}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500 hidden lg:block">{step.description}</div>
                      </div>
                    </button>
                    {index < wizardSteps.length - 1 && (
                      <div className="w-4 lg:w-8 xl:w-12 h-px bg-gray-300 mx-1 lg:mx-2" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step Content - Ultra-wide responsive container */}
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-10">{renderCurrentStep()}</CardContent>
        </Card>

        {/* Navigation - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 lg:mt-8 gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 h-9 lg:h-10 xl:h-11 w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {wizardSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-200",
                  index === currentStep && "bg-blue-500",
                  completedSteps.includes(index) && index !== currentStep && "bg-green-500",
                  index !== currentStep && !completedSteps.includes(index) && "bg-gray-300",
                )}
              />
            ))}
          </div>

          {currentStep < wizardSteps.length - 1 ? (
            <Button onClick={handleNext} className="flex items-center space-x-2 h-9 lg:h-10 xl:h-11 w-full sm:w-auto">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCompleteWizard}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 h-9 lg:h-10 xl:h-11 w-full sm:w-auto"
            >
              <Check className="h-4 w-4" />
              <span>Complete Setup</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
