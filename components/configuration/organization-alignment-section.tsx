"use client"

import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Users, Info, Loader2 } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"
import { useTeamsByPortfolio, portfolioTeamMapping } from "@/lib/hooks/use-configuration-data"

interface OrganizationAlignmentSectionProps {
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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-6">
    <div className="flex items-center space-x-2 text-gray-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Loading teams...</span>
    </div>
  </div>
)

const EmptyTeamsMessage = ({ portfolioName }: { portfolioName: string }) => (
  <div className="flex items-center justify-center py-6">
    <div className="text-center text-gray-500">
      <div className="text-sm font-medium">No teams available</div>
      <div className="text-xs mt-1">No teams found for {portfolioName}</div>
    </div>
  </div>
)

const SelectPortfolioMessage = () => (
  <div className="flex items-center justify-center py-6">
    <div className="text-center text-gray-500">
      <div className="text-sm font-medium">Select a portfolio first</div>
      <div className="text-xs mt-1">Teams will be filtered based on your portfolio selection</div>
    </div>
  </div>
)

export function OrganizationAlignmentSection({ form, isEditMode }: OrganizationAlignmentSectionProps) {
  const watchedValues = form.watch()
  const selectedPortfolio = form.watch("apsPortfolioName")
  const selectedTeam = form.watch("apsTeamName")

  // Get filtered teams based on selected portfolio
  const { data: filteredTeams = [], isLoading: teamsLoading } = useTeamsByPortfolio(selectedPortfolio)

  // Handle portfolio change - reset team if it's not available in the new portfolio
  useEffect(() => {
    if (isEditMode && selectedPortfolio && selectedTeam) {
      const availableTeams = portfolioTeamMapping[selectedPortfolio] || []
      if (!availableTeams.includes(selectedTeam)) {
        form.setValue("apsTeamName", "", { shouldDirty: true })
      }
    }
  }, [selectedPortfolio, selectedTeam, isEditMode, form])

  return (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Organization Alignment
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Organizational structure, key contacts, and business alignment
        </p>
      </div>

      {/* Key Contacts Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-green-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Key Contacts</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="techExec"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Tech Exec <InfoTooltip content="Technology Executive responsible for the application" />
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
              name="managementContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Management Contact <InfoTooltip content="Primary management contact for the application" />
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
              name="applicationManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Application Manager <InfoTooltip content="Manager responsible for application operations" />
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

      {/* Portfolio & Team Structure Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">
            Portfolio & Team Structure
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="apsPortfolioName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Portfolio <InfoTooltip content="Portfolio this application belongs to" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue placeholder="Select portfolio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Global Payments">Global Payments</SelectItem>
                      <SelectItem value="APAC Portfolio">APAC Portfolio</SelectItem>
                      <SelectItem value="EMEA Portfolio">EMEA Portfolio</SelectItem>
                      <SelectItem value="Americas Portfolio">Americas Portfolio</SelectItem>
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
              name="apsPortfolioTeamLeadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Portfolio Lead <InfoTooltip content="Lead person for the portfolio" />
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
              name="apsTeamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Team <InfoTooltip content="Team responsible for the application" />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    disabled={!isEditMode || !selectedPortfolio}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          (!isEditMode || !selectedPortfolio) && "bg-gray-50",
                          isEditMode && selectedPortfolio && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue
                          placeholder={
                            !selectedPortfolio
                              ? "Select portfolio first"
                              : teamsLoading
                                ? "Loading teams..."
                                : filteredTeams.length === 0
                                  ? "No teams available"
                                  : "Select team"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {!selectedPortfolio ? (
                        <SelectPortfolioMessage />
                      ) : teamsLoading ? (
                        <LoadingSpinner />
                      ) : filteredTeams.length === 0 ? (
                        <EmptyTeamsMessage portfolioName={selectedPortfolio} />
                      ) : (
                        <>
                          {/* Header showing portfolio context */}
                          <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b bg-gray-50">
                            Teams for {selectedPortfolio} ({filteredTeams.length})
                          </div>
                          {filteredTeams.map((team) => (
                            <SelectItem
                              key={team.value}
                              value={team.value}
                              className="cursor-pointer hover:bg-green-50 focus:bg-green-50"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{team.label}</span>
                                {selectedTeam === team.value && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {isEditMode && selectedPortfolio && !teamsLoading && (
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredTeams.length > 0
                        ? `${filteredTeams.length} team${filteredTeams.length === 1 ? "" : "s"} available for ${selectedPortfolio}`
                        : `No teams configured for ${selectedPortfolio}`}
                    </p>
                  )}
                  {isEditMode && teamsLoading && (
                    <p className="text-xs text-blue-500 mt-1 flex items-center">
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Filtering teams for {selectedPortfolio}...
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Business Alignment Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="border-l-4 border-purple-500 pl-3 lg:pl-4">
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 lg:mb-4">Business Alignment</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
          <div className="space-y-2 2xl:col-span-2">
            <FormField
              control={form.control}
              name="organisationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Organization <InfoTooltip content="Primary organizational unit or division" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Global Banking Technology">Global Banking Technology</SelectItem>
                      <SelectItem value="Global Corporate & Investment Banking (GCIB)">
                        Global Corporate & Investment Banking (GCIB)
                      </SelectItem>
                      <SelectItem value="Global Transaction Services (GTS)">
                        Global Transaction Services (GTS)
                      </SelectItem>
                      <SelectItem value="Consumer & Community Banking (CCB)">
                        Consumer & Community Banking (CCB)
                      </SelectItem>
                      <SelectItem value="Private Bank & Wealth Management (PBWM)">
                        Private Bank & Wealth Management (PBWM)
                      </SelectItem>
                      <SelectItem value="Operations & Technology">Operations & Technology</SelectItem>
                      <SelectItem value="Risk Management">Risk Management</SelectItem>
                      <SelectItem value="Compliance & Controls">Compliance & Controls</SelectItem>
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
              name="loBName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Line of Business <InfoTooltip content="Specific business line or function" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue placeholder="Select line of business" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Treasury & Trade Solutions">Treasury & Trade Solutions</SelectItem>
                      <SelectItem value="Securities & Fund Services">Securities & Fund Services</SelectItem>
                      <SelectItem value="Commercial Cards">Commercial Cards</SelectItem>
                      <SelectItem value="Cash Management">Cash Management</SelectItem>
                      <SelectItem value="Trade Finance">Trade Finance</SelectItem>
                      <SelectItem value="Foreign Exchange">Foreign Exchange</SelectItem>
                      <SelectItem value="Lending Services">Lending Services</SelectItem>
                      <SelectItem value="Investment Banking">Investment Banking</SelectItem>
                      <SelectItem value="Markets & Securities">Markets & Securities</SelectItem>
                      <SelectItem value="Private Banking">Private Banking</SelectItem>
                      <SelectItem value="Retail Banking">Retail Banking</SelectItem>
                      <SelectItem value="Credit Cards">Credit Cards</SelectItem>
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
              name="aligningOrg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Aligning Org <InfoTooltip content="Technology organization alignment" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center h-9 lg:h-10 xl:h-11 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                      <span className="text-sm lg:text-base text-gray-700 break-words">
                        {field.value || "Not specified"}
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

      {/* Portfolio-Team Relationship Info */}
      {isEditMode && selectedPortfolio && !teamsLoading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-blue-800 font-medium mb-2 text-sm">Portfolio Team Information</h5>
          <p className="text-blue-700 text-xs mb-2">
            <strong>{selectedPortfolio}</strong> has the following teams available:
          </p>
          <div className="flex flex-wrap gap-1">
            {(portfolioTeamMapping[selectedPortfolio] || []).map((team) => (
              <span
                key={team}
                className={cn(
                  "px-2 py-1 text-xs rounded-full transition-colors",
                  selectedTeam === team
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200",
                )}
              >
                {team}
                {selectedTeam === team && <span className="ml-1">✓</span>}
              </span>
            ))}
          </div>
          {filteredTeams.length === 0 && (
            <p className="text-orange-600 text-xs mt-2 font-medium">
              ⚠️ No teams are currently configured for this portfolio
            </p>
          )}
        </div>
      )}

      {/* Loading State Info */}
      {isEditMode && selectedPortfolio && teamsLoading && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
            <h5 className="text-yellow-800 font-medium text-sm">Loading Team Information</h5>
          </div>
          <p className="text-yellow-700 text-xs mt-1">
            Fetching available teams for <strong>{selectedPortfolio}</strong>...
          </p>
        </div>
      )}

      {/* Organizational Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-green-800 font-semibold mb-3 text-sm lg:text-base">Organizational Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-green-700">Primary Organization:</span>{" "}
            <span className="text-green-600 break-words">{watchedValues.organisationName || "Not selected"}</span>
          </div>
          <div>
            <span className="font-medium text-green-700">Line of Business:</span>{" "}
            <span className="text-green-600 break-words">{watchedValues.loBName || "Not selected"}</span>
          </div>
          <div>
            <span className="font-medium text-green-700">Tech Alignment:</span>{" "}
            <span className="text-green-600 break-words">{watchedValues.aligningOrg || "Not selected"}</span>
          </div>
          <div>
            <span className="font-medium text-green-700">Portfolio:</span>{" "}
            <span className="text-green-600">{watchedValues.apsPortfolioName || "Not selected"}</span>
          </div>
        </div>

        {/* Contact Summary */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <h5 className="font-medium text-green-700 mb-2 text-xs lg:text-sm">Key Contacts</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-green-600 break-words">Tech Exec: {watchedValues.techExec || "Not assigned"}</span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                Management: {watchedValues.managementContact || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-green-600 break-words">
                App Manager: {watchedValues.applicationManager || "Not assigned"}
              </span>
            </div>
          </div>
        </div>

        {/* Team Summary */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <h5 className="font-medium text-green-700 mb-2 text-xs lg:text-sm">Team Structure</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs lg:text-sm">
            <div>
              <span className="text-green-600 break-words">
                Portfolio: {watchedValues.apsPortfolioName || "Not selected"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600 break-words">
                Team: {watchedValues.apsTeamName || "Not selected"}
                {watchedValues.apsPortfolioName && !watchedValues.apsTeamName && isEditMode && !teamsLoading && (
                  <span className="text-orange-600 ml-1">(Please select a team)</span>
                )}
                {teamsLoading && (
                  <span className="text-blue-600 ml-1 flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    (Loading...)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
