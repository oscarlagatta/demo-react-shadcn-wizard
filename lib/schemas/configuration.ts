import { z } from "zod"

export const applicationDetailsSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  applicationName: z.string().min(1, "Application name is required").max(100, "Application name is too long"),
  shortName: z.string().min(1, "Short name is required").max(10, "Short name must be 10 characters or less"),
  region: z.array(z.string()).min(1, "At least one region must be selected"),
  twoDot: z.string().min(1, "Two Dot is required").max(5, "Two Dot must be 5 characters or less"),
  twoDotDesc: z.string().min(1, "Two Dot description is required"),
  threeDot: z.string().min(1, "Three Dot is required").max(5, "Three Dot must be 5 characters or less"),
  threeDotDesc: z.string().min(1, "Three Dot description is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rto: z.string().min(1, "RTO is required"),
  rpo: z.string().min(1, "RPO is required"),
  rtoApprover: z.string().min(1, "RTO/RPO Approver is required"),
  rtoApproveDate: z.string().min(1, "RTO/RPO Approve Date is required"),
  usesMainframe: z.enum(["yes", "no", "partial"]),
  applicationHosting: z.enum(["in-house", "cloud-public", "cloud-private", "hybrid", "third-party"]),
  status: z.string().min(1, "Status is required"),
})

export const organizationAlignmentSchema = z.object({
  techExec: z.string().min(1, "Tech Exec is required"),
  managementContact: z.string().min(1, "Management Contact is required"),
  applicationManager: z.string().min(1, "Application Manager is required"),
  apsPortfolioId: z.string().min(1, "Portfolio is required"),
  apsPortfolioIdName: z.string().min(1, "Portfolio Name is required"),
  portfolioLead: z.string().min(1, "Portfolio Lead is required"),
  apsTeamName: z.string().min(1, "Team is required"),
  organization: z.string().min(1, "Organization is required"),
  lineOfBusiness: z.string().min(1, "Line of Business is required"),
  aligningOrg: z.string().min(1, "Aligning Org is required"),
})

export const supportAlignmentSchema = z.object({
  apsSupport: z.string().min(1, "APS Support is required"),
  apsTechnicalLead: z.string().min(1, "APS Technical Lead is required"),
  l2SupportGroup: z.string().min(1, "L2 Support Group is required"),
  l2SupportContact: z.string().min(1, "L2 Support Contact is required"),
  supportContact: z.string().min(1, "Support Contact is required"),
  supportContactEmail: z.string().email("Invalid email address"),
  bpsSupported: z.enum(["yes", "no", "limited"]),
  supportModel: z.string().min(1, "Support Model is required"),
  escalationPath: z.string().min(1, "Escalation Path is required"),
  supportRegion: z.string().min(1, "Support Region is required"),
  supportTimezone: z.string().min(1, "Support Timezone is required"),
})

export const otherInformationSchema = z.object({
  updatedBy: z.string(),
  updatedDate: z.string(),
  lastAttestedDate: z.string(),
  attestedBy: z.string(),
  nextDueAttestedDate: z.string(),
  createdBy: z.string(),
  createdDate: z.string(),
  version: z.string(),
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
