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

const sections = [
  {
    id: "application-details",
    title: "Application Details",
    description: "Basic information about the application",
    icon: FileText,
    fields: ["Short Name", "Two Dot Three Dot", "Description", "Region"],
  },
  {
    id: "organization-alignment",
    title: "Organization Alignment",
    description: "Organizational structure and contacts",
    icon: Users,
    fields: ["Tech Exec", "Management Contact", "Application Manager"],
  },
  {
    id: "support-alignment",
    title: "Support Alignment",
    description: "Support team and contact information",
    icon: Headphones,
    fields: ["APS Support Manager", "L2 Support Group"],
  },
  {
    id: "other",
    title: "Other Information",
    description: "Additional tracking and metadata",
    icon: MapPin,
    fields: ["Updated By", "Updated Date"],
  },
]

export default function GuidedApplicationDetailsPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Form state for all fields
  const [formData, setFormData] = useState({
    // Application Details
    shortName: "AAR",
    region: "apac-latam",
    twoDotThreeDot: "VM.VMB",
    twoDotThreeDotDesc: "GCIB AND GTS TECH",
    description:
      "Performs all billing and receivables functions for analyzed accounts. It provides a GUI interface for billed accounts to recognize income.",

    // Organization Alignment
    techExec: "Thompson, Sarah K.",
    managementContact: "Chen, Michael R.",
    applicationManager: "Williams, Jennifer L.",
    portfolio: "apac",
    portfolioLead: "Anderson, David M.",
    team: "Australia Apps",

    // Support Alignment
    apsSupport: "Kumar, Rajesh",
    l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
    apsTechnicalLead: "Patel, Priya S.",
    supportModel: "bps-24x7",
    escalationPath: "L1 → L2 Support Group → APS Support Manager → APS Technical Lead",

    // Other
    updatedBy: "Kumar, Rajesh",
    updatedDate: "Oct 30, 2024, 2:38:48 PM",
    createdBy: "Martinez, Carlos",
    createdDate: "Sep 15, 2024, 9:15:22 AM",
    version: "v2.1.3",
    status: "active",
  })

  const progress = ((currentStep + 1) / sections.length) * 100

  const handleNext = () => {
    if (currentStep < sections.length - 1) {
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
    setCurrentStep(stepIndex)
  }

  // Generic change handler for form fields
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const renderApplicationDetails = () => (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Application Details</h2>
        <p className="text-gray-600">Let's start with the basic information about your application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="shortName" className="flex items-center gap-2">
            Short Name
            <InfoTooltip content="Abbreviated name for the application" />
          </Label>
          <Input
            id="shortName"
            value={formData.shortName}
            onChange={(e) => handleChange("shortName", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter short name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="flex items-center gap-2">
            Region
            <InfoTooltip content="Geographic region where the application operates" />
          </Label>
          <Select value={formData.region} onValueChange={(value) => handleChange("region", value)}>
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="twoDotThreeDot" className="flex items-center gap-2">
            Two Dot Three Dot
            <InfoTooltip content="Application categorization using two and three dot notation" />
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="twoDotThreeDot"
              value={formData.twoDotThreeDot}
              onChange={(e) => handleChange("twoDotThreeDot", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Two.Three dot notation"
            />
            <Input
              id="twoDotThreeDotDesc"
              value={formData.twoDotThreeDotDesc}
              onChange={(e) => handleChange("twoDotThreeDotDesc", e.target.value)}
              className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Description"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            Description
            <InfoTooltip content="Detailed description of the application functionality" />
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[100px]"
            placeholder="Enter application description"
          />
        </div>
      </div>
    </div>
  )

  const renderOrganizationAlignment = () => (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Organization Alignment</h2>
        <p className="text-gray-600">Define the organizational structure and key contacts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="techExec" className="flex items-center gap-2">
            Tech Exec
            <InfoTooltip content="Technology Executive responsible for the application" />
          </Label>
          <Input
            id="techExec"
            value={formData.techExec}
            onChange={(e) => handleChange("techExec", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter tech executive name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="managementContact" className="flex items-center gap-2">
            Management Contact
            <InfoTooltip content="Primary management contact for the application" />
          </Label>
          <Input
            id="managementContact"
            value={formData.managementContact}
            onChange={(e) => handleChange("managementContact", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter management contact"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationManager" className="flex items-center gap-2">
            Application Manager
            <InfoTooltip content="Manager responsible for application operations" />
          </Label>
          <Input
            id="applicationManager"
            value={formData.applicationManager}
            onChange={(e) => handleChange("applicationManager", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter application manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio" className="flex items-center gap-2">
            Portfolio
            <InfoTooltip content="Portfolio this application belongs to" />
          </Label>
          <Select value={formData.portfolio} onValueChange={(value) => handleChange("portfolio", value)}>
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
          <Label htmlFor="portfolioLead" className="flex items-center gap-2">
            Portfolio Lead
            <InfoTooltip content="Lead person for the portfolio" />
          </Label>
          <Input
            id="portfolioLead"
            value={formData.portfolioLead}
            onChange={(e) => handleChange("portfolioLead", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter portfolio lead"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team" className="flex items-center gap-2">
            Team
            <InfoTooltip content="Team responsible for the application" />
          </Label>
          <Input
            id="team"
            value={formData.team}
            onChange={(e) => handleChange("team", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter team name"
          />
        </div>
      </div>
    </div>
  )

  const renderSupportAlignment = () => (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Support Alignment</h2>
        <p className="text-gray-600">Configure support team and contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="apsSupport" className="flex items-center gap-2">
            APS Support Manager
            <InfoTooltip content="Application Production Support Manager" />
          </Label>
          <Input
            id="apsSupport"
            value={formData.apsSupport}
            onChange={(e) => handleChange("apsSupport", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter APS support manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="l2SupportGroup" className="flex items-center gap-2">
            L2 Support Group
            <InfoTooltip content="Level 2 support group identifier" />
          </Label>
          <Input
            id="l2SupportGroup"
            value={formData.l2SupportGroup}
            onChange={(e) => handleChange("l2SupportGroup", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter L2 support group"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apsTechnicalLead" className="flex items-center gap-2">
            APS Technical Lead
            <InfoTooltip content="Technical lead for APS" />
          </Label>
          <Input
            id="apsTechnicalLead"
            value={formData.apsTechnicalLead}
            onChange={(e) => handleChange("apsTechnicalLead", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Enter technical lead"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supportModel" className="flex items-center gap-2">
            Support Model
            <InfoTooltip content="Type of support model used" />
          </Label>
          <Select value={formData.supportModel} onValueChange={(value) => handleChange("supportModel", value)}>
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
          <Label htmlFor="escalationPath" className="flex items-center gap-2">
            Escalation Path
            <InfoTooltip content="Support escalation procedure" />
          </Label>
          <Textarea
            id="escalationPath"
            value={formData.escalationPath}
            onChange={(e) => handleChange("escalationPath", e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Define escalation path"
          />
        </div>
      </div>
    </div>
  )

  const renderOther = () => (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Other Information</h2>
        <p className="text-gray-600">Additional tracking and metadata information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="updatedBy" className="flex items-center gap-2">
            Updated By
            <InfoTooltip content="Person who last updated this record" />
          </Label>
          <Input id="updatedBy" value={formData.updatedBy} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="updatedDate" className="flex items-center gap-2">
            Updated Date
            <InfoTooltip content="Date when this record was last updated" />
          </Label>
          <Input id="updatedDate" value={formData.updatedDate} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdBy" className="flex items-center gap-2">
            Created By
            <InfoTooltip content="Person who created this record" />
          </Label>
          <Input id="createdBy" value={formData.createdBy} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdDate" className="flex items-center gap-2">
            Created Date
            <InfoTooltip content="Date when this record was created" />
          </Label>
          <Input id="createdDate" value={formData.createdDate} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version" className="flex items-center gap-2">
            Version
            <InfoTooltip content="Current version of the application record" />
          </Label>
          <Input id="version" value={formData.version} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="flex items-center gap-2">
            Status
            <InfoTooltip content="Current status of the application" />
          </Label>
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Application Setup Wizard</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Guided Tour
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {sections.length}
            </span>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = index === currentStep
            const isCompleted = completedSteps.includes(index)
            const isClickable = index <= currentStep || isCompleted

            return (
              <div key={section.id} className="flex items-center">
                <button
                  onClick={() => isClickable && handleStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive && "bg-blue-50 border-2 border-blue-200",
                    isCompleted && "bg-green-50 border-2 border-green-200",
                    !isActive && !isCompleted && "hover:bg-gray-50",
                    !isClickable && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
                      isActive && "bg-blue-500 text-white",
                      isCompleted && "bg-green-500 text-white",
                      !isActive && !isCompleted && "bg-gray-200 text-gray-600",
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div className="text-left">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isActive && "text-blue-700",
                        isCompleted && "text-green-700",
                        !isActive && !isCompleted && "text-gray-600",
                      )}
                    >
                      {section.title}
                    </div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
                {index < sections.length - 1 && <div className="w-8 h-px bg-gray-300 mx-2" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-8">{renderCurrentSection()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
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
                  completedSteps.includes(index) && "bg-green-500",
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
