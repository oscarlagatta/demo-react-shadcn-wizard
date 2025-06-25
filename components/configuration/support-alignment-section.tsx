"use client"

import type { UseFormReturn } from "react-hook-form"
import { Headphones, Info, Mail } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAPSSupport } from "@/hooks/use-aps-support"
import { useAPSTechLeads } from "@/hooks/use-aps-tech-leads"

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

  const { data: apsSupportOptions = [], isLoading: apsSupportLoading } = useAPSSupport()
  const { data: apsTechLeadOptions = [], isLoading: apsTechLeadLoading } = useAPSTechLeads()

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
              name="apsSupport"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    APS Support Manager{" "}
                    <InfoTooltip content="Application Production Support Manager responsible for overall support" />
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={!isEditMode || apsSupportLoading}
                          className={cn(
                            "h-9 lg:h-10 xl:h-11 justify-between",
                            !field.value && "text-muted-foreground",
                            !isEditMode && "bg-gray-50",
                          )}
                        >
                          {field.value
                            ? apsSupportOptions.find((option) => option.value === field.value)?.label
                            : "Select APS Support Manager"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search APS Support Manager..." />
                        <CommandList>
                          <CommandEmpty>No APS Support Manager found.</CommandEmpty>
                          <CommandGroup>
                            {apsSupportOptions.map((option) => (
                              <CommandItem
                                value={option.label}
                                key={option.value}
                                onSelect={() => {
                                  field.onChange(option.value)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    option.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="apsTechnicalLead"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    APS Technical Lead <InfoTooltip content="Technical lead for Application Production Support" />
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={!isEditMode || apsTechLeadLoading}
                          className={cn(
                            "h-9 lg:h-10 xl:h-11 justify-between",
                            !field.value && "text-muted-foreground",
                            !isEditMode && "bg-gray-50",
                          )}
                        >
                          {field.value
                            ? apsTechLeadOptions.find((option) => option.value === field.value)?.label
                            : "Select APS Technical Lead"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search APS Technical Lead..." />
                        <CommandList>
                          <CommandEmpty>No APS Technical Lead found.</CommandEmpty>
                          <CommandGroup>
                            {apsTechLeadOptions.map((option) => (
                              <CommandItem
                                value={option.label}
                                key={option.value}
                                onSelect={() => {
                                  field.onChange(option.value)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    option.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
              name="supportContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Contact{" "}
                    <InfoTooltip content="Primary support contact person for escalations and coordination" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="supportContactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Contact Email <InfoTooltip content="Email address for the primary support contact" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type="email" disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
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
              name="l2SupportContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    L2 Support Contact{" "}
                    <InfoTooltip content="Level 2 support contact person for technical escalations" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="supportRegion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Region <InfoTooltip content="Geographic region for support coverage" />
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
                        <SelectValue placeholder="Select support region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="apac">APAC</SelectItem>
                      <SelectItem value="emea">EMEA</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                      <SelectItem value="global">Global (24x7)</SelectItem>
                    </SelectContent>
                  </Select>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="bpsSupported"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    BPS Supported <InfoTooltip content="Whether Business Process Support is available" />
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
                        <SelectValue placeholder="Select BPS support" />
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
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="supportModel"
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
                      <SelectItem value="bps-24x7">BPS - 24x7</SelectItem>
                      <SelectItem value="bps-business-hours">BPS - Business Hours</SelectItem>
                      <SelectItem value="standard-24x7">Standard - 24x7</SelectItem>
                      <SelectItem value="standard-business-hours">Standard - Business Hours</SelectItem>
                      <SelectItem value="on-demand">On-Demand</SelectItem>
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
              name="supportTimezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Support Timezone <InfoTooltip content="Primary timezone for support operations" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="escalationPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-sm lg:text-base">
                  Escalation Path <InfoTooltip content="Detailed escalation procedure and contact hierarchy" />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!isEditMode}
                    className={cn(
                      "min-h-[80px] lg:min-h-[100px] xl:min-h-[120px] text-sm lg:text-base",
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

      {/* Support Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-purple-800 font-semibold mb-3 text-sm lg:text-base">Support Configuration Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-purple-700">Support Model:</span>{" "}
            <span className="text-purple-600 break-words">
              {watchedValues.supportModel
                ? watchedValues.supportModel
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">BPS Supported:</span>{" "}
            <span className="text-purple-600">
              {watchedValues.bpsSupported === "yes"
                ? "Yes"
                : watchedValues.bpsSupported === "no"
                  ? "No"
                  : watchedValues.bpsSupported === "limited"
                    ? "Limited"
                    : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Support Region:</span>{" "}
            <span className="text-purple-600">
              {watchedValues.supportRegion ? watchedValues.supportRegion.toUpperCase() : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Timezone:</span>{" "}
            <span className="text-purple-600 break-words">
              {watchedValues.supportTimezone
                ? watchedValues.supportTimezone
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
        </div>

        {/* Support Contacts Summary */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <h5 className="font-medium text-purple-700 mb-2 text-xs lg:text-sm">Support Team</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-purple-600 break-words">
                APS Manager: {watchedValues.apsSupport || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Technical Lead: {watchedValues.apsTechnicalLead || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                Support Contact: {watchedValues.supportContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-purple-600 break-words">
                L2 Contact: {watchedValues.l2SupportContact || "Not assigned"}
              </span>
            </div>
          </div>
          {watchedValues.supportContactEmail && (
            <div className="mt-2 text-xs lg:text-sm">
              <span className="text-purple-600 break-all">Primary Email: {watchedValues.supportContactEmail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
