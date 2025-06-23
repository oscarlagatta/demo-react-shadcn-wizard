"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, Users, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { unassignSkillSchema, type UserSkillAssignment } from "@/lib/schemas"

interface UnassignSkillsConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: UnassignSkillForm) => Promise<void>
  selectedAssignments: UserSkillAssignment[]
  isLoading?: boolean
}

export interface UnassignSkillForm {
  userIds: string[]
  skillIds: string[]
  confirmationText: string
}

export function UnassignSkillsConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedAssignments,
  isLoading = false,
}: UnassignSkillsConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = useState("")

  const form = useForm<UnassignSkillForm>({
    resolver: zodResolver(unassignSkillSchema),
    defaultValues: {
      userIds: [],
      skillIds: [],
      confirmationText: "",
    },
  })

  // Group assignments by user and skill for display
  const affectedUsers = Array.from(new Set(selectedAssignments.map((a) => a.userName)))
  const affectedSkills = Array.from(new Set(selectedAssignments.map((a) => a.skillName)))
  const totalAssignments = selectedAssignments.length

  const handleConfirm = async () => {
    const userIds = Array.from(new Set(selectedAssignments.map((a) => a.userId)))
    const skillIds = Array.from(new Set(selectedAssignments.map((a) => a.skillId)))

    const formData: UnassignSkillForm = {
      userIds,
      skillIds,
      confirmationText,
    }

    try {
      await onConfirm(formData)
      setConfirmationText("")
      onClose()
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  const isConfirmationValid = confirmationText.toUpperCase() === "UNASSIGN"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Confirm Skill Unassignment</span>
          </DialogTitle>
          <DialogDescription>
            This action will permanently remove the selected skill assignments. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Impact Summary */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Impact Summary:</strong> You are about to unassign {totalAssignments} skill assignment
              {totalAssignments !== 1 ? "s" : ""} affecting {affectedUsers.length} user
              {affectedUsers.length !== 1 ? "s" : ""} and {affectedSkills.length} skill
              {affectedSkills.length !== 1 ? "s" : ""}.
            </AlertDescription>
          </Alert>

          {/* Affected Users */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Affected Users ({affectedUsers.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {affectedUsers.map((userName) => (
                <Badge key={userName} variant="secondary" className="text-sm">
                  {userName}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Affected Skills */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Skills to be Unassigned ({affectedSkills.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {affectedSkills.map((skillName) => {
                const skill = selectedAssignments.find((a) => a.skillName === skillName)
                return (
                  <Badge
                    key={skillName}
                    variant={skill?.skillCategory === "technology" ? "default" : "outline"}
                    className={
                      skill?.skillCategory === "technology"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }
                  >
                    {skillName}
                  </Badge>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Detailed Assignment List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Assignment Details</h4>
            <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
              {selectedAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{assignment.userName}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-gray-700">{assignment.skillName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {assignment.rating}/5
                    </Badge>
                    <span className="text-xs text-gray-500">by {assignment.assignedByName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Type <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600 font-mono">UNASSIGN</code> to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type UNASSIGN to confirm"
              className={`${
                confirmationText && !isConfirmationValid ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {confirmationText && !isConfirmationValid && (
              <p className="text-sm text-red-600">Please type "UNASSIGN" exactly as shown.</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? "Unassigning..." : "Unassign Skills"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
