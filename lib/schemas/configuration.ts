import { z } from "zod"

export const applicationDetailsSchema = z.object({
  aitNumber: z.number().optional(),
  aitName: z.string().nullable().optional(),
  aitShortname: z.string().nullable().optional(),
  regionName: z.string().nullable().optional(),
  twoDot: z.string().nullable().optional(),
  twoDotDesc: z.string().nullable().optional(),
  threeDot: z.string().nullable().optional(),
  threeDotDesc: z.string().nullable().optional(),
  aitDescription: z.string().nullable().optional(),
  rto: z.string().nullable().optional(),
  rpo: z.string().nullable().optional(),
  rtorpoapprover: z.string().nullable().optional(),
  rtorpoapproverDate: z.string().nullable().optional(),
  mainframeflag: z.boolean().optional(),
  inhouse: z.string().nullable().optional(),
  appStatus: z.string().nullable().optional(),
})

export const organizationAlignmentSchema = z.object({
  techExec: z.string().nullable().optional(),
  managementContact: z.string().nullable().optional(),
  applicationManager: z.string().nullable().optional(),
  apsPortfolioName: z.string().nullable().optional(),
  apsPortfolioTeamLeadName: z.string().nullable().optional(),
  apsTeamName: z.string().nullable().optional(),
  organisationName: z.string().nullable().optional(),
  loBName: z.string().nullable().optional(),
  aligningOrg: z.string().nullable().optional(),
})

export const supportAlignmentSchema = z.object({
  apsSupportContact: z.string().nullable().optional(),
  apsTechnicalLeadName: z.string().nullable().optional(),
  l2SupportGroup: z.string().nullable().optional(),
  secondLevelProductionSupportLoginName: z.string().nullable().optional(),
  appSupportDg: z.string().nullable().optional(),
  bpssupported: z.boolean().optional(),
  supportModelName: z.string().nullable().optional(),
  regionName: z.string().nullable().optional(),
})

export const otherInformationSchema = z.object({
  updatedusername: z.string().nullable().optional(),
  updateddate: z.string().nullable().optional(),
  attestationDueDate: z.string().nullable().optional(),
  attestationUsername: z.string().nullable().optional(),
  nextAttestationDueDate: z.string().nullable().optional(),
  createdusername: z.string().nullable().optional(),
  createddate: z.string().nullable().optional(),
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
