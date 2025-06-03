"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Info, Edit, Save, X } from "lucide-react"
import { useForm } from "react"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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

  const [validationStatus, setValidationStatus] = useState({
    applicationDetails: true,
    organizationAlignment: true,
    supportAlignment: true,
  })

  // Form instances for each section
  const applicationDetailsForm = useForm<ApplicationDetailsFormData>({
    resolver: zodResolver(applicationDetailsSchema),
    mode: "onBlur", // Add this line for blur-triggered validation
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
    mode: "onBlur", // Add this line for blur-triggered validation
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
    mode: "onBlur", // Add this line for blur-triggered validation
    defaultValues: {
      apsSupport: "Kumar, Rajesh",
      apsTechnicalLead: "Patel, Priya S.",
      l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
      l2SupportContact: "Martinez, Carlos",
      bpsSupported: "yes",
      supportModel: "bps-24x7",
    },
  })

  // Add useEffect to monitor form validation states
  useEffect(() => {
    const updateValidationStatus = () => {
      setValidationStatus({
        applicationDetails: applicationDetailsForm.formState.isValid,
        organizationAlignment: organizationForm.formState.isValid,
        supportAlignment: supportForm.formState.isValid,
      })
    }

    // Update validation status when form states change
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
      // Reset forms to original values when canceling
      applicationDetailsForm.reset()
      organizationForm.reset()
      supportForm.reset()

      // Clear any validation errors
      applicationDetailsForm.clearErrors()
      organizationForm.clearErrors()
      supportForm.clearErrors()

      toast.info("Edit mode cancelled", {
        description: "All unsaved changes and validation errors have been cleared.",
      })
    } else {
      toast.info("Edit mode enabled", {
        description: "Form validation will occur as you move between fields.",
      })
    }
    setIsEditMode(!isEditMode)
  }

  const handleValidationFeedback = (fieldName: string, isValid: boolean) => {
    if (!isValid && isEditMode) {
      // Optional: You can add subtle feedback here if needed
      // For now, we'll rely on the field-level error messages
    }
  }

  const onSubmitApplicationDetails = async (data: ApplicationDetailsFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
      try {
        // Submit all forms
        await Promise.all([
          onSubmitApplicationDetails(applicationDetailsForm.getValues()),
          onSubmitOrganization(organizationForm.getValues()),
          onSubmitSupport(supportForm.getValues()),
        ])

        setIsEditMode(false)
        toast.success("All sections updated successfully!", {
          description: "Your changes have been saved across all sections.",
        })
      } catch (error) {
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
              <Form {...applicationDetailsForm}>
                <form onSubmit={applicationDetailsForm.handleSubmit(onSubmitApplicationDetails)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={applicationDetailsForm.control}
                      name="shortName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Short Name *
                            <InfoTooltip content="Abbreviated name for the application (uppercase letters and numbers only)" />
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditMode}
                              className={getFieldClassName(fieldState.error, isEditMode)}
                              placeholder="Enter short name (e.g., AAR)"
                            />
                          </FormControl>
                          <FormMessage />
                          {fieldState.error && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Tip: Use only uppercase letters and numbers
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Region
                            <InfoTooltip content="Geographic region where the application operates" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="twoDot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Two Dot
                            <InfoTooltip content="Two-level application categorization" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="twoDotDesc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Two Dot Desc
                            <InfoTooltip content="Description of the two-dot categorization" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="threeDot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Three Dot
                            <InfoTooltip content="Three-level application categorization" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="threeDotDesc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Three Dot Desc
                            <InfoTooltip content="Description of the three-dot categorization" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={applicationDetailsForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Description
                          <InfoTooltip content="Detailed description of the application functionality" />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditMode}
                            className={`min-h-[100px] ${!isEditMode ? "bg-gray-50" : ""}`}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive description of the application's purpose and functionality.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={applicationDetailsForm.control}
                      name="rto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            RTO
                            <InfoTooltip content="Recovery Time Objective" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="rpo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            RPO
                            <InfoTooltip content="Recovery Point Objective" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="rtoApprover"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            RTO/RPO Approver
                            <InfoTooltip content="Person who approved the RTO/RPO settings" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="rtoApproveDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            RTO/RPO Approve Date
                            <InfoTooltip content="Date when RTO/RPO was approved" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="usesMainframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Uses Mainframe
                            <InfoTooltip content="Whether the application uses mainframe technology" />
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditMode}>
                            <FormControl>
                              <SelectTrigger className={!isEditMode ? "bg-gray-50" : ""}>
                                <SelectValue placeholder="Select mainframe usage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationDetailsForm.control}
                      name="applicationHosting"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Application Hosting
                            <InfoTooltip content="Where the application is hosted" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditMode && (
                    <div className="flex justify-end space-x-2">
                      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? "Saving..." : "Save Application Details"}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
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
              <Form {...organizationForm}>
                <form onSubmit={organizationForm.handleSubmit(onSubmitOrganization)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={organizationForm.control}
                      name="techExec"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Tech Exec
                            <InfoTooltip content="Technology Executive responsible for the application" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="managementContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Management Contact
                            <InfoTooltip content="Primary management contact for the application" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="applicationManager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Application Manager
                            <InfoTooltip content="Manager responsible for application operations" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Portfolio
                            <InfoTooltip content="Portfolio this application belongs to" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="portfolioLead"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Portfolio Lead
                            <InfoTooltip content="Lead person for the portfolio" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Team
                            <InfoTooltip content="Team responsible for the application" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="organisation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Organisation
                            <InfoTooltip content="Organization unit" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="lineOfBusiness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Line Of Business
                            <InfoTooltip content="Business line this application supports" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="aligningOrg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Aligning Org
                            <InfoTooltip content="Aligning organization" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditMode && (
                    <div className="flex justify-end space-x-2">
                      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? "Saving..." : "Save Organization Alignment"}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
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
              <Form {...supportForm}>
                <form onSubmit={supportForm.handleSubmit(onSubmitSupport)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={supportForm.control}
                      name="apsSupport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            APS Support Manager
                            <InfoTooltip content="Application Production Support Manager" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={supportForm.control}
                      name="apsTechnicalLead"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            APS Technical Lead
                            <InfoTooltip content="Technical lead for APS" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={supportForm.control}
                      name="l2SupportGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            L2 Support Group
                            <InfoTooltip content="Level 2 support group identifier" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={supportForm.control}
                      name="l2SupportContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            L2 Support Contact
                            <InfoTooltip content="Level 2 support contact person" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={supportForm.control}
                      name="bpsSupported"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            BPS Supported
                            <InfoTooltip content="Business Process Support availability" />
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditMode}>
                            <FormControl>
                              <SelectTrigger className={!isEditMode ? "bg-gray-50" : ""}>
                                <SelectValue placeholder="Select BPS support status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={supportForm.control}
                      name="supportModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Support Model
                            <InfoTooltip content="Type of support model used" />
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditMode}>
                            <FormControl>
                              <SelectTrigger className={!isEditMode ? "bg-gray-50" : ""}>
                                <SelectValue placeholder="Select support model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bps-24x7">BPS - 24x7</SelectItem>
                              <SelectItem value="bps-business-hours">BPS - Business Hours</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditMode && (
                    <div className="flex justify-end space-x-2">
                      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? "Saving..." : "Save Support Alignment"}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          )}
        </Card>

        {/* Other Section - Read Only */}
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
    </div>
  )
}
