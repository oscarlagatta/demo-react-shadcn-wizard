import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Type definitions
interface Region {
  value: string
  label: string
}

interface RtoRpoOption {
  value: string
  label: string
}

interface Approver {
  value: string
  label: string
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

interface Configuration {
  applicationId: string
  applicationName: string
  shortName: string
  region: string[]
  twoDot: string
  twoDotDesc: string
  threeDot: string
  threeDotDesc: string
  description: string
  rto: string
  rpo: string
  rtoApprover: string
  rtoApproveDate: string
  usesMainframe: "yes" | "no"
  applicationHosting: "in-house" | "cloud" | "hybrid"
  status: string
  techExec: string
  managementContact: string
  applicationManager: string
  apsPortfolioId: string
  apsPortfolioIdName: string
  portfolioLead: string
  apsTeamName: string
  organization: string
  lineOfBusiness: string
  aligningOrg: string
  apsSupport: string
  apsTechnicalLead: string
  l2SupportGroup: string
  l2SupportContact: string
  supportContact: string
  supportContactEmail: string
  bpsSupported: "yes" | "no"
  supportModel: string
  escalationPath: string
  supportRegion: string
  supportTimezone: string
  updatedBy: string
  updatedDate: string
  lastAttestedDate: string
  attestedBy: string
  nextDueAttestedDate: string
  createdBy: string
  createdDate: string
  version: string
}

// Mock API functions - replace with actual API calls
const fetchRegions = async (): Promise<Region[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "apac-latam", label: "APAC, LATAM" },
    { value: "emea", label: "EMEA" },
    { value: "americas", label: "Americas" },
    { value: "global", label: "Global" },
  ]
}

const fetchRtoOptions = async (): Promise<RtoRpoOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "tier-1-immediate", label: "Tier 1: Immediate (0-15 minutes)" },
    { value: "tier-2-15min-2hr", label: "Tier 2: 15 minutes to 2 hours" },
    { value: "tier-3-2hr-8hr", label: "Tier 3: 2 hours to 8 hours" },
    { value: "tier-4-8hr-24hr", label: "Tier 4: 8 hours to 24 hours" },
    { value: "tier-5-24-48", label: "Tier 5: Greater than 24 hours, up to 48 hours" },
  ]
}

const fetchRpoOptions = async (): Promise<RtoRpoOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "tier-1-no-loss", label: "Tier 1: No data loss (Real-time replication)" },
    { value: "tier-2-15min", label: "Tier 2: Up to 15 minutes data loss" },
    { value: "tier-3-1hr", label: "Tier 3: Up to 1 hour data loss" },
    { value: "tier-4-4hr", label: "Tier 4: Up to 4 hours data loss" },
    { value: "tier-5-daily-backup", label: "Tier 5: Daily backup (4-24 hours data loss)" },
  ]
}

const fetchRtoRpoApprovers = async (): Promise<Approver[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "rodriguez-maria", label: "Rodriguez, Maria C." },
    { value: "thompson-sarah", label: "Thompson, Sarah K." },
    { value: "chen-michael", label: "Chen, Michael R." },
    { value: "williams-jennifer", label: "Williams, Jennifer L." },
    { value: "anderson-david", label: "Anderson, David M." },
  ]
}

