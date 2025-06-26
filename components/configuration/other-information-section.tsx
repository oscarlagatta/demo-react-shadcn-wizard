"use client"

import type { UseFormReturn } from "react-hook-form"
import { MapPin, Info, Check } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  return (
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
          <FormField
            control={form.control}
            name="updatedusername"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Updated By <InfoTooltip content="Person who last updated this record" />
                </FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} readOnly className="bg-gray-50 h-9 lg:h-10 xl:h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="updateddate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Updated Date <InfoTooltip content="Date when this record was last updated" />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ? new Date(field.value).toLocaleString() : ""}
                    readOnly
                    className="bg-gray-50 h-9 lg:h-10 xl:h-11"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="attestationDueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Last Attested Date <InfoTooltip content="Date when this record was last attested" />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ? new Date(field.value).toLocaleString() : ""}
                    readOnly
                    className="bg-gray-50 h-9 lg:h-10 xl:h-11"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="attestationUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Attested By <InfoTooltip content="Person who last attested this record" />
                </FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} readOnly className="bg-gray-50 h-9 lg:h-10 xl:h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="nextAttestationDueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Next Due Attested Date <InfoTooltip content="Next date when attestation is due" />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ? new Date(field.value).toLocaleString() : ""}
                    readOnly
                    className="bg-gray-50 h-9 lg:h-10 xl:h-11"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Version <InfoTooltip content="Current version of the application record" />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value?.toString() || ""}
                    readOnly
                    className="bg-gray-50 h-9 lg:h-10 xl:h-11"
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
}
