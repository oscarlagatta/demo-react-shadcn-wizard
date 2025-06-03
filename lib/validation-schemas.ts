import { z } from "zod"

// Base validation schemas for each section
export const applicationDetailsSchema = z.object({
  applicationName: z.string().min(1, "Application name is required").max(100, "Application name too long").optional(),
  shortName: z.string().min(1, "Short name is required").max(10, "Short name must be 10 characters or less"),
  region: z.string().min(1, "Region is required"),
  twoDot: z.string().min(1, "Two dot is required").max(5, "Two dot must be 5 characters or less"),
  twoDotDesc: z.string().min(1, "Two dot description is required"),
  threeDot: z.string().min(1, "Three dot is required").max(5, "Three dot must be 5 characters or less"),
  threeDotDesc: z.string().min(1, "Three dot description is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description too long"),
  rto: z.string().min(1, "RTO is required"),
  rpo: z.string().min(1, "RPO is required"),
  rtoApprover: z.string().min(1, "RTO approver is required"),
  rtoApproveDate: z.string().min(1, "RTO approve date is required"),
  usesMainframe: z.enum(["yes", "no", "partial"], { required_error: "Mainframe usage must be specified" }),
  applicationHosting: z.string().min(1, "Application hosting is required"),
  status: z.string().optional(),
})

export const organizationAlignmentSchema = z.object({
  techExec: z.string().min(1, "Tech Executive is required"),
  managementContact: z.string().min(1, "Management contact is required"),
  applicationManager: z.string().min(1, "Application manager is required"),
  portfolio: z.string().min(1, "Portfolio is required"),
  portfolioLead: z.string().min(1, "Portfolio lead is required"),
  team: z.string().min(1, "Team is required"),
  organisation: z.string().optional(),
  lineOfBusiness: z.string().optional(),
  aligningOrg: z.string().min(1, "Aligning organization is required"),
})

export const supportAlignmentSchema = z.object({
  apsSupport: z.string().min(1, "APS Support manager is required"),
  apsTechnicalLead: z.string().min(1, "APS Technical lead is required"),
  l2SupportGroup: z.string().min(1, "L2 Support group is required"),
  l2SupportContact: z.string().min(1, "L2 Support contact is required"),
  supportContact: z.string().optional(),
  supportContactEmail: z.string().email("Invalid email format").optional(),
  bpsSupported: z.enum(["yes", "no", "limited"], { required_error: "BPS support status must be specified" }),
  supportModel: z.string().min(1, "Support model is required"),
  escalationPath: z.string().optional(),
  supportRegion: z.string().optional(),
  supportTimezone: z.string().optional(),
})

export const otherInformationSchema = z.object({
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  lastAttestedDate: z.string().optional(),
  attestedBy: z.string().optional(),
  nextDueAttestedDate: z.string().optional(),
  version: z.string().optional(),
})

// Combined schema for full validation
export const fullApplicationSchema = z.object({
  applicationDetails: applicationDetailsSchema,
  organizationAlignment: organizationAlignmentSchema,
  supportAlignment: supportAlignmentSchema,
  otherInformation: otherInformationSchema,
})

export type ApplicationDetailsFormData = z.infer<typeof applicationDetailsSchema>
export type OrganizationAlignmentFormData = z.infer<typeof organizationAlignmentSchema>
export type SupportAlignmentFormData = z.infer<typeof supportAlignmentSchema>
export type OtherInformationFormData = z.infer<typeof otherInformationSchema>
export type FullApplicationFormData = z.infer<typeof fullApplicationSchema>

// Section validation mapping
export const sectionSchemas = {
  0: applicationDetailsSchema,
  1: organizationAlignmentSchema,
  2: supportAlignmentSchema,
  3: otherInformationSchema,
} as const

export const sectionNames = {
  0: "applicationDetails",
  1: "organizationAlignment",
  2: "supportAlignment",
  3: "otherInformation",
} as const
