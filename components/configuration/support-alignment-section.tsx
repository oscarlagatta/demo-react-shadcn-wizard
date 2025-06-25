"use client"

import type { UseFormReturn } from "react-hook-form"
import { Headphones, Info, Mail } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
          Support team structure, contacts, and service delivery model
        </p>
      </div>

      {/* Support Management Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Support Management</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="apsSupportContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    APS Support Manager{" "}
                    <InfoTooltip content="Application Production Support Manager responsible for overall support" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-purple-500",
                        )}
                      >
                        <SelectValue placeholder="Select APS Support Manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Powers, Austin">Powers, Austin</SelectItem>
                      <SelectItem value="Smith, John">Smith, John</SelectItem>
                      <SelectItem value="Johnson, Sarah">Johnson, Sarah</SelectItem>
                      <SelectItem value="Chen, Mike">Chen, Mike</SelectItem>
                      <SelectItem value="Rodriguez, Lisa">Rodriguez, Lisa</SelectItem>
                    </SelectContent>
                  </Select>
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
                    APS Technical Lead <InfoTooltip content="Technical lead for Application Production Support" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-purple-500",
                        )}
                      >
                        <SelectValue placeholder="Select APS Technical Lead" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Smith, Belinda">Smith, Belinda</SelectItem>
                      <SelectItem value="Kim, David">Kim, David</SelectItem>
                      <SelectItem value="Wilson, Emma">Wilson, Emma</SelectItem>
                      <SelectItem value="Brown, Alex">Brown, Alex</SelectItem>
                      <SelectItem value="Garcia, Maria">Garcia, Maria</SelectItem>
                    </SelectContent>
                  </Select>
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
                    L2 Support Group <InfoTooltip content="Level 2 support group identifier and team name" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="appSupportDg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Contact Email <InfoTooltip content="Email address for the primary support contact" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="email"
                        disabled={true}
                        className={cn("pl-9 lg:pl-10 h-9 lg:h-10 xl:h-11", "bg-gray-50")}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              name="secondLevelProductionSupportLoginName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    L2 Support Contact{" "}
                    <InfoTooltip content="Level 2 support contact person for technical escalations" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} className={cn("h-9 lg:h-10 xl:h-11", "bg-gray-50")} />
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
                    Support Region <InfoTooltip content="Geographic region for support coverage" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center h-9 lg:h-10 xl:h-11">
                      <span className="text-sm lg:text-base text-gray-700">{field.value}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Service Delivery Model Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Service Delivery Model
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="bpssupported"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    BPS Supported <InfoTooltip content="Whether Business Process Support is available" />
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value?.toString()}
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
              name="supportModelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Model <InfoTooltip content="Type of support model and coverage hours" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode}>
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
        </div>
      </div>

      {/* Support Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-purple-800 font-semibold mb-3 text-sm lg:text-base">Support Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-purple-700">Support Model:</span>{" "}
            <span className="text-purple-600 break-words">{watchedValues.supportModelName || "Not selected"}</span>
          </div>
          <div>
            <span className="font-medium text-purple-700">BPS Supported:</span>{" "}
            <span className="text-purple-600">{watchedValues.bpssupported ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Support Region:</span>{" "}
            <span className="text-purple-600">{watchedValues.regionName || "Not selected"}</span>
          </div>
          <div>
            <span className="font-medium text-purple-700">L2 Support Group:</span>{" "}
            <span className="text-purple-600 break-words">{watchedValues.l2SupportGroup || "Not assigned"}</span>
          </div>
        </div>

        {/* Support Contacts Summary */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <h5 className="font-medium text-purple-700 mb-2 text-xs lg:text-sm">Support Team</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-purple-600 break-words">
                APS Manager: {watchedValues.apsSupportContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Technical Lead: {watchedValues.apsTechnicalLeadName || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                L2 Contact: {watchedValues.secondLevelProductionSupportLoginName || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Support Email: {watchedValues.appSupportDg || "Not assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
