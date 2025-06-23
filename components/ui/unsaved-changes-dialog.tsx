"use client"

import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UnsavedChangesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
  title?: string
  description?: string
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "Unsaved Changes",
  description = "You have unsaved changes that will be lost if you continue. Are you sure you want to proceed?",
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Keep Editing</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
