"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Edit,
  Save,
  X,
  Eye,
  Plus,
  Download,
  FileOutputIcon as FileExport,
  Users,
  UserCheck,
  UserX,
  Filter,
  Search,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { CapabilityMatrixModal } from "@/components/capability-matrix-modal"
import type { CapabilityMatrixForm } from "@/lib/schemas"

// Configuration sections
const configurationSections = [
  {
    id: "resource-overview",
    title: "Resource Overview",
    description: "Summary of resource allocation",
    icon: Users,
    color: "blue",
  },
  {
    id: "resource-details",
    title: "Resource Details",
    description: "Individual resource assignments",
    icon: UserCheck,
    color: "green",
  },
  {
    id: "resource-gaps",
    title: "Resource Gaps",
    description: "Identify resource shortfalls",
    icon: UserX,
    color: "red",
  },
]

interface Resource {
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

export default function ResourceAlignmentPage() {
  // Panel state
  const [currentSection, setCurrentSection] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSkillLevel, setFilterSkillLevel] = useState<string | null>(null)
  const [filterLOB, setFilterLOB] = useState<string | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [showCapabilityMatrix, setShowCapabilityMatrix] = useState(false)

  // Calculate progress through sections
  const progress = ((currentSection + 1) / configurationSections.length) * 100

