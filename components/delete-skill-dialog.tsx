"use client"

import React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, Trash2, Users, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { deleteSkillSchema, type DeleteSkillForm, type Skill } from "@/lib/schemas"

interface DeleteSkillDialogProps {
  isOpen: boolean
  onClose: () => void
  skill: Skill | null
  onSkillDeleted: (skillId: string) => void
}

export function DeleteSkillDialog({ isOpen, onClose, skill, onSkillDeleted }: DeleteSkillDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DeleteSkillForm>({
    resolver: zodResolver(deleteSkillSchema),
    defaultValues: {
      skillId: skill?.id || "",
      confirmationText: "",
    },
  })

  const watchedConfirmationText = form.watch("confirmationText")

  // Check if confirmation text matches skill name
  const isConfirmationValid = skill && watchedConfirmationText.toLowerCase() === skill.name.toLowerCase()

  // Handle form submission
  const onSubmit = async (data: DeleteSkillForm) => {
    if (!skill) return

    if (!isConfirmationValid) {
      form.setError("confirmationText", {
        type: "manual",
        message: "Confirmation text must match the skill name exactly",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSkillDeleted(skill.id)

      toast({
        title: "Skill deleted successfully",
        description: `"${skill.name}" has been removed from the skill library.`,
      })

      // Reset form and close dialog
      form.reset()
      onClose()
    } catch (error) {
      toast({
        title: "Error deleting skill",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle dialog close
  const handleClose = () => {
    if (!isLoading) {
      form.reset()
      onClose()
    }
  }

  // Reset form when skill changes
  React.useEffect(() => {
    if (skill) {
      form.reset({
        skillId: skill.id,
        confirmationText: "",
      })
    }
  }, [skill, form])

  if (!skill) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <span>Delete Skill</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the skill from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Skill Information */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Skill Name:</label>
              <p className="text-lg font-semibold">{skill.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <div className="flex items-center space-x-2 mt-1">
                <div
                  className={`w-3 h-3 rounded-full ${skill.category === "technology" ? "bg-blue-500" : "bg-green-500"}`}
                ></div>
                <span>
                  {skill.category === "technology" ? "Technology Skills" : "Functional Knowledge / BAU Tasks"}
                </span>
              </div>
            </div>
            {skill.description && (
              <div>
                <label className="text-sm font-medium text-gray-700">Description:</label>
                <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
              </div>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Used by {skill.usageCount || 0} user(s)</span>
              </div>
              <Badge variant={skill.isSystemSkill ? "secondary" : "outline"}>
                {skill.isSystemSkill ? "System Skill" : "Custom Skill"}
              </Badge>
            </div>
          </div>

          {/* Warning for system skills */}
          {skill.isSystemSkill && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Warning:</strong> This is a system skill. Deleting it may affect existing user assignments and
                reports.
              </AlertDescription>
            </Alert>
          )}

          {/* Warning for skills in use */}
          {skill.usageCount > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Warning:</strong> This skill is currently assigned to {skill.usageCount} user(s). Deleting it
                will remove all associated skill assignments.
              </AlertDescription>
            </Alert>
          )}

          {/* Confirmation Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="confirmationText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <strong>"{skill.name}"</strong> to confirm deletion:
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Type "${skill.name}" here`}
                        {...field}
                        className={isConfirmationValid ? "border-green-300 focus:border-green-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex items-center justify-between">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isLoading || !isConfirmationValid}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Skill
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
