import { z } from "zod"

export const applicationDetailsSchema = z.object({
  aitNumber: z.number(),
  aitName: z.string().min(1, "Application name is required").max(100, "Application name is too long"),
  aitShortname: z.string().min(1, "Short name is required").max(10, "Short name must be 10 characters or less"),
  regionName: z.string().min(1, "Region is required"),
  twoDot: z.string().min(1, "Two Dot is required").max(5, "Two Dot must be 5 characters or less"),
  twoDotDesc: z.string().min(1, "Two Dot description is required"),
  threeDot: z.string().min(1, "Three Dot is required").max(5, "Three Dot must be 5 characters or less"),
  threeDotDesc: z.string().min(1, "Three Dot description is required"),
  aitDescription: z.string().min(10, "Description must be at least 10 characters"),
  rto: z.string().min(1, "RTO is required"),
  rpo: z.string().min(1, "RPO is required"),
  rtorpoapprover: z.string().min(1, "RTO/RPO Approver is required"),
  rtorpoapproverDate: z.string().min(1, "RTO/RPO Approve Date is required"),
  mainframeflag: z.boolean(),
  inhouse: z.string().min(1, "Application hosting is required"),
  appStatus: z.string().min(1, "Status is required"),
})

export const organizationAlignmentSchema = z.object({
  techExec: z.string().min(1, "Tech Exec is required"),
  managementContact: z.string().min(1, "Management Contact is required"),
  applicationManager: z.string().min(1, "Application Manager is required"),
  apsPortfolioName: z.string().min(1, "Portfolio is required"),
  apsPortfolioTeamLeadName: z.string().min(1, "Portfolio Lead is required"),
  apsTeamName: z.string().min(1, "Team is required"),
  organisationName: z.string().min(1, "Organization is required"),
  loBName: z.string().optional(),
  aligningOrg: z.string().min(1, "Aligning Org is required"),
})

export const supportAlignmentSchema = z.object({
  apsSupportContact: z.string().min(1, "APS Support is required"),
  apsTechnicalLeadName: z.string().min(1, "APS Technical Lead is required"),
  l2SupportGroup: z.string().min(1, "L2 Support Group is required"),
  secondLevelProductionSupportLoginName: z.string().min(1, "L2 Support Contact is required"),
  appSupportDg: z.string().email("Invalid email address"),
  bpssupported: z.boolean(),
  supportModelName: z.string().min(1, "Support Model is required"),
  regionName: z.string().min(1, "Support Region is required"),
})

export const otherInformationSchema = z.object({
  updatedusername: z.string().optional(),
  updateddate: z.string().optional(),
  attestationDueDate: z.string().optional(),
  attestationUsername: z.string().optional(),
  nextAttestationDueDate: z.string().optional(),
  createdusername: z.string().optional(),
  createddate: z.string().optional(),
  id: z.number().optional(),
})

export const fullConfigurationSchema = applicationDetailsSchema
  .merge(organizationAlignmentSchema)
  .merge(supportAlignmentSchema)
  .merge(otherInformationSchema)

export type ApplicationDetailsForm = z.infer<typeof applicationDetailsSchema>
export type OrganizationAlignmentForm = z.infer<typeof organizationAlignmentSchema>
export type SupportAlignmentForm = z.infer<typeof supportAlignmentSchema>
export type OtherInformationForm = z.infer<typeof otherInformationSchema>
export type FullConfigurationForm = z.infer<typeof fullConfigurationSchema>
