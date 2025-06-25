import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Mock API functions - replace with actual API calls
const fetchRegions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "apac-latam", label: "APAC, LATAM" },
    { value: "emea", label: "EMEA" },
    { value: "americas", label: "Americas" },
    { value: "global", label: "Global" },
  ]
}

const fetchRtoOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "tier-1-immediate", label: "Tier 1: Immediate (0-15 minutes)" },
    { value: "tier-2-15min-2hr", label: "Tier 2: 15 minutes to 2 hours" },
    { value: "tier-3-2hr-8hr", label: "Tier 3: 2 hours to 8 hours" },
    { value: "tier-4-8hr-24hr", label: "Tier 4: 8 hours to 24 hours" },
    { value: "tier-5-24-48", label: "Tier 5: Greater than 24 hours, up to 48 hours" },
  ]
}

const fetchRpoOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "tier-1-no-loss", label: "Tier 1: No data loss (Real-time replication)" },
    { value: "tier-2-15min", label: "Tier 2: Up to 15 minutes data loss" },
    { value: "tier-3-1hr", label: "Tier 3: Up to 1 hour data loss" },
    { value: "tier-4-4hr", label: "Tier 4: Up to 4 hours data loss" },
    { value: "tier-5-daily-backup", label: "Tier 5: Daily backup (4-24 hours data loss)" },
  ]
}

const fetchRtoRpoApprovers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "rodriguez-maria", label: "Rodriguez, Maria C." },
    { value: "thompson-sarah", label: "Thompson, Sarah K." },
    { value: "chen-michael", label: "Chen, Michael R." },
    { value: "williams-jennifer", label: "Williams, Jennifer L." },
    { value: "anderson-david", label: "Anderson, David M." },
  ]
}

const fetchConfiguration = async (applicationId: string) => {
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
    portfolio: "apac",
    portfolioLead: "Anderson, David M.",
    team: "Australia Apps",
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

// New fetch functions for additional dropdowns and autocomplete
const fetchPortfolios = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "apac", label: "APAC" },
    { value: "emea", label: "EMEA" },
    { value: "americas", label: "Americas" },
    { value: "global", label: "Global" },
  ]
}

const fetchTeams = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "platform-engineering", label: "Platform Engineering" },
    { value: "application-development", label: "Application Development" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "security", label: "Security" },
    { value: "data-analytics", label: "Data & Analytics" },
    { value: "australia-apps", label: "Australia Apps" },
  ]
}

const fetchOrganizations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "gcib", label: "GCIB" },
    { value: "gts", label: "GTS" },
    { value: "consumer", label: "Consumer Banking" },
    { value: "investment", label: "Investment Banking" },
    { value: "risk", label: "Risk Management" },
  ]
}

const fetchLineOfBusiness = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "treasury-payments", label: "Treasury & Payments" },
    { value: "lending", label: "Lending" },
    { value: "deposits", label: "Deposits" },
    { value: "trade-finance", label: "Trade Finance" },
    { value: "risk-management", label: "Risk Management" },
  ]
}

const fetchAPSSupport = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "john-smith", label: "John Smith - Senior APS Manager" },
    { value: "sarah-johnson", label: "Sarah Johnson - APS Manager" },
    { value: "mike-chen", label: "Mike Chen - Lead APS Manager" },
    { value: "lisa-wong", label: "Lisa Wong - APS Manager" },
    { value: "david-brown", label: "David Brown - Senior APS Manager" },
    { value: "kumar-vipin", label: "Kumar, Vipin" },
  ]
}

const fetchAPSTechLeads = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "alex-kumar", label: "Alex Kumar - Senior Technical Lead" },
    { value: "maria-garcia", label: "Maria Garcia - Technical Lead" },
    { value: "james-wilson", label: "James Wilson - Lead Technical Architect" },
    { value: "priya-patel", label: "Priya Patel - Senior Technical Lead" },
    { value: "robert-taylor", label: "Robert Taylor - Technical Lead" },
    { value: "mengupta-venkata", label: "Mengupta, Venkata Kumar" },
  ]
}

const fetchSupportModels = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "bps-24x7", label: "BPS 24x7" },
    { value: "bps-business-hours", label: "BPS Business Hours" },
    { value: "internal-support", label: "Internal Support" },
    { value: "vendor-support", label: "Vendor Support" },
  ]
}

// Original exports
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

// New exports for additional functionality
export const usePortfolios = () => {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: fetchPortfolios,
    staleTime: 5 * 60 * 1000,
  })
}

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 5 * 60 * 1000,
  })
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    staleTime: 5 * 60 * 1000,
  })
}

export const useLineOfBusiness = () => {
  return useQuery({
    queryKey: ["line-of-business"],
    queryFn: fetchLineOfBusiness,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAPSSupport = () => {
  return useQuery({
    queryKey: ["aps-support"],
    queryFn: fetchAPSSupport,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAPSTechLeads = () => {
  return useQuery({
    queryKey: ["aps-tech-leads"],
    queryFn: fetchAPSTechLeads,
    staleTime: 5 * 60 * 1000,
  })
}

export const useSupportModels = () => {
  return useQuery({
    queryKey: ["support-models"],
    queryFn: fetchSupportModels,
    staleTime: 5 * 60 * 1000,
  })
}
