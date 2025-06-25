"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, User, Mail, Building, Briefcase, TrendingUp, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { createUserSchema, type CreateUserForm, type User as UserType } from "@/lib/schemas"

interface CreateUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: (user: UserType) => void
  existingUsers: UserType[]
}

// Common LOBs for dropdown
const commonLOBs = [
  "APPLICATION PRODUCTION SERVICES & ENGINEERING",
  "GLOBAL BUSINESS SERVICES",
  "TECHNOLOGY INFRASTRUCTURE",
  "CYBERSECURITY & RISK",
  "DATA & ANALYTICS",
  "DIGITAL TRANSFORMATION",
]

// Common LOB Details
const lobDetails: Record<string, string[]> = {
  "APPLICATION PRODUCTION SERVICES & ENGINEERING": [
    "FBV GLOBAL BANKING APS",
    "FBI - APS & CTO EMEA",
    "COMMERCIAL BANKING APS",
    "WEALTH MANAGEMENT APS",
  ],
  "GLOBAL BUSINESS SERVICES": [
    "GLOBAL BUSINESS SERVICES INDIA (VSP)",
    "GLOBAL BUSINESS SERVICES AMERICAS",
    "GLOBAL BUSINESS SERVICES EMEA",
  ],
  "TECHNOLOGY INFRASTRUCTURE": ["CLOUD INFRASTRUCTURE", "NETWORK & SECURITY", "DATA CENTER OPERATIONS"],
  "CYBERSECURITY & RISK": ["INFORMATION SECURITY", "RISK MANAGEMENT", "COMPLIANCE & GOVERNANCE"],
  "DATA & ANALYTICS": ["DATA ENGINEERING", "BUSINESS INTELLIGENCE", "ADVANCED ANALYTICS"],
  "DIGITAL TRANSFORMATION": ["DIGITAL STRATEGY", "INNOVATION LAB", "CUSTOMER EXPERIENCE"],
}

// Common roles
const commonRoles = [
  "L1 Support",
  "L2 Support",
  "L3 Support",
  "Support Manager",
  "Senior Developer",
  "Lead Developer",
  "DevOps Engineer",
  "Database Administrator",
  "System Administrator",
  "Business Analyst",
  "Project Manager",
  "Technical Lead",
]

// Common managers (in real app, this would come from API)
const commonManagers = [
  "Rodriguez, Carlos M.",
  "Williams, David",
  "Anderson, Lisa K.",
  "Kumar, Rajesh",
  "Taylor, Michael",
  "Johnson, Sarah",
  "Brown, Jennifer",
  "Davis, Robert",
  "Wilson, Amanda",
  "Miller, Christopher",
]

