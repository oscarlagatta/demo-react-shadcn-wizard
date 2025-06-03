import { z } from "zod"

export const applicationDetailsSchema = z.object({
  shortName: z
    .string()
    .min(1, "Short name is required")
    .max(10, "Short name must be 10 characters or less")
    .regex(/^[A-Z0-9]+$/, "Short name must contain only uppercase letters and numbers"),

  region: z.string().min(1, "Region is required").max(100, "Region must be 100 characters or less"),

  twoDot: z
    .string()
    .min(1, "Two Dot is required")
    .max(5, "Two Dot must be 5 characters or less")
    .regex(/^[A-Z]+$/, "Two Dot must contain only uppercase letters"),

  twoDotDesc: z
    .string()
    .min(1, "Two Dot description is required")
    .max(200, "Two Dot description must be 200 characters or less"),

  threeDot: z
    .string()
    .min(1, "Three Dot is required")
    .max(5, "Three Dot must be 5 characters or less")
    .regex(/^[A-Z]+$/, "Three Dot must contain only uppercase letters"),

  threeDotDesc: z
    .string()
    .min(1, "Three Dot description is required")
    .max(200, "Three Dot description must be 200 characters or less"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be 1000 characters or less"),

  rto: z.string().min(1, "RTO is required"),
  rpo: z.string().min(1, "RPO is required"),

  rtoApprover: z
    .string()
    .min(1, "RTO/RPO Approver is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  rtoApproveDate: z.string().min(1, "RTO/RPO Approve Date is required"),

  usesMainframe: z.enum(["yes", "no"], {
    required_error: "Please select if mainframe is used",
    invalid_type_error: "Please select a valid option",
  }),

  applicationHosting: z.string().min(1, "Application hosting is required"),
})

export const organizationAlignmentSchema = z.object({
  techExec: z
    .string()
    .min(1, "Tech Exec is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  managementContact: z
    .string()
    .min(1, "Management Contact is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  applicationManager: z
    .string()
    .min(1, "Application Manager is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  portfolio: z.string().min(1, "Portfolio is required"),

  portfolioLead: z
    .string()
    .min(1, "Portfolio Lead is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  team: z.string().min(1, "Team is required"),
  organisation: z.string().optional(),
  lineOfBusiness: z.string().optional(),
  aligningOrg: z.string().min(1, "Aligning Org is required"),
})

export const supportAlignmentSchema = z.object({
  apsSupport: z
    .string()
    .min(1, "APS Support Manager is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  apsTechnicalLead: z
    .string()
    .min(1, "APS Technical Lead is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  l2SupportGroup: z.string().min(1, "L2 Support Group is required"),

  l2SupportContact: z
    .string()
    .min(1, "L2 Support Contact is required")
    .regex(/^[A-Za-z\s,.]+$/, "Please enter a valid name"),

  bpsSupported: z.enum(["yes", "no"], {
    required_error: "Please select BPS support status",
    invalid_type_error: "Please select a valid option",
  }),

  supportModel: z.enum(["bps-24x7", "bps-business-hours", "standard"], {
    required_error: "Please select support model",
    invalid_type_error: "Please select a valid support model",
  }),
})

export const completeFormSchema = z.object({
  applicationDetails: applicationDetailsSchema,
  organizationAlignment: organizationAlignmentSchema,
  supportAlignment: supportAlignmentSchema,
})

export type ApplicationDetailsFormData = z.infer<typeof applicationDetailsSchema>
export type OrganizationAlignmentFormData = z.infer<typeof organizationAlignmentSchema>
export type SupportAlignmentFormData = z.infer<typeof supportAlignmentSchema>
export type CompleteFormData = z.infer<typeof completeFormSchema>
