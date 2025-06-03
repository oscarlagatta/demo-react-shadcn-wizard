// Model: Data Management and Business Logic
import type {
  Resource,
  ResourceGap,
  SummaryMetrics,
  ResourceAlignmentState,
  ResourceFilters,
  ValidationResult,
} from "./types"

export class ResourceAlignmentModel {
  private state: ResourceAlignmentState

  constructor() {
    this.state = this.getInitialState()
  }

  private getInitialState(): ResourceAlignmentState {
    return {
      currentSection: 0,
      isEditMode: false,
      hasUnsavedChanges: false,
      validationErrors: {},
      searchQuery: "",
      filterSkillLevel: null,
      filterLOB: null,
      summaryMetrics: {
        totalResourcesAllocated: 13,
        headcountConversion: 1.97,
        applicationHeadcountRequirement: 1,
        resourceAlignedNotInBPS: 2,
      },
      resources: this.getInitialResources(),
      resourceGaps: this.getInitialResourceGaps(),
    }
  }

  private getInitialResources(): Resource[] {
    return [
      {
        id: "1",
        name: "Chen, Michelle",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Rodriguez, Carlos M.",
        lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
        lobDetail: "FBV GLOBAL BANKING APS",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 3,
        isTerminated: false,
      },
      {
        id: "2",
        name: "Patel, Arjun",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Rodriguez, Carlos M.",
        lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
        lobDetail: "FBV GLOBAL BANKING APS",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 15,
        isTerminated: false,
      },
      {
        id: "3",
        name: "Thompson, Sarah",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Williams, David",
        lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
        lobDetail: "FBI - APS & CTO EMEA",
        role: "Support Manager",
        skillLevel: "Advanced",
        percentAllocated: 32,
        isTerminated: false,
      },
      {
        id: "4",
        name: "Kumar, Rajesh",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Anderson, Lisa K.",
        lob: "GLOBAL BUSINESS SERVICES",
        lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 5,
        isTerminated: false,
      },
      {
        id: "5",
        name: "Johnson, Emily",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Kumar, Rajesh",
        lob: "GLOBAL BUSINESS SERVICES",
        lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 5,
        isTerminated: false,
      },
      {
        id: "6",
        name: "Martinez, Diego",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Kumar, Rajesh",
        lob: "GLOBAL BUSINESS SERVICES",
        lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 5,
        isTerminated: true,
      },
      {
        id: "7",
        name: "Wong, Kevin",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Kumar, Rajesh",
        lob: "GLOBAL BUSINESS SERVICES",
        lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 5,
        isTerminated: false,
      },
      {
        id: "8",
        name: "Brown, Jessica",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Rodriguez, Carlos M.",
        lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
        lobDetail: "FBV GLOBAL BANKING APS",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 3,
        isTerminated: true,
      },
      {
        id: "9",
        name: "Williams, David",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Taylor, Michael",
        lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
        lobDetail: "FBI - APS & CTO EMEA",
        role: "L1 Support",
        skillLevel: "Basic",
        percentAllocated: 99,
        isTerminated: false,
      },
      {
        id: "10",
        name: "Singh, Priya",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Kumar, Rajesh",
        lob: "GLOBAL BUSINESS SERVICES",
        lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 5,
        isTerminated: false,
      },
      {
        id: "11",
        name: "Davis, Amanda",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Rodriguez, Carlos M.",
        lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
        lobDetail: "FBV GLOBAL BANKING APS",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 3,
        isTerminated: false,
      },
      {
        id: "12",
        name: "Lee, Benjamin",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Kumar, Rajesh",
        lob: "GLOBAL BUSINESS SERVICES",
        lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 5,
        isTerminated: false,
      },
      {
        id: "13",
        name: "Garcia, Roberto",
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: "Rodriguez, Carlos M.",
        lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
        lobDetail: "FBV GLOBAL BANKING APS",
        role: "L2 Support",
        skillLevel: "Basic",
        percentAllocated: 12,
        isTerminated: false,
      },
    ]
  }

  private getInitialResourceGaps(): ResourceGap[] {
    return [
      {
        id: "gap1",
        role: "L3 Support",
        skillLevel: "Expert",
        requiredCount: 1,
        currentCount: 0,
        priority: "High",
        status: "Open",
      },
      {
        id: "gap2",
        role: "Database Administrator",
        skillLevel: "Advanced",
        requiredCount: 1,
        currentCount: 0,
        priority: "Medium",
        status: "In Progress",
      },
    ]
  }

  // State getters
  getState(): ResourceAlignmentState {
    return { ...this.state }
  }

  getCurrentSection(): number {
    return this.state.currentSection
  }

  getIsEditMode(): boolean {
    return this.state.isEditMode
  }

  getHasUnsavedChanges(): boolean {
    return this.state.hasUnsavedChanges
  }

  getValidationErrors(): Record<string, string> {
    return { ...this.state.validationErrors }
  }

  getSearchQuery(): string {
    return this.state.searchQuery
  }

