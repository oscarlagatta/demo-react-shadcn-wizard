import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Enhanced hook for fetching application data by AIT number
export function useGetApplicationByAit(aitNumber: string) {
  return useQuery({
    queryKey: ["application", aitNumber],
    queryFn: async () => {
      // This would be replaced with your actual API call
      // return getApiV2ApplicationGetApplicationDetailByAitOptions({
      //   query: { aitnumber: aitNumber }
      // })

      // Mock implementation for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        id: 27,
        appExpId: 27,
        aitNumber: 100,
        aitName: "Account Analysis Receivable (AAR)",
        aitShortname: "AAR",
        twoDot: "VM",
        twoDotDesc: "GCIB AND GTS TECH",
        threeDot: "VMB",
        threeDotDesc: "GCIB AND GTS TECH",
        fourDot: null,
        fourDotDesc: null,
        aitDescription: "Performs all billing and receivables functions for analyzed accounts.",
        techExec: "Smith, John",
        techExecEmail: null,
        managementContact: "Meloni, Georgia",
        managementContactEmail: null,
        applicationManager: "Rodriguez, Lucy",
        applicationManagerEmail: null,
        apsTechnicalLeadnbkid: "xk32ki3",
        apsTechnicalLeadName: "Smith, Belinda",
        apsSupportContact: "Powers, Austin",
        technicalExecutiveLoginId: "nk32ki2",
        mgmtcontactLoginId: "os98o32",
        technicalSupportDevelopmentContactLoginId: "nb33sd4",
        secondLevelProductionSupportLoginId: "bk52li4",
        secondLevelProductionSupportLoginName: "Villalobos, Hugo",
        apsSupportManager: "df43fd2",
        l2SupportGroup: "APPS-GWB-USTMR AAREC-US",
        ucaFlag: true,
        aitStatus: true,
        l3SupportGroup: "APPS-GWB-USTMR AAREC-US",
        businessService: null,
        businesssservicedes: null,
        businessserviceList: null,
        l3SupportContact: "Krainski, Edward",
        threeDotHierarchyManagerLoginId: "nd43kd3",
        stabilityFlag: true,
        regionid: "3",
        regionName: "AMRS",
        apsPortfolioId: 10,
        apsPortfolioName: "Global Payments",
        apsPortfolioTeamLeadId: "ns03lk3",
        apsPortfolioTeamLeadName: "Sanchez, Hugo",
        apsPortfolioPCNbk: "ks33ik3",
        apsPortfolioPCName: "DelPiero, Alessandro",
        apsPortfolioPDNbk: "ks33ik3",
        apsPortfolioPDName: "DelPiero, Alessandro",
        organisationId: 2,
        organisationName: "Global Banking Technology",
        lobId: null,
        loBName: null,
        functionids: "",
        functionNames: null,
        isCriticalService: true,
        apsTeamId: 34,
        apsTeamName: "Name Services",
        aligningOrg: "GCIB AND GTS TECH",
        appStatus: "In Production",
        createdby: null,
        createdUserId: null,
        updatedby: 305,
        createdusername: null,
        updatedusername: "Lagatta, Oscar",
        createddate: "2022-06-08T06:35:07.13",
        updateddate: "2025-06-09T10:11:54.567",
        orgFunctionsModels: null,
        tagIds: "",
        applicationTagModels: null,
        statusProductionDate: null,
        bpssupported: true,
        pcgroup: "ITOP-GWB-GTST TCCM PROBCOORD-GLBL",
        pclead: null,
        pcleadnbid: null,
        appDocumentTitle: "Enter Link",
        appDocumentUrl: null,
        appSupportDg: "db.askdsf_prod_support_sdfs@bank.com",
        attestationDueDate: "2024-10-07T18:51:00.367",
        attestationUserId: "SI30KD3",
        attestationUsername: "Powers, Austin",
        showAttestation: true,
        nextAttestationDueDate: "2025-06-30T00:00:00",
        applicationTagNames: null,
        appImportDateTime: null,
        rto: "Tier 5: Greater than 24 hour, up to and including 48 hours",
        rpo: "Tier 5: Daily backup: Greater than 4 hours, up to and including 24 hours",
        rtorpoapprover: "Signorini, John",
        rtorpoapproverDate: "2024-09-20T06:24:51",
        supportModelId: 2,
        supportModelName: "BPS - 365x5",
        mainframeflag: false,
        inhouse: "External (Hosted entirely outside the bank network)",
        appResourceHeadCount: 1.0,
        pcsmapingList: [],
        resiliencyScore: null,
        stabilityScore: null,
        resiliencyScoreDiif: null,
        apsSupportManagerEmail: null,
        aspSupportManagerBand: null,
        apsSupportManagerSupveriserName: null,
        apsSupportManagerSuperviserEmail: null,
        apsSupportManagerSuperviserBand: null,
        isTrasnfershipChanged: false,
        appResourceName: null,
        appResourceNBID: null,
        appResourceStatus: null,
      }
    },
    enabled: aitNumber !== "" && aitNumber !== undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Function to map API response to form structure
export function mapApiResponseToFormData(apiData: any) {
  if (!apiData) return null

  return {
    applicationId: apiData.aitNumber?.toString() || "",
    applicationName: apiData.aitName || "",
    shortName: apiData.aitShortname || "",
    region: apiData.regionName ? [mapRegionNameToValue(apiData.regionName)] : [],
    twoDot: apiData.twoDot || "",
    twoDotDesc: apiData.twoDotDesc || "",
    threeDot: apiData.threeDot || "",
    threeDotDesc: apiData.threeDotDesc || "",
    description: apiData.aitDescription || "",
    rto: mapRtoToValue(apiData.rto),
    rpo: mapRpoToValue(apiData.rpo),
    rtoApprover: apiData.rtorpoapprover || "",
    rtoApproveDate: apiData.rtorpoapproverDate ? new Date(apiData.rtorpoapproverDate).toISOString().split("T")[0] : "",
    usesMainframe: apiData.mainframeflag ? "yes" : ("no" as const),
    applicationHosting: mapInhouseToHosting(apiData.inhouse),
    status: apiData.appStatus || "",
    techExec: apiData.techExec || "",
    managementContact: apiData.managementContact || "",
    applicationManager: apiData.applicationManager || "",
    portfolio: mapPortfolioNameToValue(apiData.apsPortfolioName),
    portfolioLead: apiData.apsPortfolioTeamLeadName || "",
    team: mapTeamNameToValue(apiData.apsTeamName),
    organization: mapOrganizationNameToValue(apiData.organisationName),
    lineOfBusiness: apiData.loBName ? mapLobNameToValue(apiData.loBName) : "",
    aligningOrg: mapAligningOrgToValue(apiData.aligningOrg),
    apsSupport: apiData.apsSupportContact || "",
    apsTechnicalLead: apiData.apsTechnicalLeadName || "",
    l2SupportGroup: apiData.l2SupportGroup || "",
    l2SupportContact: apiData.secondLevelProductionSupportLoginName || "",
    supportContact: apiData.apsSupportContact || "",
    supportContactEmail: apiData.appSupportDg || "",
    bpsSupported: apiData.bpssupported ? "yes" : ("no" as const),
    supportModel: mapSupportModelToValue(apiData.supportModelName),
    escalationPath: `L1 → L2 Support Group → APS Support Manager → APS Technical Lead`,
    supportRegion: mapRegionNameToValue(apiData.regionName),
    supportTimezone: mapRegionToTimezone(apiData.regionName),
    updatedBy: apiData.updatedusername || "",
    updatedDate: apiData.updateddate ? new Date(apiData.updateddate).toLocaleString() : "",
    lastAttestedDate: apiData.attestationDueDate ? new Date(apiData.attestationDueDate).toLocaleString() : "",
    attestedBy: apiData.attestationUsername || "",
    nextDueAttestedDate: apiData.nextAttestationDueDate
      ? new Date(apiData.nextAttestationDueDate).toLocaleString()
      : "",
    createdBy: apiData.createdusername || "",
    createdDate: apiData.createddate ? new Date(apiData.createddate).toLocaleString() : "",
    version: "v2.1.3", // This might need to come from another source
  }
}

// Helper mapping functions
function mapRegionNameToValue(regionName: string): string {
  const regionMap: Record<string, string> = {
    AMRS: "americas",
    APAC: "apac-latam",
    EMEA: "emea",
    GLOBAL: "global",
  }
  return regionMap[regionName] || "americas"
}

function mapRtoToValue(rto: string): string {
  if (rto?.includes("Immediate")) return "tier-1-immediate"
  if (rto?.includes("15 minutes to 2 hours")) return "tier-2-15min-2hr"
  if (rto?.includes("2 hours to 8 hours")) return "tier-3-2hr-8hr"
  if (rto?.includes("8 hours to 24 hours")) return "tier-4-8hr-24hr"
  if (rto?.includes("24 hour")) return "tier-5-24-48"
  return "tier-5-24-48"
}

function mapRpoToValue(rpo: string): string {
  if (rpo?.includes("No data loss")) return "tier-1-no-loss"
  if (rpo?.includes("15 minutes")) return "tier-2-15min"
  if (rpo?.includes("1 hour")) return "tier-3-1hr"
  if (rpo?.includes("4 hours")) return "tier-4-4hr"
  if (rpo?.includes("Daily backup")) return "tier-5-daily-backup"
  return "tier-5-daily-backup"
}

function mapInhouseToHosting(
  inhouse: string,
): "in-house" | "cloud-public" | "cloud-private" | "hybrid" | "third-party" {
  if (inhouse?.includes("External")) return "third-party"
  if (inhouse?.includes("Cloud")) return "cloud-public"
  return "in-house"
}

function mapPortfolioNameToValue(portfolioName: string): string {
  if (portfolioName?.includes("Global")) return "global"
  if (portfolioName?.includes("APAC")) return "apac"
  if (portfolioName?.includes("EMEA")) return "emea"
  if (portfolioName?.includes("Americas")) return "americas"
  return "global"
}

function mapTeamNameToValue(teamName: string): string {
  const teamMap: Record<string, string> = {
    "Name Services": "platform-engineering",
    "Application Development": "application-development",
    "Data Engineering": "data-engineering",
    Infrastructure: "infrastructure",
    Security: "security",
    DevOps: "devops",
  }
  return teamMap[teamName] || "platform-engineering"
}

function mapOrganizationNameToValue(orgName: string): string {
  if (orgName?.includes("Global Banking")) return "gcib"
  if (orgName?.includes("Transaction")) return "gts"
  if (orgName?.includes("Consumer")) return "ccb"
  if (orgName?.includes("Private")) return "pbwm"
  if (orgName?.includes("Operations")) return "operations"
  if (orgName?.includes("Risk")) return "risk"
  if (orgName?.includes("Compliance")) return "compliance"
  return "gcib"
}

function mapLobNameToValue(lobName: string): string {
  const lobMap: Record<string, string> = {
    Treasury: "treasury-payments",
    Securities: "securities-services",
    "Commercial Cards": "commercial-cards",
    "Cash Management": "cash-management",
    "Trade Finance": "trade-finance",
    "Foreign Exchange": "foreign-exchange",
    Lending: "lending-services",
    "Investment Banking": "investment-banking",
    Markets: "markets",
    "Private Banking": "private-banking",
    "Retail Banking": "retail-banking",
    "Credit Cards": "credit-cards",
  }
  return lobMap[lobName] || "treasury-payments"
}

function mapAligningOrgToValue(aligningOrg: string): string {
  if (aligningOrg?.includes("GCIB AND GTS")) return "gcib-gts-tech"
  if (aligningOrg?.includes("CCB")) return "ccb-tech"
  if (aligningOrg?.includes("PBWM")) return "pbwm-tech"
  if (aligningOrg?.includes("ENTERPRISE")) return "enterprise-tech"
  if (aligningOrg?.includes("INFRASTRUCTURE")) return "infrastructure-tech"
  if (aligningOrg?.includes("CYBERSECURITY")) return "cybersecurity-tech"
  if (aligningOrg?.includes("DATA")) return "data-analytics-tech"
  if (aligningOrg?.includes("DIGITAL")) return "digital-tech"
  return "gcib-gts-tech"
}

function mapSupportModelToValue(supportModel: string): string {
  if (supportModel?.includes("BPS - 24x7")) return "bps-24x7"
  if (supportModel?.includes("BPS") && supportModel?.includes("365")) return "bps-24x7"
  if (supportModel?.includes("BPS")) return "bps-business-hours"
  if (supportModel?.includes("Standard - 24x7")) return "standard-24x7"
  if (supportModel?.includes("Standard")) return "standard-business-hours"
  return "on-demand"
}

function mapRegionToTimezone(regionName: string): string {
  const timezoneMap: Record<string, string> = {
    AMRS: "americas",
    APAC: "asia-pacific",
    EMEA: "europe-africa",
    GLOBAL: "global",
  }
  return timezoneMap[regionName] || "americas"
}

// Enhanced configuration hook that uses the application data
export const useConfiguration = (aitNumber: string) => {
  const applicationQuery = useGetApplicationByAit(aitNumber)

  return useQuery({
    queryKey: ["configuration", aitNumber],
    queryFn: () => {
      const mappedData = mapApiResponseToFormData(applicationQuery.data)
      return mappedData
    },
    enabled: !!applicationQuery.data && !!aitNumber,
    select: (data) => data,
  })
}

// Keep existing hooks for dropdown options
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

export const useSaveConfiguration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveConfiguration,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["configuration"] })
      queryClient.invalidateQueries({ queryKey: ["application"] })
    },
  })
}

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

const saveConfiguration = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return { success: true, message: "Configuration saved successfully" }
}
