"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, Plus, Star, Trash2, Upload, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { capabilityMatrixFormSchema, type CapabilityMatrixForm, type Skill, type User } from "@/lib/schemas"
import { CreateSkillDialog } from "./create-skill-dialog"

interface CapabilityMatrixModalProps {
  isOpen: boolean
  onClose: () => void
  selectedUsers: Array<{ id: string; name: string }>
  onSave: (data: CapabilityMatrixForm) => Promise<void>
}

// Mock skill data - in real app this would come from API
const mockSkills: Skill[] = [
  {
    id: "1",
    name: "JavaScript",
    canonicalName: "javascript",
    category: "technology",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 15,
  },
  {
    id: "2",
    name: "React",
    canonicalName: "react",
    category: "technology",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 12,
  },
  {
    id: "3",
    name: "Node.js",
    canonicalName: "nodejs",
    category: "technology",
    description: "Server-side JavaScript runtime environment",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 8,
  },
  {
    id: "4",
    name: "SQL",
    canonicalName: "sql",
    category: "technology",
    description: "Structured Query Language for database management",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 20,
  },
  {
    id: "5",
    name: "Python",
    canonicalName: "python",
    category: "technology",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 10,
  },
  {
    id: "6",
    name: "Incident Management",
    canonicalName: "incident-management",
    category: "functional",
    description: "Process of managing and resolving IT incidents",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 25,
  },
  {
    id: "7",
    name: "Customer Support",
    canonicalName: "customer-support",
    category: "functional",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 18,
  },
  {
    id: "8",
    name: "Documentation",
    canonicalName: "documentation",
    category: "functional",
    description: "Creating and maintaining technical documentation",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 14,
  },
  {
    id: "9",
    name: ".NET",
    canonicalName: "dotnet",
    category: "technology",
    description: "Microsoft's development platform",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 22,
  },
  {
    id: "10",
    name: "C#",
    canonicalName: "csharp",
    category: "technology",
    description: "Programming language for .NET",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 20,
  },
  {
    id: "11",
    name: "Java",
    canonicalName: "java",
    category: "technology",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 30,
  },
  {
    id: "12",
    name: "Project Management",
    canonicalName: "project-management",
    category: "functional",
    description: "Planning, organizing, and managing resources",
    rating: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: "system",
    isSystemSkill: true,
    usageCount: 15,
  },
]

// Mock users data - in real app this would come from API
const mockUsers: User[] = [
  {
    id: "u1",
    firstName: "Michelle",
    lastName: "Chen",
    name: "Chen, Michelle",
    email: "michelle.chen@example.com",
    employeeId: "EMP001",
    profileImage: "/placeholder.svg?height=40&width=40",
    manager: "Rodriguez, Carlos M.",
    lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
    lobDetail: "FBV GLOBAL BANKING APS",
    role: "L2 Support",
    skillLevel: "Basic",
    percentAllocated: 3,
    isTerminated: false,
    startDate: new Date("2023-01-15"),
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    createdBy: "system",
  },
  {
    id: "u2",
    firstName: "Arjun",
    lastName: "Patel",
    name: "Patel, Arjun",
    email: "arjun.patel@example.com",
    employeeId: "EMP002",
    profileImage: "/placeholder.svg?height=40&width=40",
    manager: "Rodriguez, Carlos M.",
    lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
    lobDetail: "FBV GLOBAL BANKING APS",
    role: "L2 Support",
    skillLevel: "Basic",
    percentAllocated: 15,
    isTerminated: false,
    startDate: new Date("2023-02-01"),
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01"),
    createdBy: "system",
  },
  {
    id: "u3",
    firstName: "Sarah",
    lastName: "Thompson",
    name: "Thompson, Sarah",
    email: "sarah.thompson@example.com",
    employeeId: "EMP003",
    profileImage: "/placeholder.svg?height=40&width=40",
    manager: "Williams, David",
    lob: "APPLICATION PRODUCTION SERVICES & ENGINEERING",
    lobDetail: "FBI - APS & CTO EMEA",
    role: "Support Manager",
    skillLevel: "Advanced",
    percentAllocated: 32,
    isTerminated: false,
    startDate: new Date("2022-11-15"),
    createdAt: new Date("2022-11-15"),
    updatedAt: new Date("2022-11-15"),
    createdBy: "system",
  },
  {
    id: "u4",
    firstName: "Rajesh",
    lastName: "Kumar",
    name: "Kumar, Rajesh",
    email: "rajesh.kumar@example.com",
    employeeId: "EMP004",
    profileImage: "/placeholder.svg?height=40&width=40",
    manager: "Anderson, Lisa K.",
    lob: "GLOBAL BUSINESS SERVICES",
    lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
    role: "L2 Support",
    skillLevel: "Basic",
    percentAllocated: 5,
    isTerminated: false,
    startDate: new Date("2023-03-01"),
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-03-01"),
    createdBy: "system",
  },
  {
    id: "u5",
    firstName: "Emily",
    lastName: "Johnson",
    name: "Johnson, Emily",
    email: "emily.johnson@example.com",
    employeeId: "EMP005",
    profileImage: "/placeholder.svg?height=40&width=40",
    manager: "Kumar, Rajesh",
    lob: "GLOBAL BUSINESS SERVICES",
    lobDetail: "GLOBAL BUSINESS SERVICES INDIA (VSP)",
    role: "L2 Support",
    skillLevel: "Basic",
    percentAllocated: 5,
    isTerminated: false,
    startDate: new Date("2023-04-15"),
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
    createdBy: "system",
  },
]

