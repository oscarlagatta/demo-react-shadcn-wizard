"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, Info, MapPin, Users, Headphones, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Define section structure
const sections = [
  {
    id: "application-details",
    title: "Application Details",
    description: "Basic information about the application",
    icon: FileText,
  },
  {
    id: "organization-alignment",
    title: "Organization Alignment",
    description: "Organizational structure and contacts",
    icon: Users,
  },
  {
    id: "support-alignment",
    title: "Support Alignment",
    description: "Support team and contact information",
    icon: Headphones,
  },
  {
    id: "other",
    title: "Other Information",
    description: "Additional tracking and metadata",
    icon: MapPin,
  },
]

export default function GuidedApplicationDetailsPage() {
  // Navigation state
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Form state for all sections
  const [formState, setFormState] = useState({
    // Application Details section
    shortName: "AAR",
    region: "apac-latam",
    twoDot: "VM",
    twoDotDesc: "GCIB AND GTS TECH",
    threeDot: "VMB",
    threeDotDesc: "GCIB AND GTS TECH",
    description:
      "Performs all billing and receivables functions for analyzed accounts. It provides a GUI interface for billed accounts to recognize income. Collections are done via direct debit of customer accounts or by checks remitted to Bank Physical Lockboxes.",

    // Organization Alignment section
    techExec: "Thompson, Sarah K.",
    managementContact: "Chen, Michael R.",
    applicationManager: "Williams, Jennifer L.",
    portfolio: "apac",
    portfolioLead: "Anderson, David M.",
    team: "Australia Apps",
    organization: "",
    lineOfBusiness: "",
    aligningOrg: "GCIB AND GTS TECH",

    // Support Alignment section
    apsSupport: "Kumar, Rajesh",
    apsTechnicalLead: "Patel, Priya S.",
    l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
    l2SupportContact: "Martinez, Carlos",
    bpsSupported: "yes",
    supportModel: "bps-24x7",
    escalationPath: "L1 → L2 Support Group → APS Support Manager → APS Technical Lead",

    // Other section (read-only)
    updatedBy: "Kumar, Rajesh",
    updatedDate: "Oct 30, 2024, 2:38:48 PM",
    createdBy: "Martinez, Carlos",
    createdDate: "Sep 15, 2024, 9:15:22 AM",
    lastAttestedDate: "Oct 24, 2024, 10:25:31 AM",
    attestedBy: "Kumar, Rajesh",
    nextDueAttestedDate: "Mar 31, 2025, 12:00:00 AM",
    version: "v2.1.3",
    status: "active",
  })

  // Calculate progress percentage
  const progress = ((currentStep + 1) / sections.length) * 100

  // Generic change handler for form fields
  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= Math.max(...completedSteps, currentStep)) {
      setCurrentStep(stepIndex)
      window.scrollTo(0, 0)
    }
  }

  // Tooltip component for field explanations
  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  // Section renderers
  const renderApplicationDetails = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Application Details</h2>
        <p className="text-gray-600">Let's start with the basic information about your application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="shortName" className="flex items-center">
            Short Name <InfoTooltip content="Abbreviated name for the application" />
          </Label>
          <Input
            id="shortName"
            value={formState.shortName}
            onChange={(e) => handleInputChange("shortName", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter short name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="flex items-center">
            Region <InfoTooltip content="Geographic region where the application operates" />
          </Label>
          <Select value={formState.region} onValueChange={(value) => handleInputChange("region", value)}>
            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apac-latam">APAC, LATAM</SelectItem>
              <SelectItem value="emea">EMEA</SelectItem>
              <SelectItem value="americas">Americas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="twoDot" className="flex items-center">
            Two Dot <InfoTooltip content="Two-level application categorization" />
          </Label>
          <Input
            id="twoDot"
            value={formState.twoDot}
            onChange={(e) => handleInputChange("twoDot", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter two dot code"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twoDotDesc" className="flex items-center">
            Two Dot Desc <InfoTooltip content="Description of the two-dot categorization" />
          </Label>
          <Input
            id="twoDotDesc"
            value={formState.twoDotDesc}
            onChange={(e) => handleInputChange("twoDotDesc", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter two dot description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="threeDot" className="flex items-center">
            Three Dot <InfoTooltip content="Three-level application categorization" />
          </Label>
          <Input
            id="threeDot"
            value={formState.threeDot}
            onChange={(e) => handleInputChange("threeDot", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter three dot code"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="threeDotDesc" className="flex items-center">
            Three Dot Desc <InfoTooltip content="Description of the three-dot categorization" />
          </Label>
          <Input
            id="threeDotDesc"
            value={formState.threeDotDesc}
            onChange={(e) => handleInputChange("threeDotDesc", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter three dot description"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="flex items-center">
            Description <InfoTooltip content="Detailed description of the application functionality" />
          </Label>
          <Textarea
            id="description"
            value={formState.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[100px]"
            placeholder="Enter application description"
          />
        </div>
      </div>
    </div>
  )

  const renderOrganizationAlignment = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Organization Alignment</h2>
        <p className="text-gray-600">Define the organizational structure and key contacts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="techExec" className="flex items-center">
            Tech Exec <InfoTooltip content="Technology Executive responsible for the application" />
          </Label>
          <Input
            id="techExec"
            value={formState.techExec}
            onChange={(e) => handleInputChange("techExec", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter tech executive name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="managementContact" className="flex items-center">
            Management Contact <InfoTooltip content="Primary management contact for the application" />
          </Label>
          <Input
            id="managementContact"
            value={formState.managementContact}
            onChange={(e) => handleInputChange("managementContact", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter management contact"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationManager" className="flex items-center">
            Application Manager <InfoTooltip content="Manager responsible for application operations" />
          </Label>
          <Input
            id="applicationManager"
            value={formState.applicationManager}
            onChange={(e) => handleInputChange("applicationManager", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter application manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio" className="flex items-center">
            Portfolio <InfoTooltip content="Portfolio this application belongs to" />
          </Label>
          <Select value={formState.portfolio} onValueChange={(value) => handleInputChange("portfolio", value)}>
            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apac">APAC</SelectItem>
              <SelectItem value="emea">EMEA</SelectItem>
              <SelectItem value="americas">Americas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolioLead" className="flex items-center">
            Portfolio Lead <InfoTooltip content="Lead person for the portfolio" />
          </Label>
          <Input
            id="portfolioLead"
            value={formState.portfolioLead}
            onChange={(e) => handleInputChange("portfolioLead", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter portfolio lead"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team" className="flex items-center">
            Team <InfoTooltip content="Team responsible for the application" />
          </Label>
          <Input
            id="team"
            value={formState.team}
            onChange={(e) => handleInputChange("team", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter team name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aligningOrg" className="flex items-center">
            Aligning Org <InfoTooltip content="Aligning organization" />
          </Label>
          <Input
            id="aligningOrg"
            value={formState.aligningOrg}
            onChange={(e) => handleInputChange("aligningOrg", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter aligning organization"
          />
        </div>
      </div>
    </div>
  )

  const renderSupportAlignment = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Support Alignment</h2>
        <p className="text-gray-600">Configure support team and contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="apsSupport" className="flex items-center">
            APS Support Manager <InfoTooltip content="Application Production Support Manager" />
          </Label>
          <Input
            id="apsSupport"
            value={formState.apsSupport}
            onChange={(e) => handleInputChange("apsSupport", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter APS support manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="l2SupportGroup" className="flex items-center">
            L2 Support Group <InfoTooltip content="Level 2 support group identifier" />
          </Label>
          <Input
            id="l2SupportGroup"
            value={formState.l2SupportGroup}
            onChange={(e) => handleInputChange("l2SupportGroup", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter L2 support group"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apsTechnicalLead" className="flex items-center">
            APS Technical Lead <InfoTooltip content="Technical lead for APS" />
          </Label>
          <Input
            id="apsTechnicalLead"
            value={formState.apsTechnicalLead}
            onChange={(e) => handleInputChange("apsTechnicalLead", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter technical lead"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="l2SupportContact" className="flex items-center">
            L2 Support Contact <InfoTooltip content="Level 2 support contact person" />
          </Label>
          <Input
            id="l2SupportContact"
            value={formState.l2SupportContact}
            onChange={(e) => handleInputChange("l2SupportContact", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter L2 support contact"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bpsSupported" className="flex items-center">
            BPS Supported <InfoTooltip content="Business Process Support availability" />
          </Label>
          <Select value={formState.bpsSupported} onValueChange={(value) => handleInputChange("bpsSupported", value)}>
            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supportModel" className="flex items-center">
            Support Model <InfoTooltip content="Type of support model used" />
          </Label>
          <Select value={formState.supportModel} onValueChange={(value) => handleInputChange("supportModel", value)}>
            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bps-24x7">BPS - 24x7</SelectItem>
              <SelectItem value="bps-business-hours">BPS - Business Hours</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="escalationPath" className="flex items-center">
            Escalation Path <InfoTooltip content="Support escalation procedure" />
          </Label>
          <Textarea
            id="escalationPath"
            value={formState.escalationPath}
            onChange={(e) => handleInputChange("escalationPath", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Define escalation path"
          />
        </div>
      </div>
    </div>
  )

  const renderOther = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Other Information</h2>
        <p className="text-gray-600">Additional tracking and metadata information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="updatedBy" className="flex items-center">
            Updated By <InfoTooltip content="Person who last updated this record" />
          </Label>
          <Input id="updatedBy" defaultValue={formState.updatedBy} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="updatedDate" className="flex items-center">
            Updated Date <InfoTooltip content="Date when this record was last updated" />
          </Label>
          <Input id="updatedDate" defaultValue={formState.updatedDate} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastAttestedDate" className="flex items-center">
            Last Attested Date <InfoTooltip content="Date when this record was last attested" />
          </Label>
          <Input id="lastAttestedDate" defaultValue={formState.lastAttestedDate} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attestedBy" className="flex items-center">
            Attested By <InfoTooltip content="Person who last attested this record" />
          </Label>
          <Input id="attestedBy" defaultValue={formState.attestedBy} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextDueAttestedDate" className="flex items-center">
            Next Due Attested Date <InfoTooltip content="Next date when attestation is due" />
          </Label>
          <Input
            id="nextDueAttestedDate"
            defaultValue={formState.nextDueAttestedDate}
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version" className="flex items-center">
            Version <InfoTooltip content="Current version of the application record" />
          </Label>
          <Input id="version" defaultValue={formState.version} readOnly className="bg-gray-50" />
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Congratulations!</span>
        </div>
        <p className="text-green-700 mt-1">
          You've successfully completed the application details setup. All sections have been configured.
        </p>
      </div>
    </div>
  )

  // Render current section based on step
  const renderCurrentSection = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Application Setup Wizard</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Guided Tour
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {sections.length}
            </span>
            <div className="w-32 md:w-48">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 overflow-x-auto">
        <div className="flex items-center min-w-max md:justify-between max-w-4xl mx-auto">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = index === currentStep
            const isCompleted = completedSteps.includes(index)
            const isClickable = index <= Math.max(...completedSteps, currentStep)

            return (
              <div key={section.id} className="flex items-center">
                <button
                  onClick={() => isClickable && handleStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center space-x-2 md:space-x-3 px-2 md:px-4 py-2 rounded-lg transition-all duration-200",
                    isActive && "bg-blue-50 border-2 border-blue-200",
                    isCompleted && !isActive && "bg-green-50 border-2 border-green-200",
                    !isActive && !isCompleted && "hover:bg-gray-50",
                    !isClickable && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full transition-all duration-200",
                      isActive && "bg-blue-500 text-white",
                      isCompleted && !isActive && "bg-green-500 text-white",
                      !isActive && !isCompleted && "bg-gray-200 text-gray-600",
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Icon className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <div
                      className={cn(
                        "text-xs md:text-sm font-medium",
                        isActive && "text-blue-700",
                        isCompleted && !isActive && "text-green-700",
                        !isActive && !isCompleted && "text-gray-600",
                      )}
                    >
                      {section.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block">{section.description}</div>
                  </div>
                </button>
                {index < sections.length - 1 && <div className="w-4 md:w-8 h-px bg-gray-300 mx-1 md:mx-2" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="shadow-lg">
          <CardContent className="p-4 md:p-8">{renderCurrentSection()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 md:mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentStep && "bg-blue-500",
                  completedSteps.includes(index) && index !== currentStep && "bg-green-500",
                  index !== currentStep && !completedSteps.includes(index) && "bg-gray-300",
                )}
              />
            ))}
          </div>

          {currentStep < sections.length - 1 ? (
            <Button onClick={handleNext} className="flex items-center space-x-2">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4" />
              <span>Complete Setup</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
