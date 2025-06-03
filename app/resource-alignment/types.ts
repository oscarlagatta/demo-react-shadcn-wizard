// Model: Data Types and Interfaces
export interface Resource {
  id: string
  name: string
  profileImage: string
  manager: string
  lob: string
  lobDetail: string
  role: string
  skillLevel: "Basic" | "Advanced" | "Expert"
  percentAllocated: number
  isTerminated: boolean
}

export interface ResourceGap {
  id: string
  role: string
  skillLevel: "Basic" | "Advanced" | "Expert"
  requiredCount: number
  currentCount: number
  priority: "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Filled"
}

export interface SummaryMetrics {
  totalResourcesAllocated: number
  headcountConversion: number
  applicationHeadcountRequirement: number
  resourceAlignedNotInBPS: number
}

export interface ConfigurationSection {
  id: string
  title: string
  description: string
  icon: any
  color: string
}

export interface ResourceAlignmentState {
  currentSection: number
  isEditMode: boolean
  hasUnsavedChanges: boolean
  validationErrors: Record<string, string>
  searchQuery: string
  filterSkillLevel: string | null
  filterLOB: string | null
  summaryMetrics: SummaryMetrics
  resources: Resource[]
  resourceGaps: ResourceGap[]
}

export interface ResourceFilters {
  searchQuery: string
  skillLevel: string | null
  lob: string | null
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}
