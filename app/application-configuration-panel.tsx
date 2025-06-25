"use client"

import { useState, useEffect } from "react"
import { useForm } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Headphones,
  MapPin,
  Edit,
  Save,
  X,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { ApplicationDetailsSection } from "@/components/configuration/application-details-section"
import { useConfiguration, useSaveConfiguration } from "@/lib/hooks/use-configuration-data"
import { fullConfigurationSchema, type FullConfigurationForm } from "@/lib/schemas/configuration"

import { OrganizationAlignmentSection } from "@/components/configuration/organization-alignment-section"
import { SupportAlignmentSection } from "@/components/configuration/support-alignment-section"
import { OtherInformationSection } from "@/components/configuration/other-information-section"

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
  const [currentSection, setCurrentSection] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const { toast } = useToast()

  const applicationId = "100" // This would come from props or route params

  const { data: configurationData, isLoading, error } = useConfiguration(applicationId)
  const saveConfigurationMutation = useSaveConfiguration()

  const form = useForm<FullConfigurationForm>({
    resolver: zodResolver(fullConfigurationSchema),
    defaultValues: {
      applicationId: "",
      applicationName: "",
      shortName: "",
      region: [],
      twoDot: "",
      twoDotDesc: "",
      threeDot: "",
      threeDotDesc: "",
      description: "",
      rto: "",
      rpo: "",
      rtoApprover: "",
      rtoApproveDate: "",
      usesMainframe: "no",
      applicationHosting: "in-house",
      status: "",
      techExec: "",
      managementContact: "",
      applicationManager: "",
      portfolio: "",
      portfolioLead: "",
      team: "",
      organization: "",
      lineOfBusiness: "",
      aligningOrg: "",
      apsSupport: "",
      apsTechnicalLead: "",
      l2SupportGroup: "",
      l2SupportContact: "",
      supportContact: "",
      supportContactEmail: "",
      bpsSupported: "no",
      supportModel: "",
      escalationPath: "",
      supportRegion: "",
      supportTimezone: "",
      updatedBy: "",
      updatedDate: "",
      lastAttestedDate: "",
      attestedBy: "",
      nextDueAttestedDate: "",
      createdBy: "",
      createdDate: "",
      version: "",
    },
  })

  // Load configuration data into form
  useEffect(() => {
    if (configurationData) {
      form.reset(configurationData)
    }
  }, [configurationData, form])

  // Calculate progress through sections
  const progress = ((currentSection + 1) / configurationSections.length) * 100

  // Check if form has unsaved changes
  const hasUnsavedChanges = form.formState.isDirty

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
      form.reset(configurationData)
    }
    setIsEditMode(!isEditMode)
  }

  const handleSave = async (data: FullConfigurationForm) => {
    try {
      // Only send the editable fields to the server
      const editableData = {
        ...configurationData, // Keep existing data
        region: data.region,
        portfolio: data.portfolio,
        team: data.team,
        organization: data.organization,
        lineOfBusiness: data.lineOfBusiness,
        apsSupport: data.apsSupport,
        apsTechnicalLead: data.apsTechnicalLead,
        l2SupportGroup: data.l2SupportGroup,
        bpsSupported: data.bpsSupported,
        supportModel: data.supportModel,
      }

      await saveConfigurationMutation.mutateAsync(editableData)
      setIsEditMode(false)
      form.reset(editableData) // Reset form state to mark as clean
      toast({
        title: "Success",
        description: "Configuration saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return <ApplicationDetailsSection form={form} isEditMode={isEditMode} />
      case 1:
        return <OrganizationAlignmentSection form={form} isEditMode={isEditMode} />
      case 2:
        return <SupportAlignmentSection form={form} isEditMode={isEditMode} />
      case 3:
        return <OtherInformationSection form={form} isEditMode={isEditMode} />
      default:
        return <ApplicationDetailsSection form={form} isEditMode={isEditMode} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading configuration...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load configuration. Please try again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full">
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
                {saveConfigurationMutation.isPending && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Saving...
                  </Badge>
                )}
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                {form.watch("applicationId")} - {form.watch("applicationName")}
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
                  onClick={form.handleSubmit(handleSave)}
                  className="flex items-center space-x-2 h-9 lg:h-10 bg-green-600 hover:bg-green-700"
                  disabled={!hasUnsavedChanges || saveConfigurationMutation.isPending}
                >
                  {saveConfigurationMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saveConfigurationMutation.isPending ? "Saving..." : "Save Changes"}</span>
                </Button>
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  className="flex items-center space-x-2 h-9 lg:h-10"
                  disabled={saveConfigurationMutation.isPending}
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-10">{renderCurrentSection()}</CardContent>
            </Card>
          </form>
        </Form>

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
          <Alert className="mt-4 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have unsaved changes. Remember to save before leaving.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
