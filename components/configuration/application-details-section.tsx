"use client"

import type { UseFormReturn } from "react-hook-form"
import { FileText, Info, Calendar } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"

interface ApplicationDetailsSectionProps {
  form: UseFormReturn<FullConfigurationForm>
  isEditMode: boolean
}

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

export function ApplicationDetailsSection({ form, isEditMode }: ApplicationDetailsSectionProps) {
  const watchedValues = form.watch()

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
          Basic application information and technical specifications
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Basic Information</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="aitNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    AIT Number <InfoTooltip content="Application Identification Number" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value?.toString() || ""}
                      disabled={true}
                      className={cn("h-9 lg:h-10 xl:h-11", "bg-gray-50")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="aitName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Application Name <InfoTooltip content="Full name of the application" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
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
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="aitShortname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Short Name <InfoTooltip content="Abbreviated name or acronym" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
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
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="regionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Region <InfoTooltip content="Geographic region where the application operates" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AMRS">Americas</SelectItem>
                      <SelectItem value="APAC">APAC</SelectItem>
                      <SelectItem value="EMEA">EMEA</SelectItem>
                      <SelectItem value="GLOBAL">Global</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="appStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Status <InfoTooltip content="Current operational status of the application" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="In Production">In Production</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Technical Hierarchy Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Technical Hierarchy
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="twoDot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Two Dot <InfoTooltip content="Second level technical hierarchy identifier" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
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
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="twoDotDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Two Dot Description <InfoTooltip content="Description of the two dot hierarchy" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      disabled={true}
                      className={cn("h-9 lg:h-10 xl:h-11", "bg-gray-50")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="threeDot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Three Dot <InfoTooltip content="Third level technical hierarchy identifier" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
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
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="threeDotDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Three Dot Description <InfoTooltip content="Description of the three dot hierarchy" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      disabled={true}
                      className={cn("h-9 lg:h-10 xl:h-11", "bg-gray-50")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Application Description */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Description</h4>
        </div>

        <FormField
          control={form.control}
          name="aitDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm lg:text-base">
                Application Description{" "}
                <InfoTooltip content="Detailed description of the application's purpose and functionality" />
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  disabled={!isEditMode}
                  rows={4}
                  className={cn(
                    "resize-none",
                    !isEditMode && "bg-gray-50",
                    isEditMode && "focus:ring-2 focus:ring-blue-500",
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Recovery & Hosting Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-orange-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Recovery & Hosting</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="rto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    RTO <InfoTooltip content="Recovery Time Objective - Maximum acceptable downtime" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
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
                      <SelectItem value="Tier 1: Immediate (0-15 minutes)">Tier 1: Immediate</SelectItem>
                      <SelectItem value="Tier 2: 15 minutes to 2 hours">Tier 2: 15min-2hr</SelectItem>
                      <SelectItem value="Tier 3: 2 hours to 8 hours">Tier 3: 2hr-8hr</SelectItem>
                      <SelectItem value="Tier 4: 8 hours to 24 hours">Tier 4: 8hr-24hr</SelectItem>
                      <SelectItem value="Tier 5: Greater than 24 hour, up to and including 48 hours">
                        Tier 5: 24hr-48hr
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="rpo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    RPO <InfoTooltip content="Recovery Point Objective - Maximum acceptable data loss" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
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
                      <SelectItem value="Tier 1: No data loss (Real-time replication)">Tier 1: No data loss</SelectItem>
                      <SelectItem value="Tier 2: Up to 15 minutes data loss">Tier 2: 15min loss</SelectItem>
                      <SelectItem value="Tier 3: Up to 1 hour data loss">Tier 3: 1hr loss</SelectItem>
                      <SelectItem value="Tier 4: Up to 4 hours data loss">Tier 4: 4hr loss</SelectItem>
                      <SelectItem value="Tier 5: Daily backup: Greater than 4 hours, up to and including 24 hours">
                        Tier 5: Daily backup
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="rtorpoapprover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    RTO/RPO Approver <InfoTooltip content="Person who approved the RTO/RPO requirements" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rodriguez, Maria C.">Rodriguez, Maria C.</SelectItem>
                      <SelectItem value="Thompson, Sarah K.">Thompson, Sarah K.</SelectItem>
                      <SelectItem value="Chen, Michael R.">Chen, Michael R.</SelectItem>
                      <SelectItem value="Williams, Jennifer L.">Williams, Jennifer L.</SelectItem>
                      <SelectItem value="Anderson, David M.">Anderson, David M.</SelectItem>
                      <SelectItem value="Signorini, John">Signorini, John</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="rtorpoapproverDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Approval Date <InfoTooltip content="Date when RTO/RPO was approved" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value ? new Date(field.value).toLocaleDateString() : ""}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11", "bg-gray-50")}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="inhouse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Hosting <InfoTooltip content="Where the application is hosted" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-blue-500",
                        )}
                      >
                        <SelectValue placeholder="Select hosting" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="In-house (Hosted entirely within the bank network)">In-house</SelectItem>
                      <SelectItem value="External (Hosted entirely outside the bank network)">External</SelectItem>
                      <SelectItem value="Cloud - Public">Cloud - Public</SelectItem>
                      <SelectItem value="Cloud - Private">Cloud - Private</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Mainframe Usage */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-red-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Technology Stack</h4>
        </div>

        <FormField
          control={form.control}
          name="mainframeflag"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-sm lg:text-base">
                Uses Mainframe <InfoTooltip content="Whether the application uses mainframe technology" />
              </FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value?.toString() || "false"}
                disabled={!isEditMode}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "h-9 lg:h-10 xl:h-11 w-48",
                      !isEditMode && "bg-gray-50",
                      isEditMode && "focus:ring-2 focus:ring-blue-500",
                    )}
                  >
                    <SelectValue placeholder="Select mainframe usage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Application Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-blue-800 font-semibold mb-3 text-sm lg:text-base">Application Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-blue-700">Application:</span>{" "}
            <span className="text-blue-600 break-words">
              {watchedValues.aitName || "Not specified"} ({watchedValues.aitShortname || "N/A"})
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Region:</span>{" "}
            <span className="text-blue-600">{watchedValues.regionName || "Not selected"}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Status:</span>{" "}
            <Badge variant={watchedValues.appStatus === "In Production" ? "default" : "secondary"} className="text-xs">
              {watchedValues.appStatus || "Not set"}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-blue-700">Hosting:</span>{" "}
            <span className="text-blue-600 break-words">
              {watchedValues.inhouse ? watchedValues.inhouse.split("(")[0].trim() : "Not specified"}
            </span>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h5 className="font-medium text-blue-700 mb-2 text-xs lg:text-sm">Technical Details</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-blue-600">
                Hierarchy: {watchedValues.twoDot || "N/A"} → {watchedValues.threeDot || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-blue-600">
                RTO: {watchedValues.rto ? watchedValues.rto.split(":")[0] : "Not set"}
              </span>
            </div>
            <div>
              <span className="text-blue-600">
                RPO: {watchedValues.rpo ? watchedValues.rpo.split(":")[0] : "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
