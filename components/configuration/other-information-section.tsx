"use client"

import type { UseFormReturn } from "react-hook-form"
import { MapPin, Info, Calendar, User, Clock, FileText } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"

interface OtherInformationSectionProps {
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

export function OtherInformationSection({ form, isEditMode }: OtherInformationSectionProps) {
  const watchedValues = form.watch()

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not available"
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <MapPin className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-orange-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Other Information
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Additional metadata, tracking information, and audit details
        </p>
      </div>

      {/* Record Management Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-orange-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Record Management</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="createdusername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Created By <InfoTooltip content="User who originally created this record" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value || "System"}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11 pl-9", "bg-gray-50")}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="createddate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Created Date <InfoTooltip content="Date when this record was originally created" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={formatDate(field.value)}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11 pl-9", "bg-gray-50")}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Record ID <InfoTooltip content="Unique identifier for this record" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value?.toString() || "Auto-generated"}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11 pl-9", "bg-gray-50")}
                      />
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Update History Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Update History</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="updatedusername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Last Updated By <InfoTooltip content="User who last modified this record" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value || "Not available"}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11 pl-9", "bg-gray-50")}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="updateddate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Last Updated Date <InfoTooltip content="Date when this record was last modified" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={formatDate(field.value)}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11 pl-9", "bg-gray-50")}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Attestation Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Attestation Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="attestationUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Attested By <InfoTooltip content="User who performed the last attestation" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value || "Not available"}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11 pl-9", "bg-gray-50")}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="attestationDueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Last Attestation Date <InfoTooltip content="Date of the last attestation" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={formatDate(field.value)}
                        disabled={true}
                        className={cn("h-9 lg:h-10 xl:h-11 pl-9", "bg-gray-50")}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="nextAttestationDueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Next Attestation Due <InfoTooltip content="Date when next attestation is due" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={formatDate(field.value)}
                        disabled={true}
                        className={cn(
                          "h-9 lg:h-10 xl:h-11 pl-9",
                          "bg-gray-50",
                          // Highlight if attestation is due soon
                          field.value && new Date(field.value) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            ? "border-orange-300 bg-orange-50"
                            : "",
                        )}
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {field.value && new Date(field.value) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                    <p className="text-xs text-orange-600 mt-1">⚠️ Attestation due within 30 days</p>
                  )}
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* System Information Summary */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <h4 className="text-orange-800 font-semibold mb-3 text-sm lg:text-base">System Information Summary</h4>

        {/* Record Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm mb-4">
          <div>
            <span className="font-medium text-orange-700">Record ID:</span>{" "}
            <span className="text-orange-600">{watchedValues.id || "Auto-generated"}</span>
          </div>
          <div>
            <span className="font-medium text-orange-700">Created:</span>{" "}
            <span className="text-orange-600">
              {watchedValues.createddate ? new Date(watchedValues.createddate).toLocaleDateString() : "Not available"}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">Last Updated:</span>{" "}
            <span className="text-orange-600">
              {watchedValues.updateddate ? new Date(watchedValues.updateddate).toLocaleDateString() : "Not available"}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">Version:</span>{" "}
            <Badge variant="outline" className="text-xs">
              v2.1.3
            </Badge>
          </div>
        </div>

        {/* Attestation Status */}
        <div className="pt-4 border-t border-orange-200">
          <h5 className="font-medium text-orange-700 mb-2 text-xs lg:text-sm">Attestation Status</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-orange-600">
                Last Attested:{" "}
                {watchedValues.attestationDueDate
                  ? new Date(watchedValues.attestationDueDate).toLocaleDateString()
                  : "Not available"}
              </span>
            </div>
            <div>
              <span className="text-orange-600">
                Attested By: {watchedValues.attestationUsername || "Not available"}
              </span>
            </div>
            <div>
              <span className="text-orange-600">
                Next Due:{" "}
                {watchedValues.nextAttestationDueDate
                  ? new Date(watchedValues.nextAttestationDueDate).toLocaleDateString()
                  : "Not scheduled"}
              </span>
              {watchedValues.nextAttestationDueDate &&
                new Date(watchedValues.nextAttestationDueDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                  <Badge variant="destructive" className="text-xs ml-2">
                    Due Soon
                  </Badge>
                )}
            </div>
          </div>
        </div>

        {/* Change History */}
        <div className="pt-4 border-t border-orange-200">
          <h5 className="font-medium text-orange-700 mb-2 text-xs lg:text-sm">Change History</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-orange-600">Created By: {watchedValues.createdusername || "System"}</span>
            </div>
            <div>
              <span className="text-orange-600">
                Last Modified By: {watchedValues.updatedusername || "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
