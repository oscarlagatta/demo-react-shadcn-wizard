"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, ChevronUp, Info, Edit, Save, X, AlertCircle, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HistoryModal } from "@/components/history/history-modal"
import { HistoryDiagnostics } from "@/components/history/history-diagnostics"
import {
  applicationDetailsSchema,
  organizationAlignmentSchema,
  supportAlignmentSchema,
  type ApplicationDetailsFormData,
  type OrganizationAlignmentFormData,
  type SupportAlignmentFormData,
} from "@/lib/validation-schemas"

export default function ApplicationDetailsPage() {
  const [expandedSections, setExpandedSections] = useState({
    applicationDetails: true,
    organizationAlignment: true,
    supportAlignment: true,
    other: true,
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const [validationStatus, setValidationStatus] = useState({
    applicationDetails: true,
    organizationAlignment: true,
    supportAlignment: true,
  })

  // Form instances for each section
  const applicationDetailsForm = useForm<ApplicationDetailsFormData>({
    resolver: zodResolver(applicationDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      shortName: "AAR",
      region: "APAC, LATAM",
      twoDot: "VM",
      twoDotDesc: "GCIB AND GTS TECH",
      threeDot: "VMB",
      threeDotDesc: "GCIB AND GTS TECH",
      description:
        "Performs all billing and receivables functions for analyzed accounts. It provides a GUI interface for billed accounts to recognize income. Collections are done via direct debit of customer accounts or by checks remitted to Bank Physical Lockboxes.",
      rto: "Tier 5: Greater than 24 hours, up to and including 48 hours",
      rpo: "Tier 5: Daily backup: Greater than 4 hours, up to and including 24 hours",
      rtoApprover: "Rodriguez, Maria C.",
      rtoApproveDate: "Sep 20, 2024, 6:24:51 AM",
      usesMainframe: "no",
      applicationHosting: "In-house (Hosted entirely inside the bank network)",
    },
  })

  const organizationForm = useForm<OrganizationAlignmentFormData>({
    resolver: zodResolver(organizationAlignmentSchema),
    mode: "onBlur",
    defaultValues: {
      techExec: "Thompson, Sarah K.",
      managementContact: "Chen, Michael R.",
      applicationManager: "Williams, Jennifer L.",
      portfolio: "APAC",
      portfolioLead: "Anderson, David M.",
      team: "Australia Apps",
      organisation: "",
      lineOfBusiness: "",
      aligningOrg: "GCIB AND GTS TECH",
    },
  })

  const supportForm = useForm<SupportAlignmentFormData>({
    resolver: zodResolver(supportAlignmentSchema),
    mode: "onBlur",
    defaultValues: {
      apsSupport: "Kumar, Rajesh",
      apsTechnicalLead: "Patel, Priya S.",
      l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
      l2SupportContact: "Martinez, Carlos",
      bpsSupported: "yes",
      supportModel: "bps-24x7",
    },
  })

  // Monitor form validation states
  useEffect(() => {
    const updateValidationStatus = () => {
      setValidationStatus({
        applicationDetails: applicationDetailsForm.formState.isValid,
        organizationAlignment: organizationForm.formState.isValid,
        supportAlignment: supportForm.formState.isValid,
      })
    }

    updateValidationStatus()
  }, [applicationDetailsForm.formState.isValid, organizationForm.formState.isValid, supportForm.formState.isValid])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getFieldClassName = (fieldError: any, isEditMode: boolean) => {
    const baseClass = !isEditMode ? "bg-gray-50" : ""
    const errorClass = fieldError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    return `${baseClass} ${errorClass}`.trim()
  }

  const handleEditToggle = () => {
    if (isEditMode) {
      applicationDetailsForm.reset()
      organizationForm.reset()
      supportForm.reset()
      applicationDetailsForm.clearErrors()
      organizationForm.clearErrors()
      supportForm.clearErrors()
      setValidationErrors([])
      setSaveStatus("idle")

      toast.info("Edit mode cancelled", {
        description: "All unsaved changes and validation errors have been cleared.",
      })
    } else {
      setValidationErrors([])
      setSaveStatus("idle")

      toast.info("Edit mode enabled", {
        description: "Form validation will occur as you move between fields.",
      })
    }
    setIsEditMode(!isEditMode)
  }

  const simulateApiCall = useCallback(async (data: any, sectionName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    if (Math.random() > 0.85) {
      throw new Error(`Failed to save ${sectionName}. Server temporarily unavailable.`)
    }

    return { success: true, data }
  }, [])

  const onSubmitApplicationDetails = async (data: ApplicationDetailsFormData) => {
    setIsSubmitting(true)
    try {
      await simulateApiCall(data, "application details")

      toast.success("Application details updated successfully!", {
        description: "All changes have been saved to the system.",
      })

      console.log("Application Details:", data)
    } catch (error) {
      toast.error("Failed to update application details", {
        description: "Please try again or contact support if the problem persists.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitOrganization = async (data: OrganizationAlignmentFormData) => {
    setIsSubmitting(true)
    try {
      await simulateApiCall(data, "organization alignment")

      toast.success("Organization alignment updated successfully!", {
        description: "All organizational changes have been saved.",
      })

      console.log("Organization Alignment:", data)
    } catch (error) {
      toast.error("Failed to update organization alignment", {
        description: "Please try again or contact support if the problem persists.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitSupport = async (data: SupportAlignmentFormData) => {
    setIsSubmitting(true)
    try {
      await simulateApiCall(data, "support alignment")

      toast.success("Support alignment updated successfully!", {
        description: "All support configuration changes have been saved.",
      })

      console.log("Support Alignment:", data)
    } catch (error) {
      toast.error("Failed to update support alignment", {
        description: "Please try again or contact support if the problem persists.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAll = async () => {
    const isApplicationValid = await applicationDetailsForm.trigger()
    const isOrganizationValid = await organizationForm.trigger()
    const isSupportValid = await supportForm.trigger()

    if (isApplicationValid && isOrganizationValid && isSupportValid) {
      setIsSubmitting(true)
      setSaveStatus("saving")
      try {
        await Promise.all([
          onSubmitApplicationDetails(applicationDetailsForm.getValues()),
          onSubmitOrganization(organizationForm.getValues()),
          onSubmitSupport(supportForm.getValues()),
        ])

        setIsEditMode(false)
        setSaveStatus("saved")
        toast.success("All sections updated successfully!", {
          description: "Your changes have been saved across all sections.",
        })

        setTimeout(() => setSaveStatus("idle"), 3000)
      } catch (error) {
        setSaveStatus("error")
        toast.error("Failed to save all changes", {
          description: "Some sections may not have been saved. Please try again.",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast.error("Please fix validation errors", {
        description: "Check all sections for required fields and correct any errors.",
      })
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">100 - Account Analysis Receivables (AAR)</h1>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                APAC
              </Badge>
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                UCAL
              </Badge>
              {saveStatus === "saved" && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Saved
                </Badge>
              )}
              {isEditMode && (
                <>
                  <Badge
                    variant={validationStatus.applicationDetails ? "default" : "destructive"}
                    className={
                      validationStatus.applicationDetails ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }
                  >
                    App Details {validationStatus.applicationDetails ? "✓" : "✗"}
                  </Badge>
                  <Badge
                    variant={validationStatus.organizationAlignment ? "default" : "destructive"}
                    className={
                      validationStatus.organizationAlignment ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }
                  >
                    Organization {validationStatus.organizationAlignment ? "✓" : "✗"}
                  </Badge>
                  <Badge
                    variant={validationStatus.supportAlignment ? "default" : "destructive"}
                    className={
                      validationStatus.supportAlignment ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }
                  >
                    Support {validationStatus.supportAlignment ? "✓" : "✗"}
                  </Badge>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Back
            </Button>
            <Button variant="outline" size="sm">
              myCTO
            </Button>
            <Button variant="outline" size="sm">
              AppIQ
            </Button>
            <Button variant="outline" size="sm">
              Attest Record
            </Button>
            <Button variant="outline" size="sm">
              Transfer Ownership
            </Button>

            {/* View History Button - Debug Mode */}
            <HistoryModal applicationId="100" />

            {!isEditMode ? (
              <Button size="sm" onClick={handleEditToggle}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleSaveAll}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save All"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleEditToggle} disabled={isSubmitting}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          <a href="#" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
            Application Detail
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Service & Function Alignment
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Additional Detail
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Resource Alignment
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Onboarding
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Audit Logs
          </a>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Validation Errors Summary */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Please fix the following validation errors:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Application Details Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("applicationDetails")}>
            <CardTitle className="flex items-center justify-between">
              <span>Application Details</span>
              {expandedSections.applicationDetails ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.applicationDetails && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shortName" className="flex items-center gap-2">
                    Short Name
                    <InfoTooltip content="Abbreviated name for the application" />
                  </Label>
                  <Input
                    id="shortName"
                    value={applicationDetailsForm.getValues("shortName")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.shortName, isEditMode)}
                    {...applicationDetailsForm.register("shortName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center gap-2">
                    Region
                    <InfoTooltip content="Geographic region where the application operates" />
                  </Label>
                  <Input
                    id="region"
                    value={applicationDetailsForm.getValues("region")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.region, isEditMode)}
                    {...applicationDetailsForm.register("region")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twoDot" className="flex items-center gap-2">
                    Two Dot
                    <InfoTooltip content="Two-level application categorization" />
                  </Label>
                  <Input
                    id="twoDot"
                    value={applicationDetailsForm.getValues("twoDot")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.twoDot, isEditMode)}
                    {...applicationDetailsForm.register("twoDot")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twoDotDesc" className="flex items-center gap-2">
                    Two Dot Desc
                    <InfoTooltip content="Description of the two-dot categorization" />
                  </Label>
                  <Input
                    id="twoDotDesc"
                    value={applicationDetailsForm.getValues("twoDotDesc")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.twoDotDesc, isEditMode)}
                    {...applicationDetailsForm.register("twoDotDesc")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threeDot" className="flex items-center gap-2">
                    Three Dot
                    <InfoTooltip content="Three-level application categorization" />
                  </Label>
                  <Input
                    id="threeDot"
                    value={applicationDetailsForm.getValues("threeDot")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.threeDot, isEditMode)}
                    {...applicationDetailsForm.register("threeDot")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threeDotDesc" className="flex items-center gap-2">
                    Three Dot Desc
                    <InfoTooltip content="Description of the three-dot categorization" />
                  </Label>
                  <Input
                    id="threeDotDesc"
                    value={applicationDetailsForm.getValues("threeDotDesc")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.threeDotDesc, isEditMode)}
                    {...applicationDetailsForm.register("threeDotDesc")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description
                  <InfoTooltip content="Detailed description of the application functionality" />
                </Label>
                <Textarea
                  id="description"
                  value={applicationDetailsForm.getValues("description")}
                  readOnly={!isEditMode}
                  className={`${getFieldClassName(
                    applicationDetailsForm.formState.errors.description,
                    isEditMode,
                  )} min-h-[100px]`}
                  {...applicationDetailsForm.register("description")}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rto" className="flex items-center gap-2">
                    RTO
                    <InfoTooltip content="Recovery Time Objective" />
                  </Label>
                  <Input
                    id="rto"
                    value={applicationDetailsForm.getValues("rto")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.rto, isEditMode)}
                    {...applicationDetailsForm.register("rto")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpo" className="flex items-center gap-2">
                    RPO
                    <InfoTooltip content="Recovery Point Objective" />
                  </Label>
                  <Input
                    id="rpo"
                    value={applicationDetailsForm.getValues("rpo")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.rpo, isEditMode)}
                    {...applicationDetailsForm.register("rpo")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtoApprover" className="flex items-center gap-2">
                    RTO/RPO Approver
                    <InfoTooltip content="Person who approved the RTO/RPO settings" />
                  </Label>
                  <Input
                    id="rtoApprover"
                    value={applicationDetailsForm.getValues("rtoApprover")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.rtoApprover, isEditMode)}
                    {...applicationDetailsForm.register("rtoApprover")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtoApproveDate" className="flex items-center gap-2">
                    RTO/RPO Approve Date
                    <InfoTooltip content="Date when RTO/RPO was approved" />
                  </Label>
                  <Input
                    id="rtoApproveDate"
                    value={applicationDetailsForm.getValues("rtoApproveDate")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(applicationDetailsForm.formState.errors.rtoApproveDate, isEditMode)}
                    {...applicationDetailsForm.register("rtoApproveDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usesMainframe" className="flex items-center gap-2">
                    Uses Mainframe
                    <InfoTooltip content="Whether the application uses mainframe technology" />
                  </Label>
                  <Select
                    value={applicationDetailsForm.getValues("usesMainframe")}
                    disabled={!isEditMode}
                    onValueChange={applicationDetailsForm.setValue.bind(null, "usesMainframe")}
                  >
                    <SelectTrigger
                      className={getFieldClassName(applicationDetailsForm.formState.errors.usesMainframe, isEditMode)}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationHosting" className="flex items-center gap-2">
                    Application Hosting
                    <InfoTooltip content="Where the application is hosted" />
                  </Label>
                  <Input
                    id="applicationHosting"
                    value={applicationDetailsForm.getValues("applicationHosting")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(
                      applicationDetailsForm.formState.errors.applicationHosting,
                      isEditMode,
                    )}
                    {...applicationDetailsForm.register("applicationHosting")}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Organization Alignment Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("organizationAlignment")}>
            <CardTitle className="flex items-center justify-between">
              <span>Organization Alignment</span>
              {expandedSections.organizationAlignment ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.organizationAlignment && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="techExec" className="flex items-center gap-2">
                    Tech Exec
                    <InfoTooltip content="Technology Executive responsible for the application" />
                  </Label>
                  <Input
                    id="techExec"
                    value={organizationForm.getValues("techExec")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.techExec, isEditMode)}
                    {...organizationForm.register("techExec")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managementContact" className="flex items-center gap-2">
                    Management Contact
                    <InfoTooltip content="Primary management contact for the application" />
                  </Label>
                  <Input
                    id="managementContact"
                    value={organizationForm.getValues("managementContact")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.managementContact, isEditMode)}
                    {...organizationForm.register("managementContact")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationManager" className="flex items-center gap-2">
                    Application Manager
                    <InfoTooltip content="Manager responsible for application operations" />
                  </Label>
                  <Input
                    id="applicationManager"
                    value={organizationForm.getValues("applicationManager")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.applicationManager, isEditMode)}
                    {...organizationForm.register("applicationManager")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="flex items-center gap-2">
                    Portfolio
                    <InfoTooltip content="Portfolio this application belongs to" />
                  </Label>
                  <Input
                    id="portfolio"
                    value={organizationForm.getValues("portfolio")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.portfolio, isEditMode)}
                    {...organizationForm.register("portfolio")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioLead" className="flex items-center gap-2">
                    Portfolio Lead
                    <InfoTooltip content="Lead person for the portfolio" />
                  </Label>
                  <Input
                    id="portfolioLead"
                    value={organizationForm.getValues("portfolioLead")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.portfolioLead, isEditMode)}
                    {...organizationForm.register("portfolioLead")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team" className="flex items-center gap-2">
                    Team
                    <InfoTooltip content="Team responsible for the application" />
                  </Label>
                  <Input
                    id="team"
                    value={organizationForm.getValues("team")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.team, isEditMode)}
                    {...organizationForm.register("team")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organisation" className="flex items-center gap-2">
                    Organisation
                    <InfoTooltip content="Organization unit" />
                  </Label>
                  <Input
                    id="organisation"
                    value={organizationForm.getValues("organisation")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.organisation, isEditMode)}
                    {...organizationForm.register("organisation")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineOfBusiness" className="flex items-center gap-2">
                    Line Of Business
                    <InfoTooltip content="Business line this application supports" />
                  </Label>
                  <Input
                    id="lineOfBusiness"
                    value={organizationForm.getValues("lineOfBusiness")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.lineOfBusiness, isEditMode)}
                    {...organizationForm.register("lineOfBusiness")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aligningOrg" className="flex items-center gap-2">
                    Aligning Org
                    <InfoTooltip content="Aligning organization" />
                  </Label>
                  <Input
                    id="aligningOrg"
                    value={organizationForm.getValues("aligningOrg")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(organizationForm.formState.errors.aligningOrg, isEditMode)}
                    {...organizationForm.register("aligningOrg")}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Support Alignment Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("supportAlignment")}>
            <CardTitle className="flex items-center justify-between">
              <span>Support Alignment</span>
              {expandedSections.supportAlignment ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.supportAlignment && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apsSupport" className="flex items-center gap-2">
                    APS Support Manager
                    <InfoTooltip content="Application Production Support Manager" />
                  </Label>
                  <Input
                    id="apsSupport"
                    value={supportForm.getValues("apsSupport")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(supportForm.formState.errors.apsSupport, isEditMode)}
                    {...supportForm.register("apsSupport")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apsTechnicalLead" className="flex items-center gap-2">
                    APS Technical Lead
                    <InfoTooltip content="Technical lead for APS" />
                  </Label>
                  <Input
                    id="apsTechnicalLead"
                    value={supportForm.getValues("apsTechnicalLead")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(supportForm.formState.errors.apsTechnicalLead, isEditMode)}
                    {...supportForm.register("apsTechnicalLead")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l2SupportGroup" className="flex items-center gap-2">
                    L2 Support Group
                    <InfoTooltip content="Level 2 support group identifier" />
                  </Label>
                  <Input
                    id="l2SupportGroup"
                    value={supportForm.getValues("l2SupportGroup")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(supportForm.formState.errors.l2SupportGroup, isEditMode)}
                    {...supportForm.register("l2SupportGroup")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l2SupportContact" className="flex items-center gap-2">
                    L2 Support Contact
                    <InfoTooltip content="Level 2 support contact person" />
                  </Label>
                  <Input
                    id="l2SupportContact"
                    value={supportForm.getValues("l2SupportContact")}
                    readOnly={!isEditMode}
                    className={getFieldClassName(supportForm.formState.errors.l2SupportContact, isEditMode)}
                    {...supportForm.register("l2SupportContact")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bpsSupported" className="flex items-center gap-2">
                    BPS Supported
                    <InfoTooltip content="Business Process Support availability" />
                  </Label>
                  <Select
                    value={supportForm.getValues("bpsSupported")}
                    disabled={!isEditMode}
                    onValueChange={supportForm.setValue.bind(null, "bpsSupported")}
                  >
                    <SelectTrigger className={getFieldClassName(supportForm.formState.errors.bpsSupported, isEditMode)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportModel" className="flex items-center gap-2">
                    Support Model
                    <InfoTooltip content="Type of support model used" />
                  </Label>
                  <Select
                    value={supportForm.getValues("supportModel")}
                    disabled={!isEditMode}
                    onValueChange={supportForm.setValue.bind(null, "supportModel")}
                  >
                    <SelectTrigger className={getFieldClassName(supportForm.formState.errors.supportModel, isEditMode)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bps-24x7">BPS - 24x7</SelectItem>
                      <SelectItem value="bps-business-hours">BPS - Business Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Other Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("other")}>
            <CardTitle className="flex items-center justify-between">
              <span>Other</span>
              {expandedSections.other ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.other && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="updatedBy" className="flex items-center gap-2">
                    Updated By
                    <InfoTooltip content="Person who last updated this record" />
                  </Label>
                  <Input id="updatedBy" value="Kumar, Rajesh" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updatedDate" className="flex items-center gap-2">
                    Updated Date
                    <InfoTooltip content="Date when this record was last updated" />
                  </Label>
                  <Input id="updatedDate" value="Oct 30, 2024, 2:38:48 PM" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastAttestedDate" className="flex items-center gap-2">
                    Last Attested Date
                    <InfoTooltip content="Date when this record was last attested" />
                  </Label>
                  <Input id="lastAttestedDate" value="Oct 24, 2024, 10:25:31 AM" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attestedBy" className="flex items-center gap-2">
                    Attested By
                    <InfoTooltip content="Person who last attested this record" />
                  </Label>
                  <Input id="attestedBy" value="Kumar, Rajesh" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextDueAttestedDate" className="flex items-center gap-2">
                    Next Due Attested Date
                    <InfoTooltip content="Next date when attestation is due" />
                  </Label>
                  <Input id="nextDueAttestedDate" value="Mar 31, 2025, 12:00:00 AM" readOnly className="bg-gray-50" />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
      {/* Diagnostic Panel - Remove in production */}
      <div className="mt-8 border-t pt-6">
        <HistoryDiagnostics />
      </div>
    </div>
  )
}