  getFilterSkillLevel(): string | null {
    return this.state.filterSkillLevel
  }

  getFilterLOB(): string | null {
    return this.state.filterLOB
  }

  getSummaryMetrics(): SummaryMetrics {
    return { ...this.state.summaryMetrics }
  }

  getResources(): Resource[] {
    return [...this.state.resources]
  }

  getResourceGaps(): ResourceGap[] {
    return [...this.state.resourceGaps]
  }

  // Business logic methods
  getFilteredResources(filters: ResourceFilters): Resource[] {
    return this.state.resources.filter((resource) => {
      const matchesSearch =
        filters.searchQuery === "" ||
        resource.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        resource.role.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        resource.lob.toLowerCase().includes(filters.searchQuery.toLowerCase())

      const matchesSkillLevel = filters.skillLevel === null || resource.skillLevel === filters.skillLevel

      const matchesLOB =
        filters.lob === null || resource.lob.includes(filters.lob) || resource.lobDetail.includes(filters.lob)

      return matchesSearch && matchesSkillLevel && matchesLOB
    })
  }

  getUniqueLOBs(): string[] {
    return Array.from(new Set(this.state.resources.map((r) => r.lob.split(" ")[0])))
  }

  getActiveResources(): Resource[] {
    return this.state.resources.filter((r) => !r.isTerminated)
  }

  getTerminatedResources(): Resource[] {
    return this.state.resources.filter((r) => r.isTerminated)
  }

  getResourcesBySkillLevel(skillLevel: string): Resource[] {
    return this.getActiveResources().filter((r) => r.skillLevel === skillLevel)
  }

  getResourcesByLOB(lob: string): Resource[] {
    return this.getActiveResources().filter((r) => r.lob.includes(lob))
  }

  getTotalHeadcount(): number {
    return this.getActiveResources().reduce((sum, r) => sum + r.percentAllocated / 100, 0)
  }

  validateResourceAllocation(resourceId: string, allocation: number): ValidationResult {
    const errors: Record<string, string> = {}

    if (allocation > 100) {
      errors[`allocation-${resourceId}`] = "Allocation cannot exceed 100%"
    }

    if (allocation < 0) {
      errors[`allocation-${resourceId}`] = "Allocation cannot be negative"
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  validateAllResources(): ValidationResult {
    const errors: Record<string, string> = {}

    this.state.resources.forEach((resource) => {
      const validation = this.validateResourceAllocation(resource.id, resource.percentAllocated)
      Object.assign(errors, validation.errors)
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  calculateProgress(): number {
    const totalSections = 3 // Resource Overview, Resource Details, Resource Gaps
    return ((this.state.currentSection + 1) / totalSections) * 100
  }

  // State update methods
  setCurrentSection(section: number): void {
    this.state.currentSection = section
  }

  setEditMode(isEditMode: boolean): void {
    this.state.isEditMode = isEditMode
    if (!isEditMode) {
      this.state.hasUnsavedChanges = false
      this.state.validationErrors = {}
    }
  }

  setHasUnsavedChanges(hasChanges: boolean): void {
    this.state.hasUnsavedChanges = hasChanges
  }

  setValidationErrors(errors: Record<string, string>): void {
    this.state.validationErrors = { ...errors }
  }

  setSearchQuery(query: string): void {
    this.state.searchQuery = query
  }

  setFilterSkillLevel(skillLevel: string | null): void {
    this.state.filterSkillLevel = skillLevel
  }

  setFilterLOB(lob: string | null): void {
    this.state.filterLOB = lob
  }

  updateResourceAllocation(resourceId: string, allocation: number): void {
    const resourceIndex = this.state.resources.findIndex((r) => r.id === resourceId)
    if (resourceIndex !== -1) {
      this.state.resources[resourceIndex].percentAllocated = allocation
      this.state.hasUnsavedChanges = true
    }
  }

  toggleResourceTermination(resourceId: string): void {
    const resourceIndex = this.state.resources.findIndex((r) => r.id === resourceId)
    if (resourceIndex !== -1) {
      this.state.resources[resourceIndex].isTerminated = !this.state.resources[resourceIndex].isTerminated
      this.state.hasUnsavedChanges = true
    }
  }

  updateSummaryMetrics(): void {
    const activeResources = this.getActiveResources()
    const totalHeadcount = this.getTotalHeadcount()

    this.state.summaryMetrics = {
      ...this.state.summaryMetrics,
      totalResourcesAllocated: activeResources.length,
      headcountConversion: Number.parseFloat(totalHeadcount.toFixed(2)),
    }
  }

  saveChanges(): boolean {
    const validation = this.validateAllResources()

    if (!validation.isValid) {
      this.setValidationErrors(validation.errors)
      return false
    }

    this.updateSummaryMetrics()
    this.setEditMode(false)
    this.setValidationErrors({})

    return true
  }

  resetState(): void {
    this.state = this.getInitialState()
  }
}
