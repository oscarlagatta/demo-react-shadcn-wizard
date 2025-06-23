import { z } from "zod"

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  canonicalName: z.string(),
  category: z.enum(["technology", "functional"]),
  description: z.string().optional(),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comments: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: z.string(),
  isSystemSkill: z.boolean().default(false),
  usageCount: z.number().default(0),
})

export const createSkillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters")
    .max(50, "Skill name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s.#+\-_&()]+$/, "Skill name contains invalid characters"),
  category: z.enum(["technology", "functional"], {
    required_error: "Please select a skill category",
  }),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional().or(z.literal("")),
})

export const deleteSkillSchema = z.object({
  skillId: z.string(),
  confirmationText: z.string().min(1, "Please type the skill name to confirm deletion"),
})

export const unassignSkillSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one user must be selected"),
  skillIds: z.array(z.string()).min(1, "At least one skill must be selected"),
  confirmationText: z.string().min(1, "Please type 'UNASSIGN' to confirm"),
})

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters"),
  employeeId: z
    .string()
    .min(3, "Employee ID must be at least 3 characters")
    .max(20, "Employee ID cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9\-_]+$/, "Employee ID can only contain letters, numbers, hyphens, and underscores"),
  manager: z
    .string()
    .min(2, "Manager name must be at least 2 characters")
    .max(100, "Manager name cannot exceed 100 characters"),
  lob: z.string().min(2, "LOB must be at least 2 characters").max(100, "LOB cannot exceed 100 characters"),
  lobDetail: z
    .string()
    .min(2, "LOB detail must be at least 2 characters")
    .max(150, "LOB detail cannot exceed 150 characters"),
  role: z.string().min(2, "Role must be at least 2 characters").max(50, "Role cannot exceed 50 characters"),
  skillLevel: z.enum(["Basic", "Advanced", "Expert"], {
    required_error: "Please select a skill level",
  }),
  percentAllocated: z.number().min(0, "Allocation cannot be negative").max(100, "Allocation cannot exceed 100%"),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
})

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  email: z.string().email(),
  employeeId: z.string(),
  profileImage: z.string(),
  manager: z.string(),
  lob: z.string(),
  lobDetail: z.string(),
  role: z.string(),
  skillLevel: z.enum(["Basic", "Advanced", "Expert"]),
  percentAllocated: z.number(),
  isTerminated: z.boolean(),
  startDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
})

export const userSkillSchema = z.object({
  userId: z.string(),
  skillId: z.string(),
  rating: z.number().min(1).max(5),
  comments: z.string().optional(),
  assignedAt: z.date(),
  assignedBy: z.string(),
})

export const userSkillAssignmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  skillId: z.string(),
  skillName: z.string(),
  skillCategory: z.enum(["technology", "functional"]),
  rating: z.number().min(1).max(5),
  comments: z.string().optional(),
  assignedAt: z.date(),
  assignedBy: z.string(),
  assignedByName: z.string(),
})

export const skillSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  category: z.enum(["technology", "functional"]).optional(),
})

export const userSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
})

export const skillTemplateSchema = z.object({
  name: z.string().min(2, "Template name is required"),
  skills: z
    .array(
      z.object({
        skillId: z.string(),
        rating: z.number().min(1).max(5),
      }),
    )
    .min(1, "At least one skill is required"),
})

export const capabilityMatrixFormSchema = z.object({
  skills: z.array(
    z.object({
      skillId: z.string(),
      name: z.string(),
      category: z.enum(["technology", "functional"]),
      rating: z.number().min(1).max(5),
      comments: z.string().optional(),
    }),
  ),
  userIds: z.array(z.string()).min(1, "At least one user must be selected"),
  perUserCustomization: z.boolean().default(false),
  userSkillMappings: z
    .array(
      z.object({
        userId: z.string(),
        skills: z.array(
          z.object({
            skillId: z.string(),
            rating: z.number().min(1).max(5),
            comments: z.string().optional(),
          }),
        ),
      }),
    )
    .optional(),
})

export type Skill = z.infer<typeof skillSchema>
export type CreateSkillForm = z.infer<typeof createSkillSchema>
export type DeleteSkillForm = z.infer<typeof deleteSkillSchema>
export type UnassignSkillForm = z.infer<typeof unassignSkillSchema>
export type CreateUserForm = z.infer<typeof createUserSchema>
export type User = z.infer<typeof userSchema>
export type UserSkill = z.infer<typeof userSkillSchema>
export type UserSkillAssignment = z.infer<typeof userSkillAssignmentSchema>
export type CapabilityMatrixForm = z.infer<typeof capabilityMatrixFormSchema>
export type SkillSearch = z.infer<typeof skillSearchSchema>
export type UserSearch = z.infer<typeof userSearchSchema>
export type SkillTemplate = z.infer<typeof skillTemplateSchema>
