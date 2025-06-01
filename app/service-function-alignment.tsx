"use client"

import { Progress } from "@/components/ui/progress"

import { useState, useEffect } from "react"
import {
  Info,
  Edit,
  Save,
  X,
  Eye,
  Plus,
  Trash2,
  FileText,
  Layers,
  Settings,
  Briefcase,
  Server,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Configuration sections
const configurationSections = [
  {
    id: "critical-service",
    title: "Critical Service",
    description: "Define critical services for this application",
    icon: Settings,
    color: "red",
  },
  {
    id: "app-functions",
    title: "App Functions",
    description: "Assign application functions by organization",
    icon: Briefcase,
    color: "blue",
  },
  {
    id: "enablers",
    title: "Enablers",
    description: "Configure service enablers and functional groups",
    icon: Layers,
    color: "green",
  },
  {
    id: "capability-mapping",
    title: "Capability Mapping",
    description: "Map application capabilities across levels",
    icon: FileText,
    color: "purple",
  },
  {
    id: "business-process",
    title: "Business Process",
    description: "Define business processes and workflows",
    icon: Server,
    color: "orange",
  },
]

export default function ServiceFunctionAlignment() {
  // Panel state
  const [currentSection, setCurrentSection] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "critical-service": true,
    "app-functions": true,
    enablers: false,
    "capability-mapping": false,
    "business-process": false,
  })

  // Pagination states
  const [enablersPagination, setEnablersPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalPages: 1,
  })

  const [capabilityPagination, setCapabilityPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalPages: 1,
  })

  const [businessPagination, setBusinessPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalPages: 1,
  })

  // Mock data for Critical Services
  const [criticalServices, setCriticalServices] = useState([
    { id: 1, service: "Account Analysis", isCritical: true },
    { id: 2, service: "Transaction Processing", isCritical: true },
    { id: 3, service: "Reporting", isCritical: false },
    { id: 4, service: "Data Transformation", isCritical: true },
    { id: 5, service: "Client Billing", isCritical: true },
  ])

  // Mock data for App Functions
  const [appFunctions, setAppFunctions] = useState([
    {
      id: 1,
      organization: "Global Banking",
      functions: ["Account Management", "Transaction Processing", "Reporting"],
    },
    {
      id: 2,
      organization: "Treasury Services",
      functions: ["Client Billing", "Account Analysis", "Liquidity Management"],
    },
    {
      id: 3,
      organization: "Operations",
      functions: ["Data Transformation", "Process Automation"],
    },
  ])

  // Mock data for Enablers
  const [enablers, setEnablers] = useState([
    {
      id: 1,
      serviceLevel2: "Business Management",
      serviceLevel3: "Business Control and Governance Execution",
      lob: "Global Banking",
      businessName: "Global Corporate Banking",
      functionalGroup: "Operation - Other - TFSO - Data Transformation Management",
      functionalGroupType: "TFSO - Data Transformation Management",
      critical: true,
    },
    {
      id: 2,
      serviceLevel2: "Servicing",
      serviceLevel3: "Account Servicing",
      lob: "Global Banking",
      businessName: "Global Corporate Banking",
      functionalGroup: "Operation - Critical - TFSO - Deposit Account Analysis Servicing",
      functionalGroupType: "Treasury Fulfillment Service and Operations",
      critical: true,
    },
    {
      id: 3,
      serviceLevel2: "Servicing",
      serviceLevel3: "Account Servicing",
      lob: "Global Banking",
      businessName: "Business Banking",
      functionalGroup: "Operation - Critical - TFSO - Deposit Account Analysis Servicing",
      functionalGroupType: "Treasury Fulfillment Service and Operations",
      critical: true,
    },
  ])

  // Mock data for Capability Mapping
  const [capabilityMapping, setCapabilityMapping] = useState([
    {
      id: 1,
      lob: "GBAM",
      domain: "Banking",
      function: "Banking & Transaction Services",
      platform: "Account Services",
    },
  ])

  // Mock data for Business Process
  const [businessProcesses, setBusinessProcesses] = useState([
    {
      id: 1,
      erh: "Treasury Fulfillment, Service and Ops",
      businessProcessName: "Perform Client Billing (EMEA)",
      epcfLevel1ClassName: "Manage and Process Transactions; Manage Account Operations and Maintenance",
    },
    {
      id: 2,
      erh: "Treasury Fulfillment, Service and Ops",
      businessProcessName: "Perform Account Maintenance (Operations)",
      epcfLevel1ClassName: "Manage and Process Transactions; Manage Account Operations and Maintenance",
    },
    {
      id: 3,
      erh: "Treasury Fulfillment, Service and Ops",
      businessProcessName: "Perform Client Billing (Operations)",
      epcfLevel1ClassName:
        "Manage and Process Transactions; Manage Customer and Client Relationships; Manage Account Operations and Maintenance",
    },
  ])

  // Function to determine items per page based on screen size
  const useResponsiveItemsPerPage = () => {
    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth
        let enablersPerPage = 5
        let capabilityPerPage = 5
        let businessPerPage = 5

        if (width >= 1536) {
          // 2xl
          enablersPerPage = 8
          capabilityPerPage = 8
          businessPerPage = 8
        } else if (width >= 1280) {
          // xl
          enablersPerPage = 7
          capabilityPerPage = 7
          businessPerPage = 7
        } else if (width >= 1024) {
          // lg
          enablersPerPage = 6
          capabilityPerPage = 6
          businessPerPage = 6
        }

        setEnablersPagination((prev) => ({
          ...prev,
          itemsPerPage: enablersPerPage,
          totalPages: Math.ceil(enablers.length / enablersPerPage),
        }))

        setCapabilityPagination((prev) => ({
          ...prev,
          itemsPerPage: capabilityPerPage,
          totalPages: Math.ceil(capabilityMapping.length / capabilityPerPage),
        }))

        setBusinessPagination((prev) => ({
          ...prev,
          itemsPerPage: businessPerPage,
          totalPages: Math.ceil(businessProcesses.length / businessPerPage),
        }))
      }

      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [enablers.length, capabilityMapping.length, businessProcesses.length])
  }

  // Call the hook
  useResponsiveItemsPerPage()

  // Update pagination when data changes
  useEffect(() => {
    setEnablersPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(enablers.length / prev.itemsPerPage),
      currentPage: Math.min(prev.currentPage, Math.ceil(enablers.length / prev.itemsPerPage) || 1),
    }))

    setCapabilityPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(capabilityMapping.length / prev.itemsPerPage),
      currentPage: Math.min(prev.currentPage, Math.ceil(capabilityMapping.length / prev.itemsPerPage) || 1),
    }))

    setBusinessPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(businessProcesses.length / prev.itemsPerPage),
      currentPage: Math.min(prev.currentPage, Math.ceil(businessProcesses.length / prev.itemsPerPage) || 1),
    }))
  }, [enablers.length, capabilityMapping.length, businessProcesses.length])

  // Add more mock data for Enablers to demonstrate pagination
  useEffect(() => {
    if (enablers.length <= 3) {
      const additionalEnablers = [
        {
          id: 4,
          serviceLevel2: "Transaction Initiation",
          serviceLevel3: "Payments",
          lob: "Global Banking",
          businessName: "Global Commercial Banking",
          functionalGroup: "Operation - Critical - TFSO - Payment Processing",
          functionalGroupType: "Treasury Fulfillment Service and Operations",
          critical: true,
        },
        {
          id: 5,
          serviceLevel2: "Client Treasury Services",
          serviceLevel3: "Client Liquidity Management",
          lob: "Global Banking",
          businessName: "Global Corporate Banking",
          functionalGroup: "Operation - Other - TFSO - Liquidity Management",
          functionalGroupType: "Treasury Fulfillment Service and Operations",
          critical: false,
        },
        {
          id: 6,
          serviceLevel2: "Servicing",
          serviceLevel3: "Account Servicing",
          lob: "Global Banking",
          businessName: "Global Commercial Banking",
          functionalGroup: "Operation - Critical - TFSO - Account Analysis",
          functionalGroupType: "Treasury Fulfillment Service and Operations",
          critical: true,
        },
        {
          id: 7,
          serviceLevel2: "Business Management",
          serviceLevel3: "Business Control and Governance Execution",
          lob: "Global Banking",
          businessName: "Business Banking",
          functionalGroup: "Operation - Other - TFSO - Reporting",
          functionalGroupType: "TFSO - Reporting",
          critical: false,
        },
      ]
      setEnablers([...enablers, ...additionalEnablers])
    }

    // Add more mock data for Capability Mapping
    if (capabilityMapping.length <= 1) {
      const additionalMappings = [
        {
          id: 2,
          lob: "GBAM",
          domain: "Treasury",
          function: "Cash Management",
          platform: "Liquidity Services",
        },
        {
          id: 3,
          lob: "GBAM",
          domain: "Banking",
          function: "Payment Services",
          platform: "Transaction Processing",
        },
        {
          id: 4,
          lob: "GBAM",
          domain: "Treasury",
          function: "Reporting",
          platform: "Analytics Dashboard",
        },
        {
          id: 5,
          lob: "GBAM",
          domain: "Banking",
          function: "Client Services",
          platform: "Client Portal",
        },
        {
          id: 6,
          lob: "GBAM",
          domain: "Treasury",
          function: "Risk Management",
          platform: "Risk Assessment",
        },
      ]
      setCapabilityMapping([...capabilityMapping, ...additionalMappings])
    }

    // Add more mock data for Business Processes
    if (businessProcesses.length <= 3) {
      const additionalProcesses = [
        {
          id: 4,
          erh: "Treasury Fulfillment, Service and Ops",
          businessProcessName: "Perform Client Billing (APAC)",
          epcfLevel1ClassName: "Manage and Process Transactions; Manage Account Operations and Maintenance",
        },
        {
          id: 5,
          erh: "Treasury Fulfillment, Service and Ops",
          businessProcessName: "Perform Account Analysis (Operations)",
          epcfLevel1ClassName: "Manage and Process Transactions; Manage Account Operations and Maintenance",
        },
        {
          id: 6,
          erh: "Treasury Fulfillment, Service and Ops",
          businessProcessName: "Generate Client Reports (Operations)",
          epcfLevel1ClassName: "Manage Customer and Client Relationships; Manage Account Operations and Maintenance",
        },
        {
          id: 7,
          erh: "Treasury Fulfillment, Service and Ops",
          businessProcessName: "Process Client Transactions (Operations)",
          epcfLevel1ClassName: "Manage and Process Transactions",
        },
      ]
      setBusinessProcesses([...businessProcesses, ...additionalProcesses])
    }
  }, [enablers, capabilityMapping, businessProcesses])

  // Calculate progress through sections
  const progress = ((currentSection + 1) / configurationSections.length) * 100

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Form change handlers
  const handleCriticalServiceChange = (id: number, field: string, value: any) => {
    setCriticalServices((prev) => prev.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
    setHasUnsavedChanges(true)
  }

  const handleAppFunctionChange = (id: number, field: string, value: any) => {
    setAppFunctions((prev) => prev.map((func) => (func.id === id ? { ...func, [field]: value } : func)))
    setHasUnsavedChanges(true)
  }

  const handleEnablerChange = (id: number, field: string, value: any) => {
    setEnablers((prev) => prev.map((enabler) => (enabler.id === id ? { ...enabler, [field]: value } : enabler)))
    setHasUnsavedChanges(true)
  }

  const handleCapabilityMappingChange = (id: number, field: string, value: any) => {
    setCapabilityMapping((prev) =>
      prev.map((mapping) => (mapping.id === id ? { ...mapping, [field]: value } : mapping)),
    )
    setHasUnsavedChanges(true)
  }

  const handleBusinessProcessChange = (id: number, field: string, value: any) => {
    setBusinessProcesses((prev) =>
      prev.map((process) => (process.id === id ? { ...process, [field]: value } : process)),
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
      // Show confirmation dialog in real app
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
      if (!confirmDiscard) return
    }
    setIsEditMode(!isEditMode)
    setHasUnsavedChanges(false)
  }

  const handleSave = () => {
    // Save logic here
    setIsEditMode(false)
    setHasUnsavedChanges(false)
    // Show success message
  }

  // Add new item handlers
  const handleAddCriticalService = () => {
    const newId = Math.max(0, ...criticalServices.map((s) => s.id)) + 1
    setCriticalServices([...criticalServices, { id: newId, service: "", isCritical: false }])
    setHasUnsavedChanges(true)
  }

  const handleAddAppFunction = () => {
    const newId = Math.max(0, ...appFunctions.map((f) => f.id)) + 1
    setAppFunctions([...appFunctions, { id: newId, organization: "", functions: [] }])
    setHasUnsavedChanges(true)
  }

  const handleAddEnabler = () => {
    const newId = Math.max(0, ...enablers.map((e) => e.id)) + 1
    setEnablers([
      ...enablers,
      {
        id: newId,
        serviceLevel2: "",
        serviceLevel3: "",
        lob: "",
        businessName: "",
        functionalGroup: "",
        functionalGroupType: "",
        critical: false,
      },
    ])
    setHasUnsavedChanges(true)
  }

  const handleAddCapabilityMapping = () => {
    const newId = Math.max(0, ...capabilityMapping.map((c) => c.id)) + 1
    setCapabilityMapping([...capabilityMapping, { id: newId, lob: "", domain: "", function: "", platform: "" }])
    setHasUnsavedChanges(true)
  }

  const handleAddBusinessProcess = () => {
    const newId = Math.max(0, ...businessProcesses.map((b) => b.id)) + 1
    setBusinessProcesses([
      ...businessProcesses,
      { id: newId, erh: "", businessProcessName: "", epcfLevel1ClassName: "" },
    ])
    setHasUnsavedChanges(true)
  }

  // Delete item handlers
  const handleDeleteCriticalService = (id: number) => {
    setCriticalServices(criticalServices.filter((service) => service.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleDeleteAppFunction = (id: number) => {
    setAppFunctions(appFunctions.filter((func) => func.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleDeleteEnabler = (id: number) => {
    setEnablers(enablers.filter((enabler) => enabler.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleDeleteCapabilityMapping = (id: number) => {
    setCapabilityMapping(capabilityMapping.filter((mapping) => mapping.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleDeleteBusinessProcess = (id: number) => {
    setBusinessProcesses(businessProcesses.filter((process) => process.id !== id))
    setHasUnsavedChanges(true)
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

  // Pagination control component
  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = []
      const maxPagesToShow = 5

      if (totalPages <= maxPagesToShow) {
        // Show all pages if total pages is less than max pages to show
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)

        // Calculate start and end of middle pages
        let startPage = Math.max(2, currentPage - 1)
        let endPage = Math.min(totalPages - 1, currentPage + 1)

        // Adjust if we're near the beginning
        if (currentPage <= 3) {
          endPage = 4
        }

        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
          startPage = totalPages - 3
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
          pages.push("ellipsis-start")
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          pages.push("ellipsis-end")
        }

        // Always show last page
        pages.push(totalPages)
      }

      return pages
    }

    const pageNumbers = getPageNumbers()

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) =>
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                  className={currentPage === page ? "bg-blue-100 border-blue-300" : "cursor-pointer"}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  // Section renderers
  const renderCriticalService = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Settings className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-red-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
          Critical Service
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Define which services are critical for this application
        </p>
      </div>

      {/* Critical Services Table */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center">
            <Settings className="h-5 w-5 mr-2 text-red-600" />
            Service Criticality Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[60%]">Service</TableHead>
                <TableHead className="w-[30%]">Is Critical</TableHead>
                {isEditMode && <TableHead className="w-[10%]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {criticalServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    {isEditMode ? (
                      <Input
                        value={service.service}
                        onChange={(e) => handleCriticalServiceChange(service.id, "service", e.target.value)}
                        className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-red-500")}
                      />
                    ) : (
                      service.service
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Switch
                        checked={service.isCritical}
                        onCheckedChange={(checked) => handleCriticalServiceChange(service.id, "isCritical", checked)}
                        disabled={!isEditMode}
                        className={cn(
                          service.isCritical ? "bg-red-600" : "bg-gray-200",
                          !isEditMode && "opacity-80 cursor-default",
                        )}
                      />
                      <span className="ml-2">
                        {service.isCritical ? (
                          <Badge variant="default" className="bg-red-100 text-red-800 text-xs">
                            Critical
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Non-Critical
                          </Badge>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  {isEditMode && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCriticalService(service.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isEditMode && (
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCriticalService}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="text-red-800 font-semibold mb-3 text-sm lg:text-base">Critical Services Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-red-700">Total Services:</span>{" "}
            <span className="text-red-600">{criticalServices.length}</span>
          </div>
          <div>
            <span className="font-medium text-red-700">Critical Services:</span>{" "}
            <span className="text-red-600">{criticalServices.filter((s) => s.isCritical).length}</span>
          </div>
          <div>
            <span className="font-medium text-red-700">Non-Critical Services:</span>{" "}
            <span className="text-red-600">{criticalServices.filter((s) => !s.isCritical).length}</span>
          </div>
          <div>
            <span className="font-medium text-red-700">Last Updated:</span>{" "}
            <span className="text-red-600">Oct 30, 2024, 2:36:48 PM</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppFunctions = () => (
    <div className="space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8 xl:mb-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
          <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">App Functions</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Assign application functions by organization
        </p>
      </div>

      {/* App Functions Configuration */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
            Function Assignment by Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[40%]">Organization</TableHead>
                <TableHead className="w-[50%]">Functions</TableHead>
                {isEditMode && <TableHead className="w-[10%]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {appFunctions.map((func) => (
                <TableRow key={func.id}>
                  <TableCell>
                    {isEditMode ? (
                      <Select
                        value={func.organization}
                        onValueChange={(value) => handleAppFunctionChange(func.id, "organization", value)}
                      >
                        <SelectTrigger
                          className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-blue-500")}
                        >
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Global Banking">Global Banking</SelectItem>
                          <SelectItem value="Treasury Services">Treasury Services</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Client Services">Client Services</SelectItem>
                          <SelectItem value="Risk Management">Risk Management</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      func.organization
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditMode ? (
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Account Management",
                          "Transaction Processing",
                          "Reporting",
                          "Client Billing",
                          "Account Analysis",
                          "Liquidity Management",
                          "Data Transformation",
                          "Process Automation",
                        ].map((functionName) => (
                          <div key={functionName} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${func.id}-${functionName}`}
                              checked={func.functions.includes(functionName)}
                              onCheckedChange={(checked) => {
                                const newFunctions = checked
                                  ? [...func.functions, functionName]
                                  : func.functions.filter((f) => f !== functionName)
                                handleAppFunctionChange(func.id, "functions", newFunctions)
                              }}
                              className={isEditMode ? "data-[state=checked]:bg-blue-600" : ""}
                            />
                            <Label
                              htmlFor={`${func.id}-${functionName}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {functionName}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {func.functions.map((functionName) => (
                          <Badge key={functionName} variant="outline" className="bg-blue-50">
                            {functionName}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  {isEditMode && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAppFunction(func.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isEditMode && (
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAppFunction}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Organization</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-blue-800 font-semibold mb-3 text-sm lg:text-base">Function Assignment Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 text-xs lg:text-sm">
          <div>
            <span className="font-medium text-blue-700">Total Organizations:</span>{" "}
            <span className="text-blue-600">{appFunctions.length}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Total Functions Assigned:</span>{" "}
            <span className="text-blue-600">
              {appFunctions.reduce((total, func) => total + func.functions.length, 0)}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Last Updated:</span>{" "}
            <span className="text-blue-600">Oct 30, 2024, 2:36:48 PM</span>
          </div>
        </div>

        {/* Organization Breakdown */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h5 className="font-medium text-blue-700 mb-2 text-xs lg:text-sm">Organization Breakdown</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 text-xs lg:text-sm">
            {appFunctions.map((func) => (
              <div key={func.id}>
                <span className="text-blue-600 break-words">
                  {func.organization}: {func.functions.length} functions
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderEnablers = () => {
    // Get paginated data
    const startIndex = (enablersPagination.currentPage - 1) * enablersPagination.itemsPerPage
    const endIndex = startIndex + enablersPagination.itemsPerPage
    const paginatedEnablers = enablers.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
      setEnablersPagination((prev) => ({
        ...prev,
        currentPage: page,
      }))
    }

    return (
      <div className="space-y-6 lg:space-y-8 xl:space-y-10">
        {/* Header Section - Keep existing code */}
        <div className="text-center mb-6 lg:mb-8 xl:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <Layers className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">Enablers</h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Configure service enablers and functional groups
          </p>
        </div>

        {/* Enablers Table */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-green-600" />
                Service Enablers Configuration
              </div>
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, enablers.length)} of {enablers.length} enablers
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[12%]">Service Level 2</TableHead>
                    <TableHead className="w-[15%]">Service Level 3</TableHead>
                    <TableHead className="w-[12%]">LOB</TableHead>
                    <TableHead className="w-[15%]">Business Name</TableHead>
                    <TableHead className="w-[20%]">Functional Group</TableHead>
                    <TableHead className="w-[15%]">Functional Group Type</TableHead>
                    <TableHead className="w-[6%]">Critical</TableHead>
                    {isEditMode && <TableHead className="w-[5%]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEnablers.map((enabler) => (
                    <TableRow key={enabler.id}>
                      {/* Keep existing table cell code */}
                      <TableCell>
                        {isEditMode ? (
                          <Select
                            value={enabler.serviceLevel2}
                            onValueChange={(value) => handleEnablerChange(enabler.id, "serviceLevel2", value)}
                          >
                            <SelectTrigger className={cn("h-9", isEditMode && "focus:ring-2 focus:ring-green-500")}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Business Management">Business Management</SelectItem>
                              <SelectItem value="Servicing">Servicing</SelectItem>
                              <SelectItem value="Transaction Initiation">Transaction Initiation</SelectItem>
                              <SelectItem value="Client Treasury Services">Client Treasury Services</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          enabler.serviceLevel2
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <Select
                            value={enabler.serviceLevel3}
                            onValueChange={(value) => handleEnablerChange(enabler.id, "serviceLevel3", value)}
                          >
                            <SelectTrigger className={cn("h-9", isEditMode && "focus:ring-2 focus:ring-green-500")}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Business Control and Governance Execution">
                                Business Control and Governance Execution
                              </SelectItem>
                              <SelectItem value="Account Servicing">Account Servicing</SelectItem>
                              <SelectItem value="Payments">Payments</SelectItem>
                              <SelectItem value="Client Liquidity Management">Client Liquidity Management</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          enabler.serviceLevel3
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <Select
                            value={enabler.lob}
                            onValueChange={(value) => handleEnablerChange(enabler.id, "lob", value)}
                          >
                            <SelectTrigger className={cn("h-9", isEditMode && "focus:ring-2 focus:ring-green-500")}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Global Banking">Global Banking</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          enabler.lob
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <Select
                            value={enabler.businessName}
                            onValueChange={(value) => handleEnablerChange(enabler.id, "businessName", value)}
                          >
                            <SelectTrigger className={cn("h-9", isEditMode && "focus:ring-2 focus:ring-green-500")}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Global Corporate Banking">Global Corporate Banking</SelectItem>
                              <SelectItem value="Business Banking">Business Banking</SelectItem>
                              <SelectItem value="Global Commercial Banking">Global Commercial Banking</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          enabler.businessName
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {isEditMode ? (
                          <Input
                            value={enabler.functionalGroup}
                            onChange={(e) => handleEnablerChange(enabler.id, "functionalGroup", e.target.value)}
                            className={cn("h-9 text-xs", isEditMode && "focus:ring-2 focus:ring-green-500")}
                          />
                        ) : (
                          enabler.functionalGroup
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {isEditMode ? (
                          <Input
                            value={enabler.functionalGroupType}
                            onChange={(e) => handleEnablerChange(enabler.id, "functionalGroupType", e.target.value)}
                            className={cn("h-9 text-xs", isEditMode && "focus:ring-2 focus:ring-green-500")}
                          />
                        ) : (
                          enabler.functionalGroupType
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch
                            checked={enabler.critical}
                            onCheckedChange={(checked) => handleEnablerChange(enabler.id, "critical", checked)}
                            disabled={!isEditMode}
                            className={cn(
                              enabler.critical ? "bg-red-600" : "bg-gray-200",
                              !isEditMode && "opacity-80 cursor-default",
                            )}
                          />
                        </div>
                      </TableCell>
                      {isEditMode && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEnabler(enabler.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Add pagination controls */}
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {isEditMode && (
                <Button variant="outline" size="sm" onClick={handleAddEnabler} className="flex items-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Enabler</span>
                </Button>
              )}

              {enablersPagination.totalPages > 1 && (
                <div className={`${isEditMode ? "sm:ml-auto" : "mx-auto sm:mx-0"}`}>
                  <PaginationControls
                    currentPage={enablersPagination.currentPage}
                    totalPages={enablersPagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Section - Keep existing code */}
        <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-green-800 font-semibold mb-3 text-sm lg:text-base">Enablers Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
            <div>
              <span className="font-medium text-green-700">Total Enablers:</span>{" "}
              <span className="text-green-600">{enablers.length}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Critical Enablers:</span>{" "}
              <span className="text-green-600">{enablers.filter((e) => e.critical).length}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Service Level 2 Types:</span>{" "}
              <span className="text-green-600">{new Set(enablers.map((e) => e.serviceLevel2)).size}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Last Updated:</span>{" "}
              <span className="text-green-600">Oct 30, 2024, 2:36:48 PM</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCapabilityMapping = () => {
    // Get paginated data
    const startIndex = (capabilityPagination.currentPage - 1) * capabilityPagination.itemsPerPage
    const endIndex = startIndex + capabilityPagination.itemsPerPage
    const paginatedCapabilityMapping = capabilityMapping.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
      setCapabilityPagination((prev) => ({
        ...prev,
        currentPage: page,
      }))
    }

    return (
      <div className="space-y-6 lg:space-y-8 xl:space-y-10">
        {/* Header Section - Keep existing code */}
        <div className="text-center mb-6 lg:mb-8 xl:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-purple-600" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
            Capability Mapping
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Map application capabilities across organizational levels
          </p>
        </div>

        {/* Capability Mapping Table */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Capability Mapping Configuration
              </div>
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, capabilityMapping.length)} of {capabilityMapping.length}{" "}
                mappings
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[20%]">LOB (Level 1)</TableHead>
                  <TableHead className="w-[25%]">Domain (Level 2)</TableHead>
                  <TableHead className="w-[25%]">Function (Level 3)</TableHead>
                  <TableHead className="w-[20%]">Platform (Level 4)</TableHead>
                  {isEditMode && <TableHead className="w-[10%]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCapabilityMapping.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell>
                      {isEditMode ? (
                        <Input
                          value={mapping.lob}
                          onChange={(e) => handleCapabilityMappingChange(mapping.id, "lob", e.target.value)}
                          className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-purple-500")}
                        />
                      ) : (
                        mapping.lob
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditMode ? (
                        <Input
                          value={mapping.domain}
                          onChange={(e) => handleCapabilityMappingChange(mapping.id, "domain", e.target.value)}
                          className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-purple-500")}
                        />
                      ) : (
                        mapping.domain
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditMode ? (
                        <Input
                          value={mapping.function}
                          onChange={(e) => handleCapabilityMappingChange(mapping.id, "function", e.target.value)}
                          className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-purple-500")}
                        />
                      ) : (
                        mapping.function
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditMode ? (
                        <Input
                          value={mapping.platform}
                          onChange={(e) => handleCapabilityMappingChange(mapping.id, "platform", e.target.value)}
                          className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-purple-500")}
                        />
                      ) : (
                        mapping.platform
                      )}
                    </TableCell>
                    {isEditMode && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCapabilityMapping(mapping.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Add pagination controls */}
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCapabilityMapping}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Capability Mapping</span>
                </Button>
              )}

              {capabilityPagination.totalPages > 1 && (
                <div className={`${isEditMode ? "sm:ml-auto" : "mx-auto sm:mx-0"}`}>
                  <PaginationControls
                    currentPage={capabilityPagination.currentPage}
                    totalPages={capabilityPagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Section - Keep existing code */}
        <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-purple-800 font-semibold mb-3 text-sm lg:text-base">Capability Mapping Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
            <div>
              <span className="font-medium text-purple-700">Total Mappings:</span>{" "}
              <span className="text-purple-600">{capabilityMapping.length}</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Unique LOBs:</span>{" "}
              <span className="text-purple-600">{new Set(capabilityMapping.map((m) => m.lob)).size}</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Unique Domains:</span>{" "}
              <span className="text-purple-600">{new Set(capabilityMapping.map((m) => m.domain)).size}</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Last Updated:</span>{" "}
              <span className="text-purple-600">Oct 30, 2024, 2:36:48 PM</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderBusinessProcess = () => {
    // Get paginated data
    const startIndex = (businessPagination.currentPage - 1) * businessPagination.itemsPerPage
    const endIndex = startIndex + businessPagination.itemsPerPage
    const paginatedBusinessProcesses = businessProcesses.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
      setBusinessPagination((prev) => ({
        ...prev,
        currentPage: page,
      }))
    }

    return (
      <div className="space-y-6 lg:space-y-8 xl:space-y-10">
        {/* Header Section - Keep existing code */}
        <div className="text-center mb-6 lg:mb-8 xl:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:w-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <Server className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-orange-600" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-2">
            Business Process
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Define business processes and workflows for this application
          </p>
        </div>

        {/* Business Process Table */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Server className="h-5 w-5 mr-2 text-orange-600" />
                Business Process Configuration
              </div>
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, businessProcesses.length)} of {businessProcesses.length}{" "}
                processes
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[30%]">Enterprise Reporting Hierarchy (ERH)</TableHead>
                    <TableHead className="w-[30%]">Business Process Name</TableHead>
                    <TableHead className="w-[30%]">EPCF Level 1 Class Name</TableHead>
                    {isEditMode && <TableHead className="w-[10%]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBusinessProcesses.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell>
                        {isEditMode ? (
                          <Input
                            value={process.erh}
                            onChange={(e) => handleBusinessProcessChange(process.id, "erh", e.target.value)}
                            className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-orange-500")}
                          />
                        ) : (
                          process.erh
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <Input
                            value={process.businessProcessName}
                            onChange={(e) =>
                              handleBusinessProcessChange(process.id, "businessProcessName", e.target.value)
                            }
                            className={cn("h-9 lg:h-10 xl:h-11", isEditMode && "focus:ring-2 focus:ring-orange-500")}
                          />
                        ) : (
                          process.businessProcessName
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {isEditMode ? (
                          <Input
                            value={process.epcfLevel1ClassName}
                            onChange={(e) =>
                              handleBusinessProcessChange(process.id, "epcfLevel1ClassName", e.target.value)
                            }
                            className={cn(
                              "h-9 lg:h-10 xl:h-11 text-xs",
                              isEditMode && "focus:ring-2 focus:ring-orange-500",
                            )}
                          />
                        ) : (
                          process.epcfLevel1ClassName
                        )}
                      </TableCell>
                      {isEditMode && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBusinessProcess(process.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Add pagination controls */}
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddBusinessProcess}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Business Process</span>
                </Button>
              )}

              {businessPagination.totalPages > 1 && (
                <div className={`${isEditMode ? "sm:ml-auto" : "mx-auto sm:mx-0"}`}>
                  <PaginationControls
                    currentPage={businessPagination.currentPage}
                    totalPages={businessPagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Section - Keep existing code */}
        <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="text-orange-800 font-semibold mb-3 text-sm lg:text-base">Business Process Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 text-xs lg:text-sm">
            <div>
              <span className="font-medium text-orange-700">Total Processes:</span>{" "}
              <span className="text-orange-600">{businessProcesses.length}</span>
            </div>
            <div>
              <span className="font-medium text-orange-700">Unique ERH:</span>{" "}
              <span className="text-orange-600">{new Set(businessProcesses.map((p) => p.erh)).size}</span>
            </div>
            <div>
              <span className="font-medium text-orange-700">Unique Process Names:</span>{" "}
              <span className="text-orange-600">
                {new Set(businessProcesses.map((p) => p.businessProcessName)).size}
              </span>
            </div>
            <div>
              <span className="font-medium text-orange-700">Last Updated:</span>{" "}
              <span className="text-orange-600">Oct 30, 2024, 2:36:48 PM</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderCriticalService()
      case 1:
        return renderAppFunctions()
      case 2:
        return renderEnablers()
      case 3:
        return renderCapabilityMapping()
      case 4:
        return renderBusinessProcess()
      default:
        return renderCriticalService()
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
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                  Service & Function Alignment
                </h2>
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
                Configure services, functions, and business processes for this application
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
                  disabled={!hasUnsavedChanges}
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
          </div>

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
      </div>
    </div>
  )
}
