"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"

// Mock user data type - replace with your actual user type
interface UserModel {
  nbId: string
  fullName: string
  titleName: string
  workEmail: string
  avatarUrl?: string
  cdsupervisorFullName?: string
}

// Mock hook for fetching users - replace with your actual implementation
function useUsersData(searchTerm: string, initialSearchTerm: string) {
  return {
    data: [] as UserModel[],
    isLoading: false,
  }
}

interface UseUserSearchProps {
  form: UseFormReturn<FullConfigurationForm>
  fieldName: keyof FullConfigurationForm
  initialUserId?: string
}

interface UseUserSearchReturn {
  // Search state
  search: string
  setSearch: (search: string) => void

  // Dropdown state
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void

  // Selected user
  selectedUser: UserModel | null
  setSelectedUser: (user: UserModel | null) => void

  // Available users for search
  availableUsers: UserModel[]
  isLoading: boolean

  // Selection handler
  handleUserSelect: (nbId: string) => void

  // Formatted user summary
  formatUserSummary: (user: UserModel) => string
}

/**
 * Custom hook for managing user search functionality across form fields
 *
 * This hook provides a reusable solution for user search with the following features:
 * - Debounced search functionality
 * - Dropdown state management
 * - Form integration with automatic value setting
 * - Initial user loading from existing form values
 * - Consistent user selection handling
 *
 * @param form - React Hook Form instance
 * @param fieldName - The form field name to update when user is selected
 * @param initialUserId - Optional initial user ID to load on mount
 */
export function useUserSearch({ form, fieldName, initialUserId }: UseUserSearchProps): UseUserSearchReturn {
  // Search and dropdown state
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Get current form value for this field
  const currentFieldValue = form.getValues(fieldName as any)

  // Determine search term - use current field value if available, otherwise use search input
  const searchTerm = currentFieldValue || search || ""

  // Fetch users based on search term
  const { data: searchUsers = [], isLoading } = useUsersData(search, searchTerm)

  // Memoized available users list
  const availableUsers = useMemo(() => {
    if (initialUserId) {
      const initialUser = searchUsers?.find((user) => user.nbId === initialUserId)
      if (initialUser) {
        return [initialUser, ...searchUsers.filter((user) => user.nbId !== initialUserId)]
      }
    }
    return searchUsers
  }, [searchUsers, initialUserId])

  // Handle user selection
  const handleUserSelect = useCallback(
    (nbId: string) => {
      const user = availableUsers.find((u) => u.nbId === nbId)
      if (user) {
        // Update form value
        form.setValue(fieldName as any, user.nbId)

        // Update local state
        setSelectedUser(user)
        setIsDropdownOpen(false)

        // Clear search when user is selected
        setSearch("")
      }
    },
    [availableUsers, form, fieldName],
  )

  // Format user summary for display
  const formatUserSummary = useCallback((user: UserModel) => {
    return `${user.fullName} - ${user.titleName}`
  }, [])

  // Effect to load initial user when component mounts or initialUserId changes
  useEffect(() => {
    if (initialUserId && availableUsers.length > 0) {
      const initialUser = availableUsers.find((user) => user.nbId === initialUserId)
      if (initialUser) {
        setSelectedUser(initialUser)
      }
    }
  }, [availableUsers, initialUserId])

  return {
    search,
    setSearch,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedUser,
    setSelectedUser,
    availableUsers,
    isLoading,
    handleUserSelect,
    formatUserSummary,
  }
}
