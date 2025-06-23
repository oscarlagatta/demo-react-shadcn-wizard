"use client"

import { useState } from "react"
import { Search, Plus, Trash2, Edit, MoreHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateSkillDialog } from "./create-skill-dialog"
import { DeleteSkillDialog } from "./delete-skill-dialog"
import type { Skill } from "@/lib/schemas"

interface SkillManagementPanelProps {
  skills: Skill[]
  onSkillCreated: (skill: Skill) => void
  onSkillDeleted: (skillId: string) => void
  onSkillUpdated: (skill: Skill) => void
}

export function SkillManagementPanel({
  skills,
  onSkillCreated,
  onSkillDeleted,
  onSkillUpdated,
}: SkillManagementPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  // Filter skills based on search and category
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      searchQuery === "" ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || skill.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Group skills by category
  const technologySkills = filteredSkills.filter((skill) => skill.category === "technology")
  const functionalSkills = filteredSkills.filter((skill) => skill.category === "functional")

  // Handle skill deletion
  const handleDeleteSkill = (skill: Skill) => {
    setSelectedSkill(skill)
    setShowDeleteDialog(true)
  }

  // Handle skill edit (placeholder for future implementation)
  const handleEditSkill = (skill: Skill) => {
    // TODO: Implement skill editing functionality
    console.log("Edit skill:", skill)
  }

  // Skill row component
  const SkillRow = ({ skill }: { skill: Skill }) => (
    <TableRow key={skill.id} className="hover:bg-gray-50">
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{skill.name}</span>
            {skill.isSystemSkill && (
              <Badge variant="secondary" className="text-xs">
                System
              </Badge>
            )}
          </div>
          {skill.description && <p className="text-sm text-gray-500 line-clamp-2">{skill.description}</p>}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${skill.category === "technology" ? "bg-blue-500" : "bg-green-500"}`}
          ></div>
          <span className="text-sm">{skill.category === "technology" ? "Technology" : "Functional"}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{skill.usageCount || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-gray-500">{skill.createdAt.toLocaleDateString()}</span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditSkill(skill)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Skill
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteSkill(skill)}
              className="text-red-600 focus:text-red-600"
              disabled={skill.isSystemSkill}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Skill
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Skill Management</h3>
          <p className="text-sm text-gray-600">Create, edit, and manage skills in the capability matrix</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Skill</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search skills by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology Skills</SelectItem>
            <SelectItem value="functional">Functional Knowledge</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Skills Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Technology Skills</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{technologySkills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Functional Skills</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{functionalSkills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Total Skills</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{skills.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Skills ({filteredSkills.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40%]">Skill Name</TableHead>
                  <TableHead className="w-[20%]">Category</TableHead>
                  <TableHead className="w-[15%]">Usage</TableHead>
                  <TableHead className="w-[15%]">Created</TableHead>
                  <TableHead className="w-[10%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill) => <SkillRow key={skill.id} skill={skill} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchQuery || categoryFilter !== "all"
                        ? "No skills found matching your criteria"
                        : "No skills available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateSkillDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSkillCreated={onSkillCreated}
        existingSkills={skills}
      />

      <DeleteSkillDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        skill={selectedSkill}
        onSkillDeleted={onSkillDeleted}
      />
    </div>
  )
}
