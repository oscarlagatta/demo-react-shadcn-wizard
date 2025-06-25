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

// Simplified configuration hook that directly uses the application data
export const useConfiguration = (aitNumber: string) => {
  return useGetApplicationByAit(aitNumber)
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

// Mock API functions - replace with actual API calls
const fetchRegions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "AMRS", label: "Americas" },
    { value: "APAC", label: "APAC" },
    { value: "EMEA", label: "EMEA" },
    { value: "GLOBAL", label: "Global" },
  ]
}

const fetchRtoOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "Tier 1: Immediate (0-15 minutes)", label: "Tier 1: Immediate (0-15 minutes)" },
    { value: "Tier 2: 15 minutes to 2 hours", label: "Tier 2: 15 minutes to 2 hours" },
    { value: "Tier 3: 2 hours to 8 hours", label: "Tier 3: 2 hours to 8 hours" },
    { value: "Tier 4: 8 hours to 24 hours", label: "Tier 4: 8 hours to 24 hours" },
    {
      value: "Tier 5: Greater than 24 hour, up to and including 48 hours",
      label: "Tier 5: Greater than 24 hours, up to 48 hours",
    },
  ]
}

const fetchRpoOptions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "Tier 1: No data loss (Real-time replication)", label: "Tier 1: No data loss (Real-time replication)" },
    { value: "Tier 2: Up to 15 minutes data loss", label: "Tier 2: Up to 15 minutes data loss" },
    { value: "Tier 3: Up to 1 hour data loss", label: "Tier 3: Up to 1 hour data loss" },
    { value: "Tier 4: Up to 4 hours data loss", label: "Tier 4: Up to 4 hours data loss" },
    {
      value: "Tier 5: Daily backup: Greater than 4 hours, up to and including 24 hours",
      label: "Tier 5: Daily backup (4-24 hours data loss)",
    },
  ]
}

const fetchRtoRpoApprovers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "Rodriguez, Maria C.", label: "Rodriguez, Maria C." },
    { value: "Thompson, Sarah K.", label: "Thompson, Sarah K." },
    { value: "Chen, Michael R.", label: "Chen, Michael R." },
    { value: "Williams, Jennifer L.", label: "Williams, Jennifer L." },
    { value: "Anderson, David M.", label: "Anderson, David M." },
    { value: "Signorini, John", label: "Signorini, John" },
  ]
}

const saveConfiguration = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return { success: true, message: "Configuration saved successfully" }
}
