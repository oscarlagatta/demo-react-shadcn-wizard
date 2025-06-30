"use client"

import type { UseFormReturn } from "react-hook-form"
import { Headphones, Info, Mail, Clock, Shield } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"

interface SupportAlignmentSectionProps {
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

export function SupportAlignmentSection({ form, isEditMode }: SupportAlignmentSectionProps) {
  const watchedValues = form.watch()

  return (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Headphones className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-purple-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Support Alignment
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Support team configuration, contacts, and service level agreements
        </p>
      </div>

      {/* APS Support Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">APS Support Team</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="apsSupportContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    APS Support Contact <InfoTooltip content="Primary APS support contact person" />
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

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="apsTechnicalLeadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    APS Technical Lead <InfoTooltip content="Technical lead for APS support" />
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

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="l2SupportGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    L2 Support Group <InfoTooltip content="Level 2 support group identifier" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      disabled={!isEditMode}
                      className={cn(
                        "h-9 lg:h-10 xl:h-11",
                        !isEditMode && "bg-gray-50",
                        isEditMode && "focus:ring-2 focus:ring-purple-500",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Support Contacts Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Support Contacts</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="secondLevelProductionSupportLoginName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    L2 Support Contact <InfoTooltip content="Level 2 production support contact" />
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

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="appSupportDg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Email <InfoTooltip content="Support distribution group email" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value || ""}
                        disabled={!isEditMode}
                        type="email"
                        className={cn(
                          "h-9 lg:h-10 xl:h-11 pl-9",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-purple-500",
                        )}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              name="regionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Region <InfoTooltip content="Geographic region for support coverage" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center h-9 lg:h-10 xl:h-11 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                      <span className="text-sm lg:text-base text-gray-700">{field.value || "Not specified"}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Support Model Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Support Model</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="supportModelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Model <InfoTooltip content="Type of support model for this application" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-purple-500",
                        )}
                      >
                        <SelectValue placeholder="Select support model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BPS - 24x7">BPS - 24x7</SelectItem>
                      <SelectItem value="BPS - 365x5">BPS - 365x5</SelectItem>
                      <SelectItem value="BPS - Business Hours">BPS - Business Hours</SelectItem>
                      <SelectItem value="Standard - 24x7">Standard - 24x7</SelectItem>
                      <SelectItem value="Standard - Business Hours">Standard - Business Hours</SelectItem>
                      <SelectItem value="On-Demand">On-Demand</SelectItem>
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
              name="bpssupported"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    BPS Supported <InfoTooltip content="Whether the application is supported by BPS" />
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value?.toString() || "false"}
                    disabled={!isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-purple-500",
                        )}
                      >
                        <SelectValue placeholder="Select BPS support" />
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

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="regionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Timezone <InfoTooltip content="Primary timezone for support operations" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center h-9 lg:h-10 xl:h-11 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm lg:text-base text-gray-700">
                        {field.value === "AMRS"
                          ? "Americas (EST/PST)"
                          : field.value === "APAC"
                            ? "Asia Pacific (JST/SGT)"
                            : field.value === "EMEA"
                              ? "Europe/Africa (GMT/CET)"
                              : field.value === "GLOBAL"
                                ? "Global (24x7)"
                                : "Not specified"}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Escalation Path */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-orange-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Escalation Path</h4>
        </div>

        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Shield className="h-5 w-5 text-orange-600 mr-2" />
            <h5 className="font-medium text-orange-800 text-sm lg:text-base">Standard Escalation Process</h5>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="outline" className="bg-white border-orange-300 text-orange-700">
              L1 Support
            </Badge>
            <span className="text-orange-600">→</span>
            <Badge variant="outline" className="bg-white border-orange-300 text-orange-700">
              L2 Support Group
            </Badge>
            <span className="text-orange-600">→</span>
            <Badge variant="outline" className="bg-white border-orange-300 text-orange-700">
              APS Support Manager
            </Badge>
            <span className="text-orange-600">→</span>
            <Badge variant="outline" className="bg-white border-orange-300 text-orange-700">
              APS Technical Lead
            </Badge>
          </div>
          <p className="text-xs text-orange-600 mt-2">
            Escalation follows this path based on severity and complexity of the issue
          </p>
        </div>
      </div>

      {/* Support Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-purple-800 font-semibold mb-3 text-sm lg:text-base">Support Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-purple-700">Support Model:</span>{" "}
            <Badge
              variant={watchedValues.supportModelName?.includes("24x7") ? "default" : "secondary"}
              className="text-xs ml-1"
            >
              {watchedValues.supportModelName || "Not set"}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-purple-700">BPS Supported:</span>{" "}
            <Badge variant={watchedValues.bpssupported ? "default" : "secondary"} className="text-xs ml-1">
              {watchedValues.bpssupported ? "Yes" : "No"}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-purple-700">Support Region:</span>{" "}
            <span className="text-purple-600">{watchedValues.regionName || "Not specified"}</span>
          </div>
          <div>
            <span className="font-medium text-purple-700">L2 Group:</span>{" "}
            <span className="text-purple-600 break-words text-xs">
              {watchedValues.l2SupportGroup
                ? watchedValues.l2SupportGroup.length > 20
                  ? `${watchedValues.l2SupportGroup.substring(0, 20)}...`
                  : watchedValues.l2SupportGroup
                : "Not assigned"}
            </span>
          </div>
        </div>

        {/* Contact Summary */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <h5 className="font-medium text-purple-700 mb-2 text-xs lg:text-sm">Support Contacts</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-purple-600 break-words">
                APS Support: {watchedValues.apsSupportContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Tech Lead: {watchedValues.apsTechnicalLeadName || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                L2 Contact: {watchedValues.secondLevelProductionSupportLoginName || "Not assigned"}
              </span>
            </div>
          </div>
        </div>

        {/* Support Email */}
        {watchedValues.appSupportDg && (
          <div className="mt-4 pt-4 border-t border-purple-200">
            <h5 className="font-medium text-purple-700 mb-2 text-xs lg:text-sm">Support Email</h5>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-purple-600 break-all text-xs lg:text-sm">{watchedValues.appSupportDg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
