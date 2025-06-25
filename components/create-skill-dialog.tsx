"use client"

import React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createSkillSchema, type CreateSkillForm, type Skill } from "@/lib/schemas"

interface CreateSkillDialogProps {
  isOpen: boolean
  onClose: () => void
  onSkillCreated: (skill: Skill) => void
  existingSkills: Skill[]
  initialSkillName?: string
  initialCategory?: "technology" | "functional"
}

export function CreateSkillDialog({
  isOpen,
  onClose,
  onSkillCreated,
  existingSkills,
  initialSkillName = "",
  initialCategory,
}: CreateSkillDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [similarSkills, setSimilarSkills] = useState<Skill[]>([])

  const form = useForm<CreateSkillForm>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: initialSkillName,
      category: initialCategory || "technology",
      description: "",
    },
  })

  const watchedName = form.watch("name")
  const watchedCategory = form.watch("category")

  // Normalize skill name for comparison
  const normalizeSkillName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim()
  }

  // Check for similar skills
  const checkSimilarSkills = (name: string, category: "technology" | "functional") => {
    if (!name || name.length < 2) {
      setSimilarSkills([])
      return
    }

    const normalizedInput = normalizeSkillName(name)
    const similar = existingSkills.filter((skill) => {
      const normalizedSkill = normalizeSkillName(skill.name)

      // Exact match in same category
      if (normalizedSkill === normalizedInput && skill.category === category) {
        return true
      }

      // Partial match (contains or is contained)
      if (normalizedSkill.includes(normalizedInput) || normalizedInput.includes(normalizedSkill)) {
        return true
      }

      // Levenshtein distance for fuzzy matching
      const distance = levenshteinDistance(normalizedSkill, normalizedInput)
      const maxLength = Math.max(normalizedSkill.length, normalizedInput.length)
      const similarity = 1 - distance / maxLength

      return similarity > 0.7 // 70% similarity threshold
    })

    setSimilarSkills(similar.slice(0, 5)) // Limit to 5 suggestions
  }

  // Simple Levenshtein distance implementation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Check for duplicates and similar skills when name or category changes
  React.useEffect(() => {
    if (watchedName && watchedCategory) {
      checkSimilarSkills(watchedName, watchedCategory)
    }
  }, [watchedName, watchedCategory])

  // Check if skill already exists
  const isDuplicate = () => {
    const normalizedInput = normalizeSkillName(watchedName)
    return existingSkills.some(
      (skill) => normalizeSkillName(skill.name) === normalizedInput && skill.category === watchedCategory,
    )
  }

  // Handle form submission
  const onSubmit = async (data: CreateSkillForm) => {
    // Check for exact duplicates
    if (isDuplicate()) {
      form.setError("name", {
        type: "manual",
        message: "A skill with this name already exists in the selected category",
      })
      return
    }

    // Show confirmation if there are similar skills
    if (similarSkills.length > 0 && !showConfirmation) {
      setShowConfirmation(true)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new skill
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: data.name.trim(),
        canonicalName: normalizeSkillName(data.name),
        category: data.category,
        description: data.description?.trim() || undefined,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: "current-user", // In real app, this would be the current user
      }

      onSkillCreated(newSkill)

      toast({
        title: "Skill created successfully",
        description: `"${newSkill.name}" has been added to ${
          newSkill.category === "technology" ? "Technology Skills" : "Functional Knowledge"
        }.`,
      })

      // Reset form and close dialog
      form.reset()
      setShowConfirmation(false)
      setSimilarSkills([])
      onClose()
    } catch (error) {
      toast({
        title: "Error creating skill",
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
      setShowConfirmation(false)
      setSimilarSkills([])
      onClose()
    }
  }

  // Handle confirmation step
  const handleConfirmCreate = () => {
    setShowConfirmation(false)
    form.handleSubmit(onSubmit)()
  }

  // Reset confirmation when going back
  const handleBackToForm = () => {
    setShowConfirmation(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <span>Create New Skill</span>
              </DialogTitle>
              <DialogDescription>
                Add a new skill to the capability matrix. This skill will be available for assignment to all users.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., JavaScript, Customer Support, SQL"
                          {...field}
                          className={isDuplicate() ? "border-red-300 focus:border-red-500" : ""}
                        />
                      </FormControl>
                      <FormDescription>Enter a clear, descriptive name for the skill (2-50 characters)</FormDescription>
                      <FormMessage />
                      {isDuplicate() && (
                        <p className="text-sm text-red-600 mt-1">This skill already exists in the selected category</p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span>Technology Skills</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="functional">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>Functional Knowledge / BAU Tasks</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the appropriate category for this skill</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide additional context or details about this skill..."
                          className="h-20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add a brief description to help users understand this skill (max 200 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Similar Skills Warning */}
                {similarSkills.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <div className="space-y-2">
                        <p className="font-medium">Similar skills found:</p>
                        <div className="flex flex-wrap gap-1">
                          {similarSkills.map((skill) => (
                            <Badge
                              key={skill.id}
                              variant="outline"
                              className={
                                skill.category === "technology"
                                  ? "border-blue-300 text-blue-700"
                                  : "border-green-300 text-green-700"
                              }
                            >
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm">Consider using an existing skill or proceed to create a new one.</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <DialogFooter className="flex items-center justify-between">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isDuplicate() || !form.formState.isValid}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : similarSkills.length > 0 ? (
                      "Create Anyway"
                    ) : (
                      "Create Skill"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <span>Confirm Skill Creation</span>
              </DialogTitle>
              <DialogDescription>Please review the details before creating this new skill.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Skill Preview */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Skill Name:</label>
                  <p className="text-lg font-semibold">{form.getValues("name")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        form.getValues("category") === "technology" ? "bg-blue-500" : "bg-green-500"
                      }`}
                    ></div>
                    <span>
                      {form.getValues("category") === "technology"
                        ? "Technology Skills"
                        : "Functional Knowledge / BAU Tasks"}
                    </span>
                  </div>
                </div>
                {form.getValues("description") && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description:</label>
                    <p className="text-sm text-gray-600 mt-1">{form.getValues("description")}</p>
                  </div>
                )}
              </div>

              {/* Similar Skills Warning */}
              {similarSkills.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="space-y-2">
                      <p className="font-medium">
                        {similarSkills.length} similar skill{similarSkills.length > 1 ? "s" : ""} found:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {similarSkills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className={
                              skill.category === "technology"
                                ? "border-blue-300 text-blue-700"
                                : "border-green-300 text-green-700"
                            }
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm">
                        Are you sure you want to create "{form.getValues("name")}" as a new skill?
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={handleBackToForm} disabled={isLoading}>
                Back to Edit
              </Button>
              <Button onClick={handleConfirmCreate} disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Confirm & Create"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
