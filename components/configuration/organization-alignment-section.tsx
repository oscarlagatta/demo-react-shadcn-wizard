"use client"

import type { UseFormReturn } from "react-hook-form"
import { Users, Info } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"
import {
  usePortfolios,
  useGetAPSTeamByPortfolioId,
  useGetOrganisationGetORganisationForDdl,
  useGetLObByOrgId,
} from "@/lib/hooks/use-configuration-data"
import { useEffect, useMemo } from "react"

interface OrganizationAlignmentSectionProps {
  form: UseFormReturn<FullConfigurationForm>
  isEditMode: boolean
}

interface Portfolio {
  id: string
  portfolioname: string
}

interface Team {
  id: string
  teamName: string
  name: string
}

interface Organization {
  id: number
  name: string
}

interface LineOfBusiness {
  id: number
  description: string
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

export function OrganizationAlignmentSection({ form, isEditMode }: OrganizationAlignmentSectionProps) {
  const watchedValues = form.watch()

  // Get portfolio data
  const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfolios()

  // Get organization data
  const { data: organizations = [], isLoading: organizationsLoading } = useGetOrganisationGetORganisationForDdl()

  // Get team data based on selected portfolio
  const selectedPortfolioId = watchedValues.apsPortfolioId ? Number(watchedValues.apsPortfolioId) : undefined
  const { data: teamData = [], isLoading: teamLoading } = useGetAPSTeamByPortfolioId(selectedPortfolioId || 0)

  // Get line of business data based on selected organization
  const selectedOrganisationId = watchedValues.organisationId ? Number(watchedValues.organisationId) : undefined
  const { data: lineOfBusinessData = [], isLoading: lobLoading } = useGetLObByOrgId(selectedOrganisationId || 0)

  // Memoize current values to avoid recalculation on every render
  const currentPortfolio = useMemo(() => {
    if (!watchedValues.apsPortfolioId || !portfolios.length) return null
    return (portfolios as Portfolio[]).find((p) => p.id === String(watchedValues.apsPortfolioId)) || null
  }, [watchedValues.apsPortfolioId, portfolios])

  const currentTeam = useMemo(() => {
    if (!watchedValues.apsTeamName || !teamData.length) return null
    return (teamData as Team[]).find((t) => (t.teamName || t.name) === watchedValues.apsTeamName) || null
  }, [watchedValues.apsTeamName, teamData])

  const currentOrganization = useMemo(() => {
    if (!watchedValues.organisationId || !organizations.length) return null
    return (organizations as Organization[]).find((o) => o.id === watchedValues.organisationId) || null
  }, [watchedValues.organisationId, organizations])

  const currentLineOfBusiness = useMemo(() => {
    if (!watchedValues.lineOfBusinessId || !lineOfBusinessData.length) return null
    return (lineOfBusinessData as LineOfBusiness[]).find((lob) => lob.id === watchedValues.lineOfBusinessId) || null
  }, [watchedValues.lineOfBusinessId, lineOfBusinessData])

  // Debug logging to understand the state
  useEffect(() => {
    console.log("Debug - Organization Alignment Section:", {
      portfolioIdFromForm: watchedValues.apsPortfolioId,
      portfolioNameFromForm: watchedValues.apsPortfolioIdName,
      teamNameFromForm: watchedValues.apsTeamName,
      organisationIdFromForm: watchedValues.organisationId,
      organizationNameFromForm: watchedValues.organization,
      lineOfBusinessIdFromForm: watchedValues.lineOfBusinessId,
      lineOfBusinessNameFromForm: watchedValues.lineOfBusiness,
      portfoliosData: portfolios,
      organizationsData: organizations,
      teamData: teamData,
      lineOfBusinessData: lineOfBusinessData,
      currentPortfolio: currentPortfolio,
      currentTeam: currentTeam,
      currentOrganization: currentOrganization,
      currentLineOfBusiness: currentLineOfBusiness,
      selectedPortfolioId: selectedPortfolioId,
      selectedOrganisationId: selectedOrganisationId,
      allWatchedValues: watchedValues,
    })
  }, [
    watchedValues.apsPortfolioId,
    watchedValues.apsPortfolioIdName,
    watchedValues.apsTeamName,
    watchedValues.organisationId,
    watchedValues.organization,
    watchedValues.lineOfBusinessId,
    watchedValues.lineOfBusiness,
    portfolios,
    organizations,
    teamData,
    lineOfBusinessData,
    currentPortfolio,
    currentTeam,
    currentOrganization,
    currentLineOfBusiness,
    selectedPortfolioId,
    selectedOrganisationId,
    watchedValues,
  ])

  // Initialize team data when portfolio is loaded and has a value
  useEffect(() => {
    if (selectedPortfolioId && teamData.length > 0 && !watchedValues.apsTeamName) {
      // If there's a portfolio selected but no team, and we have team data, set the first team
      const firstTeam = teamData[0]
      if (firstTeam) {
        const teamName = firstTeam.teamName || firstTeam.name || ""
        console.log("Auto-setting team:", teamName)
        form.setValue("apsTeamName", teamName)
      }
    }
  }, [selectedPortfolioId, teamData, watchedValues.apsTeamName, form])

  // Initialize line of business data when organization is loaded and has a value
  useEffect(() => {
    if (selectedOrganisationId && lineOfBusinessData.length > 0 && !watchedValues.lineOfBusinessId) {
      // If there's an organization selected but no line of business, and we have LOB data, set the first one
      const firstLob = lineOfBusinessData[0]
      if (firstLob) {
        console.log("Auto-setting line of business:", firstLob.description)
        form.setValue("lineOfBusinessId", firstLob.id)
        form.setValue("lineOfBusiness", firstLob.description)
      }
    }
  }, [selectedOrganisationId, lineOfBusinessData, watchedValues.lineOfBusinessId, form])

  // Handle portfolio change - update both ID and name fields
  const handlePortfolioChange = (portfolioId: string) => {
    console.log("Portfolio changed to:", portfolioId)
    const selectedPortfolio = portfolios.find((p: Portfolio) => p.id === portfolioId)

    form.setValue("apsPortfolioId", Number(portfolioId))
    form.setValue("apsPortfolioIdName", selectedPortfolio?.portfolioname || "")
    // Clear team field when portfolio changes to force user to select new team
    form.setValue("apsTeamName", "")
  }

  // Handle team change
  const handleTeamChange = (teamName: string) => {
    console.log("Team changed to:", teamName)
    form.setValue("apsTeamName", teamName)
  }

  // Handle organization change - update both ID and name fields
  const handleOrganizationChange = (organizationId: string) => {
    console.log("Organization changed to:", organizationId)
    const selectedOrganization = organizations.find((o: Organization) => o.id === Number(organizationId))

    form.setValue("organisationId", Number(organizationId))
    form.setValue("organization", selectedOrganization?.name || "")
    // Clear line of business field when organization changes
    form.setValue("lineOfBusinessId", 0)
    form.setValue("lineOfBusiness", "")
  }

  // Handle line of business change - update both ID and name fields
  const handleLineOfBusinessChange = (lobId: string) => {
    console.log("Line of Business changed to:", lobId)
    const selectedLob = lineOfBusinessData.find((lob: LineOfBusiness) => lob.id === Number(lobId))

    form.setValue("lineOfBusinessId", Number(lobId))
    form.setValue("lineOfBusiness", selectedLob?.description || "")
  }

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
                    <Input {...field} disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
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
                    <Input {...field} disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
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
                    <Input {...field} disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
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
              name="apsPortfolioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Portfolio <InfoTooltip content="Portfolio this application belongs to" />
                  </FormLabel>
                  <Select
                    onValueChange={handlePortfolioChange}
                    value={field.value ? String(field.value) : ""}
                    disabled={!isEditMode || portfoliosLoading}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue placeholder="Select portfolio">
                          {currentPortfolio
                            ? currentPortfolio.portfolioname
                            : watchedValues.apsPortfolioIdName
                              ? watchedValues.apsPortfolioIdName
                              : field.value
                                ? `Portfolio ID: ${field.value}`
                                : "Select portfolio"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(portfolios as Portfolio[]).map((portfolio) => (
                        <SelectItem key={portfolio.id} value={portfolio.id}>
                          {portfolio.portfolioname}
                        </SelectItem>
                      ))}
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
              name="portfolioLead"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Portfolio Lead <InfoTooltip content="Lead person for the portfolio" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} className="h-9 lg:h-10 xl:h-11 bg-gray-50" />
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
                    onValueChange={handleTeamChange}
                    value={field.value || ""}
                    disabled={!isEditMode || teamLoading || !selectedPortfolioId}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          (!isEditMode || !selectedPortfolioId) && "bg-gray-50",
                          isEditMode && selectedPortfolioId && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue placeholder={selectedPortfolioId ? "Select team" : "Select portfolio first"}>
                          {currentTeam
                            ? currentTeam.teamName || currentTeam.name
                            : field.value
                              ? field.value
                              : selectedPortfolioId
                                ? "Select team"
                                : "Select portfolio first"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(teamData as Team[]).map((team) => (
                        <SelectItem key={team.id} value={team.teamName || team.name}>
                          {team.teamName || team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
              name="organisationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Organization <InfoTooltip content="Primary organizational unit or division" />
                  </FormLabel>
                  <Select
                    onValueChange={handleOrganizationChange}
                    value={field.value ? String(field.value) : ""}
                    disabled={!isEditMode || organizationsLoading}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue placeholder="Select organization">
                          {currentOrganization
                            ? currentOrganization.name
                            : watchedValues.organization
                              ? watchedValues.organization
                              : field.value
                                ? `Organization ID: ${field.value}`
                                : "Select organization"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(organizations as Organization[]).map((organization) => (
                        <SelectItem key={organization.id} value={String(organization.id)}>
                          {organization.name}
                        </SelectItem>
                      ))}
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
              name="lineOfBusinessId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm lg:text-base">
                    Line of Business <InfoTooltip content="Specific business line or function" />
                  </FormLabel>
                  <Select
                    onValueChange={handleLineOfBusinessChange}
                    value={field.value ? String(field.value) : ""}
                    disabled={!isEditMode || lobLoading || !selectedOrganisationId}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          (!isEditMode || !selectedOrganisationId) && "bg-gray-50",
                          isEditMode && selectedOrganisationId && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue
                          placeholder={selectedOrganisationId ? "Select line of business" : "Select organization first"}
                        >
                          {currentLineOfBusiness
                            ? currentLineOfBusiness.description
                            : watchedValues.lineOfBusiness
                              ? watchedValues.lineOfBusiness
                              : field.value
                                ? `LOB ID: ${field.value}`
                                : selectedOrganisationId
                                  ? "Select line of business"
                                  : "Select organization first"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(lineOfBusinessData as LineOfBusiness[]).map((lob) => (
                        <SelectItem key={lob.id} value={String(lob.id)}>
                          {lob.description}
                        </SelectItem>
                      ))}
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-9 lg:h-10 xl:h-11",
                          !isEditMode && "bg-gray-50",
                          isEditMode && "focus:ring-2 focus:ring-green-500",
                        )}
                      >
                        <SelectValue placeholder="Select aligning organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gcib-gts-tech">GCIB AND GTS TECH</SelectItem>
                      <SelectItem value="ccb-tech">CCB TECHNOLOGY</SelectItem>
                      <SelectItem value="pbwm-tech">PBWM TECHNOLOGY</SelectItem>
                      <SelectItem value="enterprise-tech">ENTERPRISE TECHNOLOGY</SelectItem>
                      <SelectItem value="infrastructure-tech">INFRASTRUCTURE TECHNOLOGY</SelectItem>
                      <SelectItem value="cybersecurity-tech">CYBERSECURITY TECHNOLOGY</SelectItem>
                      <SelectItem value="data-analytics-tech">DATA & ANALYTICS TECHNOLOGY</SelectItem>
                      <SelectItem value="digital-tech">DIGITAL TECHNOLOGY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Organizational Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-green-800 font-semibold mb-3 text-sm lg:text-base">Organizational Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-green-700">Primary Organization:</span>{" "}
            <span className="text-green-600 break-words">
              {currentOrganization
                ? currentOrganization.name
                : watchedValues.organization
                  ? watchedValues.organization
                  : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Line of Business:</span>{" "}
            <span className="text-green-600 break-words">
              {currentLineOfBusiness
                ? currentLineOfBusiness.description
                : watchedValues.lineOfBusiness
                  ? watchedValues.lineOfBusiness
                  : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Tech Alignment:</span>{" "}
            <span className="text-green-600 break-words">
              {watchedValues.aligningOrg
                ? watchedValues.aligningOrg
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Portfolio:</span>{" "}
            <span className="text-green-600">
              {currentPortfolio
                ? currentPortfolio.portfolioname
                : watchedValues.apsPortfolioIdName
                  ? watchedValues.apsPortfolioIdName
                  : "Not selected"}
            </span>
          </div>
        </div>

        {/* Contact Summary */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <h5 className="font-medium text-green-700 mb-2 text-xs lg:text-sm">Key Contacts & Team</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-xs lg:text-sm">
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
            <div>
              <span className="text-green-600 break-words">Team: {watchedValues.apsTeamName || "Not assigned"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