// Skill templates
const skillTemplates = {
  "L2 Support": [
    { skillId: "6", rating: 3 },
    { skillId: "7", rating: 4 },
    { skillId: "8", rating: 3 },
    { skillId: "4", rating: 2 },
  ],
  "L3 Support": [
    { skillId: "6", rating: 4 },
    { skillId: "7", rating: 4 },
    { skillId: "8", rating: 4 },
    { skillId: "4", rating: 4 },
  ],
  Developer: [
    { skillId: "1", rating: 4 },
    { skillId: "2", rating: 4 },
    { skillId: "3", rating: 3 },
    { skillId: "4", rating: 3 },
    { skillId: "5", rating: 2 },
  ],
  ".NET Developer": [
    { skillId: "9", rating: 5 },
    { skillId: "10", rating: 5 },
    { skillId: "4", rating: 3 },
  ],
  "Java Developer": [
    { skillId: "11", rating: 5 },
    { skillId: "4", rating: 3 },
  ],
}

export function CapabilityMatrixModal({ isOpen, onClose, selectedUsers, onSave }: CapabilityMatrixModalProps) {
  const [activeTab, setActiveTab] = useState<string>("skills")
  const [searchQuery, setSearchQuery] = useState("")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<
    Array<{
      skillId: string
      name: string
      category: "technology" | "functional"
      rating: number
      comments?: string
    }>
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateSkillDialog, setShowCreateSkillDialog] = useState(false)
  const [initialSkillName, setInitialSkillName] = useState("")
  const [initialCategory, setInitialCategory] = useState<"technology" | "functional" | undefined>(undefined)
  const [selectedUsersList, setSelectedUsersList] = useState<Array<{ id: string; name: string }>>(selectedUsers)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [allSkills, setAllSkills] = useState<Skill[]>(mockSkills)

  const form = useForm<CapabilityMatrixForm>({
    resolver: zodResolver(capabilityMatrixFormSchema),
    defaultValues: {
      skills: [],
      userIds: selectedUsers.map((u) => u.id),
    },
  })

  // Filter skills based on search
  const filteredSkills = allSkills.filter(
    (skill) => searchQuery === "" || skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group skills by category
  const technologySkills = filteredSkills.filter((skill) => skill.category === "technology")
  const functionalSkills = filteredSkills.filter((skill) => skill.category === "functional")

  // Filter users based on search
  const filteredUsers = mockUsers.filter(
    (user) =>
      userSearchQuery === "" ||
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(userSearchQuery.toLowerCase()),
  )

  // Check if a user is already selected
  const isUserSelected = (userId: string) => {
    return selectedUsersList.some((u) => u.id === userId)
  }

  // Add user to selection
  const addUser = (user: User) => {
    if (!isUserSelected(user.id)) {
      setSelectedUsersList((prev) => [...prev, { id: user.id, name: user.name }])
    }
  }

  // Remove user from selection
  const removeUser = (userId: string) => {
    setSelectedUsersList((prev) => prev.filter((u) => u.id !== userId))
  }

  // Add skill to selection
  const addSkill = (skill: Skill) => {
    if (selectedSkills.find((s) => s.skillId === skill.id)) {
      return
    }

    const newSkill = {
      skillId: skill.id,
      name: skill.name,
      category: skill.category,
      rating: 1,
      comments: "",
    }

    setSelectedSkills((prev) => [...prev, newSkill])
    setSearchQuery("")
  }

  // Remove skill from selection
  const removeSkill = (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.skillId !== skillId))
  }

  // Update skill rating
  const updateSkillRating = (skillId: string, rating: number) => {
    setSelectedSkills((prev) => prev.map((skill) => (skill.skillId === skillId ? { ...skill, rating } : skill)))
  }

  // Update skill comments
  const updateSkillComments = (skillId: string, comments: string) => {
    setSelectedSkills((prev) => prev.map((skill) => (skill.skillId === skillId ? { ...skill, comments } : skill)))
  }

  // Apply skill template
  const applyTemplate = (templateName: string) => {
    const template = skillTemplates[templateName as keyof typeof skillTemplates]
    if (!template) return

    const templateSkills = template
      .map((t) => {
        const skill = allSkills.find((s) => s.id === t.skillId)
        if (!skill) return null

        return {
          skillId: skill.id,
          name: skill.name,
          category: skill.category,
          rating: t.rating,
          comments: "",
        }
      })
      .filter(Boolean) as typeof selectedSkills

    setSelectedSkills(templateSkills)
  }

  // Handle form submission
  const handleSubmit = async (data: CapabilityMatrixForm) => {
    setIsLoading(true)
    try {
      const formData = {
        ...data,
        skills: selectedSkills,
        userIds: selectedUsersList.map((u) => u.id),
      }

      await onSave(formData)
      setShowSuccessMessage(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Error saving capability matrix:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle create skill
  const handleCreateSkill = (searchTerm: string, category: "technology" | "functional") => {
    setInitialSkillName(searchTerm)
    setInitialCategory(category)
    setShowCreateSkillDialog(true)
  }

  // Handle skill created
  const handleSkillCreated = (skill: Skill) => {
    setAllSkills((prev) => [...prev, skill])

    // Add the newly created skill to selected skills
    const newSkill = {
      skillId: skill.id,
      name: skill.name,
      category: skill.category,
      rating: 1,
      comments: "",
    }

    setSelectedSkills((prev) => [...prev, newSkill])
    setSearchQuery("")
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSkills([])
      setSearchQuery("")
      setUserSearchQuery("")
      setActiveTab("skills")
      setSelectedUsersList(selectedUsers)
      form.reset()
    }
  }, [isOpen, form, selectedUsers])

  // Star rating component
  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={cn("h-5 w-5 transition-colors", star <= rating ? "text-yellow-400 fill-current" : "text-gray-300")}
        >
          <Star className="h-full w-full" />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Manage Capability Matrix</DialogTitle>
          <p className="text-sm text-gray-600">Assign skills to {selectedUsersList.length} selected user(s)</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-4">
            <TabsTrigger value="skills">Manage Skills</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Skill Templates */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Quick Templates:</span>
              {Object.keys(skillTemplates).map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                  className="h-8"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  {template}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
              {/* Skill Search and Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Add Skills</h3>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Available Skills */}
                <div className="space-y-4 overflow-y-auto max-h-96">
                  {/* Technology Skills */}
                  {technologySkills.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-700 flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          Technology Skills
                        </h4>
                        {searchQuery && technologySkills.length === 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateSkill(searchQuery, "technology")}
                            className="h-7 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Create "{searchQuery}"
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {technologySkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => addSkill(skill)}
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium">{skill.name}</span>
                              {skill.description && (
                                <p className="text-xs text-gray-500 line-clamp-1">{skill.description}</p>
                              )}
                            </div>
                            <Plus className="h-4 w-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Functional Skills */}
                  {functionalSkills.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-700 flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          Functional Knowledge / BAU Tasks
                        </h4>
                        {searchQuery && functionalSkills.length === 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateSkill(searchQuery, "functional")}
                            className="h-7 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Create "{searchQuery}"
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {functionalSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => addSkill(skill)}
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium">{skill.name}</span>
                              {skill.description && (
                                <p className="text-xs text-gray-500 line-clamp-1">{skill.description}</p>
                              )}
                            </div>
                            <Plus className="h-4 w-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery && technologySkills.length === 0 && functionalSkills.length === 0 && (
                    <div className="text-center py-4 border rounded-lg">
                      <p className="text-gray-500 mb-2">No skills found matching "{searchQuery}"</p>
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateSkill(searchQuery, "technology")}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create as Technology Skill
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateSkill(searchQuery, "functional")}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create as Functional Skill
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Selected Skills ({selectedSkills.length})</h3>
                  {selectedSkills.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedSkills([])}>
                      Clear All
                    </Button>
                  )}
                </div>

                {selectedSkills.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No skills selected</p>
                    <p className="text-sm">Search and add skills from the left panel</p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-96">
                    {/* Group selected skills by category */}
                    {selectedSkills.filter((s) => s.category === "technology").length > 0 && (
                      <div>
                        <h4 className="font-medium text-blue-700 mb-3 flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          Technology Skills
                        </h4>
                        <div className="space-y-3">
                          {selectedSkills
                            .filter((skill) => skill.category === "technology")
                            .map((skill) => (
                              <Card key={skill.skillId} className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{skill.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.skillId)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Skill Level</label>
                                    <StarRating
                                      rating={skill.rating}
                                      onRatingChange={(rating) => updateSkillRating(skill.skillId, rating)}
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                      Comments (Optional)
                                    </label>
                                    <Textarea
                                      placeholder="Add notes about this skill..."
                                      value={skill.comments || ""}
                                      onChange={(e) => updateSkillComments(skill.skillId, e.target.value)}
                                      className="h-20"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                        </div>
                      </div>
                    )}

                    {selectedSkills.filter((s) => s.category === "functional").length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-700 mb-3 flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          Functional Knowledge / BAU Tasks
                        </h4>
                        <div className="space-y-3">
                          {selectedSkills
                            .filter((skill) => skill.category === "functional")
                            .map((skill) => (
                              <Card key={skill.skillId} className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{skill.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.skillId)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Skill Level</label>
                                    <StarRating
                                      rating={skill.rating}
                                      onRatingChange={(rating) => updateSkillRating(skill.skillId, rating)}
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                      Comments (Optional)
                                    </label>
                                    <Textarea
                                      placeholder="Add notes about this skill..."
                                      value={skill.comments || ""}
                                      onChange={(e) => updateSkillComments(skill.skillId, e.target.value)}
                                      className="h-20"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
              {/* User Search and Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Add Users</h3>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users by name, email, or ID..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Available Users */}
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-lg",
                          isUserSelected(user.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 cursor-pointer",
                        )}
                        onClick={() => !isUserSelected(user.id) && addUser(user)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.firstName[0] + user.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        {isUserSelected(user.id) ? (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Selected</Badge>
                        ) : (
                          <Plus className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No users found matching your search</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Users */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Selected Users ({selectedUsersList.length})</h3>
                </div>

                {selectedUsersList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No users selected</p>
                    <p className="text-sm">Search and add users from the left panel</p>
                  </div>
                ) : (
                  <div className="space-y-2 overflow-y-auto max-h-96">
                    {selectedUsersList.map((user) => {
                      const userDetails = mockUsers.find((u) => u.id === user.id)

                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={userDetails?.profileImage || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name.split(", ")[1]?.[0]}
                                {user.name.split(", ")[0]?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              {userDetails && (
                                <p className="text-xs text-gray-500">
                                  {userDetails.role} • {userDetails.lob.split(" ")[0]}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeUser(user.id)} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Success Message */}
        {showSuccessMessage && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Capability matrix successfully saved for {selectedUsersList.length} user(s).
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit({ skills: selectedSkills, userIds: selectedUsersList.map((u) => u.id) })}
            disabled={selectedSkills.length === 0 || selectedUsersList.length === 0 || isLoading}
          >
            {isLoading ? "Saving..." : `Assign Skills to ${selectedUsersList.length} User(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Create Skill Dialog */}
      <CreateSkillDialog
        isOpen={showCreateSkillDialog}
        onClose={() => setShowCreateSkillDialog(false)}
        onSkillCreated={handleSkillCreated}
        existingSkills={allSkills}
        initialSkillName={initialSkillName}
        initialCategory={initialCategory}
      />
    </Dialog>
  )
}