  // Summary metrics
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalResourcesAllocated: 13,
    headcountConversion: 1.97,
    applicationHeadcountRequirement: 1,
    resourceAlignedNotInBPS: 2,
  })

  // Resource data
  const [resources, setResources] = useState<Resource[]>([
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
  ])

  // Resource gaps data
  const [resourceGaps, setResourceGaps] = useState([
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
  ])

  // Filter resources based on search and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.lob.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSkillLevel = filterSkillLevel === null || resource.skillLevel === filterSkillLevel

    const matchesLOB = filterLOB === null || resource.lob.includes(filterLOB) || resource.lobDetail.includes(filterLOB)

    return matchesSearch && matchesSkillLevel && matchesLOB
  })

  // Get unique LOBs for filtering
  const uniqueLOBs = Array.from(new Set(resources.map((r) => r.lob.split(" ")[0])))

  // Handle resource allocation change
  const handleAllocationChange = (id: string, value: number) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === id
          ? {
              ...resource,
              percentAllocated: value,
            }
          : resource,
      ),
    )
    setHasUnsavedChanges(true)
  }

  // Handle resource termination toggle
  const handleTerminationToggle = (id: string) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === id
          ? {
              ...resource,
              isTerminated: !resource.isTerminated,
            }
          : resource,
      ),
    )
    setHasUnsavedChanges(true)
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentSection < configurationSections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSectionClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  // Edit mode handlers
  const handleEditToggle = () => {
    if (isEditMode && hasUnsavedChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
      if (!confirmDiscard) return
    }
    setIsEditMode(!isEditMode)
    setHasUnsavedChanges(false)
    setValidationErrors({})
  }

  const handleSave = () => {
    // Validate all fields before saving
    const errors: Record<string, string> = {}

    // Check if any resource has allocation > 100%
    resources.forEach((resource) => {
      if (resource.percentAllocated > 100) {
        errors[`allocation-${resource.id}`] = "Allocation cannot exceed 100%"
      }
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    // Save logic here
    setIsEditMode(false)
    setHasUnsavedChanges(false)
    setValidationErrors({})

    // Update summary metrics based on current data
    const activeResources = resources.filter((r) => !r.isTerminated)
    const totalHeadcount = activeResources.reduce((sum, r) => sum + r.percentAllocated / 100, 0)

    setSummaryMetrics({
      ...summaryMetrics,
      totalResourcesAllocated: activeResources.length,
      headcountConversion: Number.parseFloat(totalHeadcount.toFixed(2)),
    })

    // Show success message (in real app, this would be a toast notification)
    alert("Resource alignment saved successfully!")
  }

  // Handle user selection
  const handleUserSelection = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)))
  }

  // Handle select all users
  const handleSelectAllUsers = (checked: boolean) => {
    setSelectedUserIds(checked ? filteredResources.map((r) => r.id) : [])
  }

  // Handle capability matrix save
  const handleCapabilityMatrixSave = async (data: CapabilityMatrixForm) => {
    // In real app, this would call an API
    console.log("Saving capability matrix:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset selection
    setSelectedUserIds([])
    setShowCapabilityMatrix(false)
  }

  // Tooltip component
  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1 flex-shrink-0" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  // Handle download capability matrix
  const handleDownloadCapabilityMatrix = () => {
    alert("Downloading Capability Matrix...")
    // In a real implementation, this would trigger a file download
  }

  // Handle export resource
  const handleExportResource = () => {
    alert("Exporting Resource Data...")
    // In a real implementation, this would trigger a file download
  }

  // Section renderers
  const renderResourceOverview = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Resource Overview
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Summary of resource allocation and headcount metrics
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Total Resources Allocated</span>
              <span className="text-2xl lg:text-3xl font-semibold text-blue-700">
                {summaryMetrics.totalResourcesAllocated}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Headcount Conversion</span>
              <span className="text-2xl lg:text-3xl font-semibold text-green-700">
                {summaryMetrics.headcountConversion}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Application Headcount Requirement</span>
              <span className="text-2xl lg:text-3xl font-semibold text-purple-700">
                {summaryMetrics.applicationHeadcountRequirement}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Resource Aligned Not in BPS</span>
              <span className="text-2xl lg:text-3xl font-semibold text-orange-700">
                {summaryMetrics.resourceAlignedNotInBPS}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Distribution */}
      <Card className="shadow-sm">
        <CardContent className="p-4 lg:p-6">
          <h4 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Resource Distribution by LOB</h4>
          <div className="space-y-4">
            {uniqueLOBs.map((lob) => {
              const lobResources = resources.filter((r) => r.lob.includes(lob) && !r.isTerminated)
              const percentage = (lobResources.length / resources.filter((r) => !r.isTerminated).length) * 100

              return (
                <div key={lob} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{lob}</span>
                    <span className="font-medium">
                      {lobResources.length} resources ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Skill Level Distribution */}
      <Card className="shadow-sm">
        <CardContent className="p-4 lg:p-6">
          <h4 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Resource Distribution by Skill Level</h4>
          <div className="space-y-4">
            {["Basic", "Advanced", "Expert"].map((skill) => {
              const skillResources = resources.filter((r) => r.skillLevel === skill && !r.isTerminated)
              const percentage = (skillResources.length / resources.filter((r) => !r.isTerminated).length) * 100

              return (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{skill}</span>
                    <span className="font-medium">
                      {skillResources.length} resources ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      "h-2",
                      skill === "Basic" && "bg-blue-100 [&>div]:bg-blue-500",
                      skill === "Advanced" && "bg-green-100 [&>div]:bg-green-500",
                      skill === "Expert" && "bg-purple-100 [&>div]:bg-purple-500",
                    )}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Terminated Resources */}
      <Card className="shadow-sm border-red-200">
        <CardContent className="p-4 lg:p-6">
          <h4 className="text-base lg:text-lg font-medium text-red-700 mb-4">Terminated Resources</h4>
          {resources.filter((r) => r.isTerminated).length > 0 ? (
            <div className="space-y-4">
              {resources
                .filter((r) => r.isTerminated)
                .map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-3 relative">
                        <img
                          src={resource.profileImage || "/placeholder.svg"}
                          alt={resource.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-red-500 bg-opacity-30"></div>
                      </div>
                      <div>
                        <p className="font-medium text-red-800">{resource.name}</p>
                        <p className="text-xs text-red-600">{resource.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">
                      Terminated
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No terminated resources</p>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderResourceDetails = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <UserCheck className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Resource Details
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Manage individual resource assignments and allocations
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Skill Level</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterSkillLevel(null)}>All Levels</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterSkillLevel("Basic")}>Basic</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterSkillLevel("Advanced")}>Advanced</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterSkillLevel("Expert")}>Expert</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>LOB</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterLOB(null)}>All LOBs</DropdownMenuItem>
              {uniqueLOBs.map((lob) => (
                <DropdownMenuItem key={lob} onClick={() => setFilterLOB(lob)}>
                  {lob}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Capability Matrix Management */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedUserIds.length === filteredResources.length && filteredResources.length > 0}
            onCheckedChange={handleSelectAllUsers}
          />
          <span className="text-sm text-gray-600">
            {selectedUserIds.length > 0 ? `${selectedUserIds.length} selected` : "Select all"}
          </span>
        </div>

        <Button
          onClick={() => setShowCapabilityMatrix(true)}
          disabled={selectedUserIds.length === 0}
          className="flex items-center space-x-2"
          variant="default"
        >
          <Users className="h-4 w-4 mr-1" />
          <span>Manage Capabilities</span>
        </Button>
      </div>

      {/* Resources Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedUserIds.length === filteredResources.length && filteredResources.length > 0}
                      onCheckedChange={handleSelectAllUsers}
                    />
                  </TableHead>
                  <TableHead className="w-[25%]">Name</TableHead>
                  <TableHead className="w-[25%]">LOB</TableHead>
                  <TableHead className="w-[15%]">Role</TableHead>
                  <TableHead className="w-[10%]">Skill Level</TableHead>
                  <TableHead className="w-[15%]">% Allocated</TableHead>
                  <TableHead className="w-[10%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <TableRow
                      key={resource.id}
                      className={cn("hover:bg-gray-50", resource.isTerminated && "bg-red-50")}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedUserIds.includes(resource.id)}
                          onCheckedChange={(checked) => handleUserSelection(resource.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 relative">
                            <img
                              src={resource.profileImage || "/placeholder.svg"}
                              alt={resource.name}
                              className="w-full h-full object-cover"
                            />
                            {resource.isTerminated && <div className="absolute inset-0 bg-red-500 bg-opacity-30"></div>}
                          </div>
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-xs text-gray-500">Manager: {resource.manager}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{resource.lob}</p>
                          <p className="text-xs text-gray-500">{resource.lobDetail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{resource.role}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            resource.skillLevel === "Basic" && "bg-blue-100 text-blue-800",
                            resource.skillLevel === "Advanced" && "bg-green-100 text-green-800",
                            resource.skillLevel === "Expert" && "bg-purple-100 text-purple-800",
                          )}
                        >
                          {resource.skillLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <div className="flex items-center">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={resource.percentAllocated}
                              onChange={(e) =>
                                handleAllocationChange(resource.id, Number.parseInt(e.target.value) || 0)
                              }
                              disabled={resource.isTerminated}
                              className={cn(
                                "h-8 w-16 text-sm",
                                validationErrors[`allocation-${resource.id}`] && "border-red-300",
                              )}
                            />
                            <span className="ml-2">%</span>
                          </div>
                        ) : (
                          <span>{resource.percentAllocated}%</span>
                        )}
                        {validationErrors[`allocation-${resource.id}`] && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors[`allocation-${resource.id}`]}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {isEditMode && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleTerminationToggle(resource.id)}
                                  className={resource.isTerminated ? "text-green-600" : "text-red-600"}
                                >
                                  {resource.isTerminated ? "Reinstate Resource" : "Mark as Terminated"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>Change Skill Level</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No resources found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-green-800 font-semibold mb-3 text-sm lg:text-base">Resource Details Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-green-700">Active Resources:</span>{" "}
            <span className="text-green-600">{resources.filter((r) => !r.isTerminated).length}</span>
          </div>
          <div>
            <span className="font-medium text-green-700">Terminated Resources:</span>{" "}
            <span className="text-green-600">{resources.filter((r) => r.isTerminated).length}</span>
          </div>
          <div>
            <span className="font-medium text-green-700">Total Allocation:</span>{" "}
            <span className="text-green-600">
              {resources
                .filter((r) => !r.isTerminated)
                .reduce((sum, r) => sum + r.percentAllocated / 100, 0)
                .toFixed(2)}{" "}
              FTE
            </span>
          </div>
          <div>
            <span className="font-medium text-green-700">Last Updated:</span>{" "}
            <span className="text-green-600">Oct 30, 2024, 2:36:48 PM</span>
          </div>
        </div>
      </div>

      {/* Capability Matrix Modal */}
      <CapabilityMatrixModal
        isOpen={showCapabilityMatrix}
        onClose={() => setShowCapabilityMatrix(false)}
        selectedUsers={resources.filter((r) => selectedUserIds.includes(r.id)).map((r) => ({ id: r.id, name: r.name }))}
        onSave={handleCapabilityMatrixSave}
      />
    </div>
  )

  const renderResourceGaps = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:w-16 xl:w-20 xl:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <UserX className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-red-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">Resource Gaps</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Identify and manage resource shortfalls and requirements
        </p>
      </div>

      {/* Resource Gaps Table */}
      <Card className="shadow-sm">
        <CardContent className="p-4 lg:p-6">
          <h4 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Current Resource Gaps</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Role</TableHead>
                <TableHead>Skill Level</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Gap</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                {isEditMode && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceGaps.map((gap) => (
                <TableRow key={gap.id}>
                  <TableCell className="font-medium">{gap.role}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        gap.skillLevel === "Basic" && "bg-blue-100 text-blue-800",
                        gap.skillLevel === "Advanced" && "bg-green-100 text-green-800",
                        gap.skillLevel === "Expert" && "bg-purple-100 text-purple-800",
                      )}
                    >
                      {gap.skillLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{gap.requiredCount}</TableCell>
                  <TableCell>{gap.currentCount}</TableCell>
                  <TableCell className="text-red-600 font-medium">{gap.requiredCount - gap.currentCount}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        gap.priority === "High" && "bg-red-100 text-red-800",
                        gap.priority === "Medium" && "bg-orange-100 text-orange-800",
                        gap.priority === "Low" && "bg-yellow-100 text-yellow-800",
                      )}
                    >
                      {gap.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        gap.status === "Open" && "bg-blue-100 text-blue-800",
                        gap.status === "In Progress" && "bg-purple-100 text-purple-800",
                        gap.status === "Filled" && "bg-green-100 text-green-800",
                      )}
                    >
                      {gap.status}
                    </Badge>
                  </TableCell>
                  {isEditMode && (
                    <TableCell>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Update Status
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isEditMode && (
            <div className="mt-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>Add Resource Gap</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resource Requirements */}
      <Card className="shadow-sm">
        <CardContent className="p-4 lg:p-6">
          <h4 className="text-base lg:text-lg font-medium text-gray-900 mb-4">Resource Requirements Analysis</h4>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-3">Current Headcount vs. Required</h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Headcount</span>
                    <span className="font-medium">{summaryMetrics.headcountConversion} FTE</span>
                  </div>
                  <Progress
                    value={
                      (summaryMetrics.headcountConversion / (summaryMetrics.applicationHeadcountRequirement + 1)) * 100
                    }
                    className="h-3 bg-blue-100 [&>div]:bg-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Required Headcount</span>
                    <span className="font-medium">{summaryMetrics.applicationHeadcountRequirement + 1} FTE</span>
                  </div>
                  <Progress value={100} className="h-3 bg-gray-100 [&>div]:bg-gray-300" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <h5 className="font-medium text-red-800 mb-3">Critical Skill Gaps</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span>Missing L3 Support with Expert skill level</span>
                </li>
                <li className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span>Insufficient Database Administration coverage</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="text-red-800 font-semibold mb-3 text-sm lg:text-base">Resource Gaps Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-red-700">Total Gaps:</span>{" "}
            <span className="text-red-600">{resourceGaps.length}</span>
          </div>
          <div>
            <span className="font-medium text-red-700">High Priority Gaps:</span>{" "}
            <span className="text-red-600">{resourceGaps.filter((g) => g.priority === "High").length}</span>
          </div>
          <div>
            <span className="font-medium text-red-700">Open Status:</span>{" "}
            <span className="text-red-600">{resourceGaps.filter((g) => g.status === "Open").length}</span>
          </div>
          <div>
            <span className="font-medium text-red-700">Last Updated:</span>{" "}
            <span className="text-red-600">Oct 30, 2024, 2:36:48 PM</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderResourceOverview()
      case 1:
        return renderResourceDetails()
      case 2:
        return renderResourceGaps()
      default:
        return renderResourceOverview()
    }
  }

  return (
    <div className="w-full">
      {/* Ultra-wide responsive container */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto p-4 lg:p-6 xl:p-8">
        {/* Panel Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Resource Alignment</h2>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs lg:text-sm",
                    isEditMode ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800",
                  )}
                >
                  {isEditMode ? "Edit Mode" : "View Mode"}
                </Badge>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Manage resource allocation and identify resource gaps
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">
                Section {currentSection + 1} of {configurationSections.length}
              </span>
              <div className="w-full sm:w-32 lg:w-48">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
            {!isEditMode ? (
              <Button onClick={handleEditToggle} className="flex items-center space-x-2 h-9 lg:h-10">
                <Edit className="h-4 w-4" />
                <span>Edit Configuration</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="flex items-center space-x-2 h-9 lg:h-10 bg-green-600 hover:bg-green-700"
                  disabled={!hasUnsavedChanges || Object.keys(validationErrors).length > 0}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  className="flex items-center space-x-2 h-9 lg:h-10"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}
            <Button variant="outline" className="flex items-center space-x-2 h-9 lg:h-10">
              <Eye className="h-4 w-4" />
              <span>View History</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 h-9 lg:h-10 ml-auto"
              onClick={handleDownloadCapabilityMatrix}
            >
              <Download className="h-4 w-4" />
              <span>Download Capability Matrix</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 h-9 lg:h-10"
              onClick={handleExportResource}
            >
              <FileExport className="h-4 w-4" />
              <span>Export Resource</span>
            </Button>
          </div>

          {/* Validation Errors Alert */}
          {Object.keys(validationErrors).length > 0 && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Please correct the validation errors before saving.
              </AlertDescription>
            </Alert>
          )}

          {/* Section Navigator */}
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-max lg:min-w-0 lg:justify-center xl:justify-between gap-2 lg:gap-4">
              {configurationSections.map((section, index) => {
                const Icon = section.icon
                const isActive = index === currentSection

                return (
                  <div key={section.id} className="flex items-center">
                    <button
                      onClick={() => handleSectionClick(index)}
                      className={cn(
                        "flex flex-col items-center space-y-1 lg:space-y-2 p-2 lg:p-3 rounded-lg transition-all duration-200 min-w-[80px] lg:min-w-[120px]",
                        isActive && "bg-blue-50 border-2 border-blue-200",
                        !isActive && "hover:bg-gray-50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-all duration-200",
                          isActive && "bg-blue-500 text-white",
                          !isActive && "bg-gray-200 text-gray-600",
                        )}
                      >
                        <Icon className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            "text-xs lg:text-sm xl:text-base font-medium",
                            isActive && "text-blue-700",
                            !isActive && "text-gray-600",
                          )}
                        >
                          {section.title}
                        </div>
                        <div className="text-xs text-gray-500 hidden lg:block">{section.description}</div>
                      </div>
                    </button>
                    {index < configurationSections.length - 1 && (
                      <div className="w-4 lg:w-8 xl:w-12 h-px bg-gray-300 mx-1 lg:mx-2" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-10">{renderCurrentSection()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 lg:mt-8 gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className="flex items-center space-x-2 h-9 lg:h-10 xl:h-11 w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Section</span>
          </Button>

          <div className="flex items-center space-x-2">
            {configurationSections.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-200",
                  index === currentSection && "bg-blue-500",
                  index !== currentSection && "bg-gray-300",
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentSection === configurationSections.length - 1}
            className="flex items-center space-x-2 h-9 lg:h-10 xl:h-11 w-full sm:w-auto"
          >
            <span>Next Section</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-yellow-800 text-sm">
                You have unsaved changes. Remember to save before leaving.
              </span>
            </div>
          </div>
        )}

        {/* Data Source Note */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          People data is sourced from BPR and metadata managed in the BPS Portal
        </div>
      </div>
    </div>
  )
}