export function CreateUserDialog({ isOpen, onClose, onUserCreated, existingUsers }: CreateUserDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      employeeId: "",
      manager: "",
      lob: "",
      lobDetail: "",
      role: "",
      skillLevel: "Basic",
      percentAllocated: 0,
      startDate: new Date(),
    },
  })

  const watchedValues = form.watch()
  const selectedLOB = form.watch("lob")

  // Check for duplicate email or employee ID
  const checkDuplicates = (email: string, employeeId: string) => {
    const emailExists = existingUsers.some((user) => user.email.toLowerCase() === email.toLowerCase())
    const employeeIdExists = existingUsers.some((user) => user.employeeId === employeeId)

    if (emailExists) {
      form.setError("email", { message: "This email address is already in use" })
    }
    if (employeeIdExists) {
      form.setError("employeeId", { message: "This employee ID is already in use" })
    }

    return !emailExists && !employeeIdExists
  }

  // Generate employee ID suggestion
  const generateEmployeeId = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return ""
    const base = `${firstName.charAt(0)}${lastName}`.toLowerCase().replace(/[^a-z]/g, "")
    let suggestion = base
    let counter = 1

    while (existingUsers.some((user) => user.employeeId === suggestion)) {
      suggestion = `${base}${counter}`
      counter++
    }

    return suggestion
  }

  // Auto-generate employee ID when name changes
  const handleNameChange = (field: "firstName" | "lastName", value: string) => {
    form.setValue(field, value)

    if (field === "firstName" || field === "lastName") {
      const firstName = field === "firstName" ? value : form.getValues("firstName")
      const lastName = field === "lastName" ? value : form.getValues("lastName")

      if (firstName && lastName && !form.getValues("employeeId")) {
        const suggestion = generateEmployeeId(firstName, lastName)
        form.setValue("employeeId", suggestion)
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (data: CreateUserForm) => {
    // Check for duplicates
    if (!checkDuplicates(data.email, data.employeeId)) {
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirmCreate = async () => {
    setIsLoading(true)
    try {
      const data = form.getValues()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create new user object
      const newUser: UserType = {
        id: `user_${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.lastName}, ${data.firstName}`,
        email: data.email,
        employeeId: data.employeeId,
        profileImage: "/placeholder.svg?height=40&width=40",
        manager: data.manager,
        lob: data.lob,
        lobDetail: data.lobDetail,
        role: data.role,
        skillLevel: data.skillLevel,
        percentAllocated: data.percentAllocated,
        isTerminated: false,
        startDate: data.startDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "current_admin", // In real app, this would be the current user
      }

      onUserCreated(newUser)

      toast({
        title: "User created successfully",
        description: `${newUser.name} has been added to the resource pool.`,
      })

      // Reset form and close
      form.reset()
      setCurrentStep(1)
      setShowConfirmation(false)
      onClose()
    } catch (error) {
      toast({
        title: "Error creating user",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when dialog closes
  const handleClose = () => {
    form.reset()
    setCurrentStep(1)
    setShowConfirmation(false)
    onClose()
  }

  // Calculate form completion percentage
  const getFormProgress = () => {
    const fields = [
      "firstName",
      "lastName",
      "email",
      "employeeId",
      "manager",
      "lob",
      "lobDetail",
      "role",
      "skillLevel",
      "percentAllocated",
      "startDate",
    ]

    const completedFields = fields.filter((field) => {
      const value = form.getValues(field as keyof CreateUserForm)
      return value !== "" && value !== undefined && value !== null
    })

    return Math.round((completedFields.length / fields.length) * 100)
  }

  const progress = getFormProgress()

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Confirm User Creation</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please review the user information below before creating the account.</AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Name:</span>
                    <p className="text-sm text-gray-600">
                      {watchedValues.firstName} {watchedValues.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm text-gray-600">{watchedValues.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Employee ID:</span>
                    <p className="text-sm text-gray-600">{watchedValues.employeeId}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Work Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Role:</span>
                    <p className="text-sm text-gray-600">{watchedValues.role}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Manager:</span>
                    <p className="text-sm text-gray-600">{watchedValues.manager}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Skill Level:</span>
                    <p className="text-sm text-gray-600">{watchedValues.skillLevel}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Organization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">LOB:</span>
                    <p className="text-sm text-gray-600">{watchedValues.lob}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">LOB Detail:</span>
                    <p className="text-sm text-gray-600">{watchedValues.lobDetail}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Allocation:</span>
                      <p className="text-sm text-gray-600">{watchedValues.percentAllocated}%</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Start Date:</span>
                      <p className="text-sm text-gray-600">
                        {watchedValues.startDate ? format(watchedValues.startDate, "PPP") : ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isLoading}>
              Back to Edit
            </Button>
            <Button onClick={handleConfirmCreate} disabled={isLoading}>
              {isLoading ? "Creating User..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm text-gray-500">{progress}% complete</span>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-6 p-1">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    onChange={(e) => handleNameChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className={cn(form.formState.errors.firstName && "border-red-300")}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    onChange={(e) => handleNameChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className={cn(form.formState.errors.lastName && "border-red-300")}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="user@company.com"
                      className={cn("pl-10", form.formState.errors.email && "border-red-300")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    {...form.register("employeeId")}
                    placeholder="Auto-generated or enter custom"
                    className={cn(form.formState.errors.employeeId && "border-red-300")}
                  />
                  {form.formState.errors.employeeId && (
                    <p className="text-sm text-red-600">{form.formState.errors.employeeId.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                  Work Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select onValueChange={(value) => form.setValue("role", value)}>
                    <SelectTrigger className={cn(form.formState.errors.role && "border-red-300")}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.role && (
                    <p className="text-sm text-red-600">{form.formState.errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Manager *</Label>
                  <Select onValueChange={(value) => form.setValue("manager", value)}>
                    <SelectTrigger className={cn(form.formState.errors.manager && "border-red-300")}>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonManagers.map((manager) => (
                        <SelectItem key={manager} value={manager}>
                          {manager}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.manager && (
                    <p className="text-sm text-red-600">{form.formState.errors.manager.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skillLevel">Skill Level *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("skillLevel", value as "Basic" | "Advanced" | "Expert")}
                  >
                    <SelectTrigger className={cn(form.formState.errors.skillLevel && "border-red-300")}>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.skillLevel && (
                    <p className="text-sm text-red-600">{form.formState.errors.skillLevel.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentAllocated">Allocation Percentage *</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="percentAllocated"
                      type="number"
                      min="0"
                      max="100"
                      {...form.register("percentAllocated", { valueAsNumber: true })}
                      placeholder="0"
                      className={cn("pl-10", form.formState.errors.percentAllocated && "border-red-300")}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  {form.formState.errors.percentAllocated && (
                    <p className="text-sm text-red-600">{form.formState.errors.percentAllocated.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organization Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Building className="h-5 w-5 mr-2 text-purple-600" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lob">Line of Business (LOB) *</Label>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("lob", value)
                      form.setValue("lobDetail", "") // Reset LOB detail when LOB changes
                    }}
                  >
                    <SelectTrigger className={cn(form.formState.errors.lob && "border-red-300")}>
                      <SelectValue placeholder="Select LOB" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonLOBs.map((lob) => (
                        <SelectItem key={lob} value={lob}>
                          {lob}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.lob && (
                    <p className="text-sm text-red-600">{form.formState.errors.lob.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lobDetail">LOB Detail *</Label>
                  <Select onValueChange={(value) => form.setValue("lobDetail", value)} disabled={!selectedLOB}>
                    <SelectTrigger className={cn(form.formState.errors.lobDetail && "border-red-300")}>
                      <SelectValue placeholder={selectedLOB ? "Select LOB detail" : "Select LOB first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedLOB &&
                        lobDetails[selectedLOB]?.map((detail) => (
                          <SelectItem key={detail} value={detail}>
                            {detail}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.lobDetail && (
                    <p className="text-sm text-red-600">{form.formState.errors.lobDetail.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watchedValues.startDate && "text-muted-foreground",
                          form.formState.errors.startDate && "border-red-300",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watchedValues.startDate ? format(watchedValues.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={watchedValues.startDate}
                        onSelect={(date) => form.setValue("startDate", date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-red-600">{form.formState.errors.startDate.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={progress < 100}>
              Review & Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
