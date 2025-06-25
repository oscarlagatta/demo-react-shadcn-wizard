"use client"

import { useState, useMemo } from "react"
import { Search, Users, Star, Calendar, User, Trash2, CheckSquare, Square } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { UserSkillAssignment } from "@/lib/schemas"

interface UnassignSkillsPanelProps {
  userSkillAssignments: UserSkillAssignment[]
  selectedUsers: Array<{ id: string; name: string }>
  onUnassignSkills: (assignments: UserSkillAssignment[]) => void
}

export function UnassignSkillsPanel({
  userSkillAssignments,
  selectedUsers,
  onUnassignSkills,
}: UnassignSkillsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState<"user" | "skill">("user")

  // Filter assignments for selected users
  const relevantAssignments = userSkillAssignments.filter((assignment) =>
    selectedUsers.some((user) => user.id === assignment.userId),
  )

  // Apply search and category filters
  const filteredAssignments = useMemo(() => {
    return relevantAssignments.filter((assignment) => {
      const matchesSearch =
        searchQuery === "" ||
        assignment.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.userName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || assignment.skillCategory === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [relevantAssignments, searchQuery, selectedCategory])

  // Group assignments
  const groupedAssignments = useMemo(() => {
    if (groupBy === "user") {
      const grouped = filteredAssignments.reduce(
        (acc, assignment) => {
          const key = assignment.userId
          if (!acc[key]) {
            acc[key] = {
              groupKey: assignment.userName,
              assignments: [],
            }
          }
          acc[key].assignments.push(assignment)
          return acc
        },
        {} as Record<string, { groupKey: string; assignments: UserSkillAssignment[] }>,
      )

      return Object.values(grouped).sort((a, b) => a.groupKey.localeCompare(b.groupKey))
    } else {
      const grouped = filteredAssignments.reduce(
        (acc, assignment) => {
          const key = assignment.skillId
          if (!acc[key]) {
            acc[key] = {
              groupKey: assignment.skillName,
              assignments: [],
            }
          }
          acc[key].assignments.push(assignment)
          return acc
        },
        {} as Record<string, { groupKey: string; assignments: UserSkillAssignment[] }>,
      )

      return Object.values(grouped).sort((a, b) => a.groupKey.localeCompare(b.groupKey))
    }
  }, [filteredAssignments, groupBy])

  // Handle assignment selection
  const toggleAssignment = (assignmentId: string) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignmentId) ? prev.filter((id) => id !== assignmentId) : [...prev, assignmentId],
    )
  }

  const toggleAllInGroup = (assignments: UserSkillAssignment[]) => {
    const groupIds = assignments.map((a) => a.id)
    const allSelected = groupIds.every((id) => selectedAssignments.includes(id))

    if (allSelected) {
      setSelectedAssignments((prev) => prev.filter((id) => !groupIds.includes(id)))
    } else {
      setSelectedAssignments((prev) => [...new Set([...prev, ...groupIds])])
    }
  }

  const selectAll = () => {
    const allIds = filteredAssignments.map((a) => a.id)
    setSelectedAssignments(allIds)
  }

  const clearSelection = () => {
    setSelectedAssignments([])
  }

  // Handle unassign action
  const handleUnassign = () => {
    const assignmentsToUnassign = filteredAssignments.filter((assignment) =>
      selectedAssignments.includes(assignment.id),
    )
    onUnassignSkills(assignmentsToUnassign)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Get category stats
  const categoryStats = useMemo(() => {
    const stats = filteredAssignments.reduce(
      (acc, assignment) => {
        acc[assignment.skillCategory]++
        acc.total++
        return acc
      },
      { technology: 0, functional: 0, total: 0 },
    )
    return stats
  }, [filteredAssignments])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Unassign Skills</h3>
          <p className="text-sm text-gray-600">
            Remove skill assignments from {selectedUsers.length} selected user(s):{" "}
            {selectedUsers.map((u) => u.name).join(", ")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Assignments</p>
                  <p className="text-2xl font-bold">{categoryStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Technology Skills</p>
                  <p className="text-2xl font-bold">{categoryStats.technology}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Functional Skills</p>
                  <p className="text-2xl font-bold">{categoryStats.functional}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by skill or user name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technology">Technology Skills</SelectItem>
              <SelectItem value="functional">Functional Skills</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(value: "user" | "skill") => setGroupBy(value)}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">By User</SelectItem>
              <SelectItem value="skill">By Skill</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selection Controls */}
        {filteredAssignments.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedAssignments.length} of {filteredAssignments.length} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  <CheckSquare className="h-3 w-3 mr-1" />
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  <Square className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            {selectedAssignments.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleUnassign}>
                <Trash2 className="h-3 w-3 mr-1" />
                Unassign Selected ({selectedAssignments.length})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Alert>
            <AlertDescription>
              {relevantAssignments.length === 0
                ? "No skill assignments found for the selected users."
                : "No assignments match your current filters."}
            </AlertDescription>
          </Alert>
        ) : (
          groupedAssignments.map((group, groupIndex) => (
            <Card key={groupIndex}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center space-x-2">
                    {groupBy === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          group.assignments[0]?.skillCategory === "technology" ? "bg-blue-500" : "bg-green-500",
                        )}
                      />
                    )}
                    <span>{group.groupKey}</span>
                    <Badge variant="secondary" className="text-xs">
                      {group.assignments.length}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllInGroup(group.assignments)}
                      className="text-xs"
                    >
                      {group.assignments.every((a) => selectedAssignments.includes(a.id))
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {group.assignments.map((assignment, index) => (
                    <div key={assignment.id}>
                      {index > 0 && <Separator />}
                      <div className="flex items-center space-x-3 py-2">
                        <Checkbox
                          checked={selectedAssignments.includes(assignment.id)}
                          onCheckedChange={() => toggleAssignment(assignment.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {groupBy === "skill" ? (
                                <span className="font-medium text-sm">{assignment.userName}</span>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">{assignment.skillName}</span>
                                  <Badge
                                    variant={assignment.skillCategory === "technology" ? "default" : "outline"}
                                    className={cn(
                                      "text-xs",
                                      assignment.skillCategory === "technology"
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : "bg-green-100 text-green-800 border-green-200",
                                    )}
                                  >
                                    {assignment.skillCategory === "technology" ? "Tech" : "Functional"}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{assignment.rating}/5</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Assigned {formatDate(assignment.assignedAt)}</span>
                            </div>
                            <span>by {assignment.assignedByName}</span>
                          </div>
                          {assignment.comments && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{assignment.comments}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
