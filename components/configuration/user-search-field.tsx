"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserSearch } from "@/hooks/use-user-search"
import { UserInfoCard } from "@/components/ui/user-info-card"
import type { UseFormReturn } from "react-hook-form"
import type { FullConfigurationForm } from "@/lib/schemas/configuration"

interface UserSearchFieldProps {
  form: UseFormReturn<FullConfigurationForm>
  fieldName: keyof FullConfigurationForm
  label: string
  placeholder: string
  tooltip?: string
  isEditMode: boolean
  initialUserId?: string
  className?: string
}

/**
 * Reusable UserSearchField component that provides consistent user search functionality
 *
 * Features:
 * - Integrated search with dropdown
 * - User selection with form integration
 * - Loading states and empty states
 * - Consistent styling and behavior
 * - Accessibility support
 * - Edit mode support
 */
export function UserSearchField({
  form,
  fieldName,
  label,
  placeholder,
  tooltip,
  isEditMode,
  initialUserId,
  className = "",
}: UserSearchFieldProps) {
  const {
    search,
    setSearch,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedUser,
    availableUsers,
    isLoading,
    handleUserSelect,
    formatUserSummary,
  } = useUserSearch({
    form,
    fieldName,
    initialUserId,
  })

  return (
    <div className={`space-y-2 ${className}`}>
      <FormField
        control={form.control}
        name={fieldName as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-sm lg:text-base">
              {label}
              {tooltip && <InfoTooltip content={tooltip} />}
            </FormLabel>
            <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!isEditMode}
                    className={cn(
                      "w-full justify-between lg:h-10 xl:h-11",
                      !isEditMode && "bg-gray-50",
                      isEditMode && "focus:ring-2 focus:ring-purple-500",
                      !selectedUser && "text-muted-foreground",
                    )}
                  >
                    {selectedUser ? formatUserSummary(selectedUser) : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={search}
                    onValueChange={(value) => {
                      if (value.length > 2) {
                        setSearch(value)
                      }
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>{isLoading ? "Searching..." : `No ${label.toLowerCase()} found.`}</CommandEmpty>
                    <CommandGroup>
                      {availableUsers?.map((user) => (
                        <CommandItem key={user.nbId} value={user.fullName} onSelect={() => handleUserSelect(user.nbId)}>
                          <UserInfoCard user={user} />
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedUser?.nbId === user.nbId ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

// InfoTooltip component (if not already available)
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