const fetchConfiguration = async (applicationId: string): Promise<Configuration> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    applicationId: "100",
    applicationName: "Account Analysis Receivables (AAR)",
    shortName: "AAR",
    region: ["apac-latam"],
    twoDot: "VM",
    twoDotDesc: "GCIB AND GTS TECH",
    threeDot: "VMB",
    threeDotDesc: "GCIB AND GTS TECH",
    description:
      "Performs all billing and receivables functions for analyzed accounts. It provides a GUI interface for billed accounts to recognize income. Collections are done via direct debit of customer accounts or by checks remitted to Bank Physical Lockboxes.",
    rto: "tier-5-24-48",
    rpo: "tier-5-daily-backup",
    rtoApprover: "rodriguez-maria",
    rtoApproveDate: "2024-09-20",
    usesMainframe: "no" as const,
    applicationHosting: "in-house" as const,
    status: "In Production",
    techExec: "Thompson, Sarah K.",
    managementContact: "Chen, Michael R.",
    applicationManager: "Williams, Jennifer L.",
    apsPortfolioId: "1",
    apsPortfolioIdName: "APAC Portfolio",
    portfolioLead: "Anderson, David M.",
    apsTeamName: "Australia Apps Team",
    organization: "gcib",
    lineOfBusiness: "treasury-payments",
    aligningOrg: "gcib-gts-tech",
    apsSupport: "Kumar, Vipin",
    apsTechnicalLead: "Mengupta, Venkata Kumar",
    l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
    l2SupportContact: "Martinez, Carlos",
    supportContact: "Johnson, Emily R.",
    supportContactEmail: "emily.johnson@bank.com",
    bpsSupported: "yes" as const,
    supportModel: "bps-24x7",
    escalationPath: "L1 → L2 Support Group → APS Support Manager → APS Technical Lead",
    supportRegion: "apac",
    supportTimezone: "asia-pacific",
    updatedBy: "Kumar, Vipin",
    updatedDate: "Oct 30, 2024, 2:36:48 PM",
    lastAttestedDate: "Oct 24, 2024, 10:25:31 AM",
    attestedBy: "Kumar, Vipin",
    nextDueAttestedDate: "Mar 31, 2025, 12:00:00 AM",
    createdBy: "Martinez, Carlos",
    createdDate: "Sep 15, 2024, 9:15:22 AM",
    version: "v2.1.3",
  }
}

const saveConfiguration = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return { success: true, message: "Configuration saved successfully" }
}

// New API functions for portfolios and teams
const fetchPortfolios = async (): Promise<Portfolio[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { id: "1", portfolioname: "APAC Portfolio" },
    { id: "2", portfolioname: "EMEA Portfolio" },
    { id: "3", portfolioname: "Americas Portfolio" },
    { id: "4", portfolioname: "Global Portfolio" },
  ]
}

const fetchAPSTeamByPortfolioId = async (portfolioId: number): Promise<Team[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data based on portfolio ID
  const teamsByPortfolio: Record<number, Team[]> = {
    1: [
      { id: "1", teamName: "Australia Apps Team", name: "Australia Apps Team" },
      { id: "2", teamName: "Singapore Tech Team", name: "Singapore Tech Team" },
    ],
    2: [
      { id: "3", teamName: "London Development Team", name: "London Development Team" },
      { id: "4", teamName: "Frankfurt Operations Team", name: "Frankfurt Operations Team" },
    ],
    3: [
      { id: "5", teamName: "New York Platform Team", name: "New York Platform Team" },
      { id: "6", teamName: "Toronto Infrastructure Team", name: "Toronto Infrastructure Team" },
    ],
    4: [
      { id: "7", teamName: "Global Architecture Team", name: "Global Architecture Team" },
      { id: "8", teamName: "Global Security Team", name: "Global Security Team" },
    ],
  }

  return teamsByPortfolio[portfolioId] || []
}

export const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRto = () => {
  return useQuery({
    queryKey: ["rto-options"],
    queryFn: fetchRtoOptions,
    staleTime: 5 * 60 * 1000,
  })
}

export const useRpo = () => {
  return useQuery({
    queryKey: ["rpo-options"],
    queryFn: fetchRpoOptions,
    staleTime: 5 * 60 * 1000,
  })
}

export const useRtoRpoApprovers = () => {
  return useQuery({
    queryKey: ["rto-rpo-approvers"],
    queryFn: fetchRtoRpoApprovers,
    staleTime: 5 * 60 * 1000,
  })
}

export const useConfiguration = (applicationId: string) => {
  return useQuery({
    queryKey: ["configuration", applicationId],
    queryFn: () => fetchConfiguration(applicationId),
    enabled: !!applicationId,
  })
}

export const useSaveConfiguration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveConfiguration,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["configuration"] })
    },
  })
}

// New exports for portfolios and teams
export const usePortfolios = () => {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: fetchPortfolios,
    staleTime: 5 * 60 * 1000,
  })
}

export const useGetAPSTeamByPortfolioId = (portfolioId: number) => {
  return useQuery({
    queryKey: ["aps-teams", portfolioId],
    queryFn: () => fetchAPSTeamByPortfolioId(portfolioId),
    enabled: !!portfolioId && portfolioId > 0,
    staleTime: 5 * 60 * 1000,
  })
}
