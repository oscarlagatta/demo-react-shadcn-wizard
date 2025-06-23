"use client"

import type React from "react"

import type { UseFormReturn } from "react-hook-form"
import { FileText, Calendar, Info } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MultiSelect } from "@/components/ui/multi-select"
import { useRegions, useRto, useRpo, useRtoRpoApprovers } from "@/lib/hooks/use-configuration-data"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"
import { cn } from "@/lib/utils"

interface ApplicationDetailsSectionProps {
  form: UseFormReturn<FullConfigurationForm>
  isEditMode: boolean
}

// Enhanced Tooltip component with field change indicator
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

// Enhanced FormField wrapper with change indicator
const EnhancedFormField = ({
  children,
  fieldName,
  form,
}: {
  children: React.ReactNode
  fieldName: keyof FullConfigurationForm
  form: UseFormReturn<FullConfigurationForm>
}) => {
  const isFieldDirty = form.formState.dirtyFields[fieldName]
  const hasFieldError = form.formState.errors[fieldName]

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        isFieldDirty && "bg-orange-50 p-2 rounded-md border border-orange-200",
        hasFieldError && "bg-red-50 p-2 rounded-md border border-red-200",
      )}
    >
      {isFieldDirty && <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
      {children}
    </div>
  )
}

export function ApplicationDetailsSection({ form, isEditMode }: ApplicationDetailsSectionProps) {
  const { data: regions = [], isLoading: regionsLoading } = useRegions()
  const { data: rtoOptions = [], isLoading: rtoLoading } = useRto()
  const { data: rpoOptions = [], isLoading: rpoLoading } = useRpo()
  const { data: approvers = [], isLoading: approversLoading } = useRtoRpoApprovers()

  // Helper functions for display values
  const getRTODisplayValue = (value: string) => {
    const option = rtoOptions.find((opt) => opt.value === value)
    return option?.label || value
  }

  const getRPODisplayValue = (value: string) => {
    const option = rpoOptions.find((opt) => opt.value === value)
    return option?.label || value
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

  return (
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
          <EnhancedFormField fieldName="applicationId" form={form}>
            <FormField
              control={form.control}
              name="applicationId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Application ID <InfoTooltip content="Unique identifier for the application" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-gray-50 h-9 lg:h-10 xl:h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="applicationName" form={form}>
            <FormField
              control={form.control}
              name="applicationName"
              render={({ field }) => (
                <FormItem className="space-y-2 2xl:col-span-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Application Name <InfoTooltip content="Full name of the application" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditMode}
                      className={cn(
                        "h-9 lg:h-10 xl:h-11",
                        !isEditMode && "bg-gray-50",
                        isEditMode && "focus:ring-2 focus:ring-blue-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="shortName" form={form}>
            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Short Name <InfoTooltip content="Abbreviated name for the application" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditMode}
                      maxLength={10}
                      className={cn(
                        "h-9 lg:h-10 xl:h-11",
                        !isEditMode && "bg-gray-50",
                        isEditMode && "focus:ring-2 focus:ring-blue-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="region" form={form}>
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Region <InfoTooltip content="Geographic regions where the application operates" />
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={regions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select regions..."
                      disabled={!isEditMode || regionsLoading}
                      className={cn(
                        !isEditMode && "[&>button]:bg-gray-50",
                        isEditMode && "[&>button]:focus:ring-2 [&>button]:focus:ring-blue-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="status" form={form}>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Status <InfoTooltip content="Current application status" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center h-9 lg:h-10 xl:h-11">
                      <Badge
                        variant="default"
                        className={cn(
                          "text-xs lg:text-sm",
                          field.value === "In Production" && "bg-green-100 text-green-800",
                          field.value === "Retired" && "bg-gray-100 text-gray-800",
                        )}
                      >
                        {field.value}
                      </Badge>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="twoDot" form={form}>
            <FormField
              control={form.control}
              name="twoDot"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Two Dot <InfoTooltip content="Two-level application categorization code" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditMode}
                      maxLength={5}
                      className={cn(
                        "h-9 lg:h-10 xl:h-11",
                        !isEditMode && "bg-gray-50",
                        isEditMode && "focus:ring-2 focus:ring-blue-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="twoDotDesc" form={form}>
            <FormField
              control={form.control}
              name="twoDotDesc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Two Dot Description <InfoTooltip content="Description of the two-dot categorization" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditMode}
                      className={cn(
                        "h-9 lg:h-10 xl:h-11",
                        !isEditMode && "bg-gray-50",
                        isEditMode && "focus:ring-2 focus:ring-blue-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="threeDot" form={form}>
            <FormField
              control={form.control}
              name="threeDot"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Three Dot <InfoTooltip content="Three-level application categorization code" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditMode}
                      maxLength={5}
                      className={cn(
                        "h-9 lg:h-10 xl:h-11",
                        !isEditMode && "bg-gray-50",
                        isEditMode && "focus:ring-2 focus:ring-blue-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="threeDotDesc" form={form}>
            <FormField
              control={form.control}
              name="threeDotDesc"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Three Dot Description <InfoTooltip content="Description of the three-dot categorization" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditMode}
                      className={cn(
                        "h-9 lg:h-10 xl:h-11",
                        !isEditMode && "bg-gray-50",
                        isEditMode && "focus:ring-2 focus:ring-blue-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>
        </div>

        <EnhancedFormField fieldName="description" form={form}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Description{" "}
                  <InfoTooltip content="Detailed description of the application functionality and purpose" />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!isEditMode}
                    className={cn(
                      "min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] text-sm lg:text-base",
                      !isEditMode && "bg-gray-50",
                      isEditMode && "focus:ring-2 focus:ring-blue-500",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EnhancedFormField>
      </div>

      {/* Recovery & Performance Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Recovery & Performance Objectives
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <EnhancedFormField fieldName="rto" form={form}>
            <FormField
              control={form.control}
              name="rto"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    RTO (Recovery Time Objective) <InfoTooltip content="Maximum acceptable time to restore service" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode || rtoLoading}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue placeholder="Select RTO" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rtoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="rpo" form={form}>
            <FormField
              control={form.control}
              name="rpo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    RPO (Recovery Point Objective) <InfoTooltip content="Maximum acceptable amount of data loss" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode || rpoLoading}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue placeholder="Select RPO" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rpoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="rtoApprover" form={form}>
            <FormField
              control={form.control}
              name="rtoApprover"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    RTO/RPO Approver <InfoTooltip content="Person who approved the RTO/RPO settings" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode || approversLoading}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue placeholder="Select Approver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {approvers.map((approver) => (
                        <SelectItem key={approver.value} value={approver.value}>
                          {approver.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="rtoApproveDate" form={form}>
            <FormField
              control={form.control}
              name="rtoApproveDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    RTO/RPO Approve Date <InfoTooltip content="Date when RTO/RPO was approved" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="date"
                        disabled={!isEditMode}
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>
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
          <EnhancedFormField fieldName="usesMainframe" form={form}>
            <FormField
              control={form.control}
              name="usesMainframe"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Uses Mainframe <InfoTooltip content="Whether the application uses mainframe technology" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="partial">Partial (Some components)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>

          <EnhancedFormField fieldName="applicationHosting" form={form}>
            <FormField
              control={form.control}
              name="applicationHosting"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Application Hosting <InfoTooltip content="Where and how the application is hosted" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in-house">In-house (Bank network)</SelectItem>
                      <SelectItem value="cloud-public">Public Cloud</SelectItem>
                      <SelectItem value="cloud-private">Private Cloud</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="third-party">Third-party hosted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EnhancedFormField>
        </div>
      </div>

      {/* Enhanced Summary Section */}
      <div
        className={cn(
          "mt-6 lg:mt-8 p-4 lg:p-6 border rounded-lg transition-all duration-200",
          form.formState.isDirty ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200",
        )}
      >
        <h4
          className={cn(
            "font-semibold mb-3 text-sm lg:text-base",
            form.formState.isDirty ? "text-orange-800" : "text-blue-800",
          )}
        >
          Configuration Summary
          {form.formState.isDirty && (
            <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">Modified</span>
          )}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className={cn("font-medium", form.formState.isDirty ? "text-orange-700" : "text-blue-700")}>
              RTO:
            </span>{" "}
            <span className={cn("break-words", form.formState.isDirty ? "text-orange-600" : "text-blue-600")}>
              {getRTODisplayValue(form.watch("rto"))}
            </span>
          </div>
          <div>
            <span className={cn("font-medium", form.formState.isDirty ? "text-orange-700" : "text-blue-700")}>
              RPO:
            </span>{" "}
            <span className={cn("break-words", form.formState.isDirty ? "text-orange-600" : "text-blue-600")}>
              {getRPODisplayValue(form.watch("rpo"))}
            </span>
          </div>
          <div>
            <span className={cn("font-medium", form.formState.isDirty ? "text-orange-700" : "text-blue-700")}>
              Hosting:
            </span>{" "}
            <span className={cn("break-words", form.formState.isDirty ? "text-orange-600" : "text-blue-600")}>
              {getHostingDisplayValue(form.watch("applicationHosting"))}
            </span>
          </div>
          <div>
            <span className={cn("font-medium", form.formState.isDirty ? "text-orange-700" : "text-blue-700")}>
              Mainframe:
            </span>{" "}
            <span className={cn(form.formState.isDirty ? "text-orange-600" : "text-blue-600")}>
              {form.watch("usesMainframe") === "yes" ? "Yes" : form.watch("usesMainframe") === "no" ? "No" : "Partial"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
