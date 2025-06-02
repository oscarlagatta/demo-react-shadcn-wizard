// Presenter: Coordination Logic and Event Handlers
import type { ResourceAlignmentModel } from "./model"
import type { ResourceAlignmentView } from "./view"

export class ResourceAlignmentPresenter {
  private model: ResourceAlignmentModel
  private view: ResourceAlignmentView | null = null

  constructor(model: ResourceAlignmentModel) {
    this.model = model
  }

  setView(view: ResourceAlignmentView): void {
    this.view = view
  }

  // Navigation handlers
  handleNext = (): void => {
    const currentSection = this.model.getCurrentSection()
    if (currentSection < 2) {
      // 0, 1, 2 sections
      this.model.setCurrentSection(currentSection + 1)
      this.updateView()
    }
  }

  handlePrevious = (): void => {
    const currentSection = this.model.getCurrentSection()
    if (currentSection > 0) {
      this.model.setCurrentSection(currentSection - 1)
      this.updateView()
    }
  }

  handleSectionClick = (sectionIndex: number): void => {
    this.model.setCurrentSection(sectionIndex)
    this.updateView()
  }

  // Edit mode handlers
  handleEditToggle = (): void => {
    const isEditMode = this.model.getIsEditMode()
    const hasUnsavedChanges = this.model.getHasUnsavedChanges()

    if (isEditMode && hasUnsavedChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
      if (!confirmDiscard) return
    }

    this.model.setEditMode(!isEditMode)
    this.updateView()
  }

  handleSave = (): void => {
    const success = this.model.saveChanges()

    if (success) {
      // Show success message (in real app, this would be a toast notification)
      alert("Resource alignment saved successfully!")
    }

    this.updateView()
  }

  // Filter handlers
  handleSearchChange = (query: string): void => {
    this.model.setSearchQuery(query)
    this.updateView()
  }

  handleSkillLevelFilter = (skillLevel: string | null): void => {
    this.model.setFilterSkillLevel(skillLevel)
    this.updateView()
  }

  handleLOBFilter = (lob: string | null): void => {
    this.model.setFilterLOB(lob)
    this.updateView()
  }

  // Resource management handlers
  handleAllocationChange = (resourceId: string, allocation: number): void => {
    this.model.updateResourceAllocation(resourceId, allocation)

    // Validate the specific resource
    const validation = this.model.validateResourceAllocation(resourceId, allocation)
    if (!validation.isValid) {
      this.model.setValidationErrors(validation.errors)
    } else {
      // Clear validation errors for this resource if valid
      const currentErrors = this.model.getValidationErrors()
      delete currentErrors[`allocation-${resourceId}`]
      this.model.setValidationErrors(currentErrors)
    }

    this.updateView()
  }

  handleTerminationToggle = (resourceId: string): void => {
    this.model.toggleResourceTermination(resourceId)
    this.updateView()
  }

  // Export handlers
  handleDownloadCapabilityMatrix = (): void => {
    alert("Downloading Capability Matrix...")
    // In a real implementation, this would trigger a file download
  }

  handleExportResource = (): void => {
    alert("Exporting Resource Data...")
    // In a real implementation, this would trigger a file download
  }

  // View update
  private updateView(): void {
    if (this.view) {
      this.view.render()
    }
  }

  // Get current state for view
  getCurrentState() {
    return {
      ...this.model.getState(),
      filteredResources: this.model.getFilteredResources({
        searchQuery: this.model.getSearchQuery(),
        skillLevel: this.model.getFilterSkillLevel(),
        lob: this.model.getFilterLOB(),
      }),
      uniqueLOBs: this.model.getUniqueLOBs(),
      activeResources: this.model.getActiveResources(),
      terminatedResources: this.model.getTerminatedResources(),
      progress: this.model.calculateProgress(),
    }
  }

  // Initialize presenter
  initialize(): void {
    this.updateView()
  }
}
