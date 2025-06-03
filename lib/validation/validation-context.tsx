"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback } from "react"
import { sectionSchemas, sectionNames } from "./validation-schema"

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationState {
  sectionErrors: Record<number, ValidationError[]>
  validationMode: "onChange" | "onBlur" | "onSubmit"
  isValidating: boolean
}

type ValidationAction =
  | { type: "SET_SECTION_ERRORS"; payload: { section: number; errors: ValidationError[] } }
  | { type: "CLEAR_SECTION_ERRORS"; payload: { section: number } }
  | { type: "CLEAR_ALL_ERRORS" }
  | { type: "SET_VALIDATION_MODE"; payload: { mode: "onChange" | "onBlur" | "onSubmit" } }
  | { type: "SET_VALIDATING"; payload: { isValidating: boolean } }

const initialState: ValidationState = {
  sectionErrors: {},
  validationMode: "onBlur",
  isValidating: false,
}

function validationReducer(state: ValidationState, action: ValidationAction): ValidationState {
  switch (action.type) {
    case "SET_SECTION_ERRORS":
      return {
        ...state,
        sectionErrors: {
          ...state.sectionErrors,
          [action.payload.section]: action.payload.errors,
        },
      }
    case "CLEAR_SECTION_ERRORS":
      const { [action.payload.section]: _, ...remainingErrors } = state.sectionErrors
      return {
        ...state,
        sectionErrors: remainingErrors,
      }
    case "CLEAR_ALL_ERRORS":
      return {
        ...state,
        sectionErrors: {},
      }
    case "SET_VALIDATION_MODE":
      return {
        ...state,
        validationMode: action.payload.mode,
      }
    case "SET_VALIDATING":
      return {
        ...state,
        isValidating: action.payload.isValidating,
      }
    default:
      return state
  }
}

interface ValidationContextType {
  state: ValidationState
  validateSection: (section: number, data: any) => Promise<boolean>
  validateAllSections: (data: any) => Promise<boolean>
  clearSectionErrors: (section: number) => void
  clearAllErrors: () => void
  getSectionErrors: (section: number) => ValidationError[]
  isSectionValid: (section: number) => boolean
  hasAnyErrors: () => boolean
  setValidationMode: (mode: "onChange" | "onBlur" | "onSubmit") => void
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined)

export function ValidationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(validationReducer, initialState)

  const validateSection = useCallback(async (section: number, data: any): Promise<boolean> => {
    dispatch({ type: "SET_VALIDATING", payload: { isValidating: true } })

    try {
      const schema = sectionSchemas[section as keyof typeof sectionSchemas]
      const sectionName = sectionNames[section as keyof typeof sectionNames]
      const sectionData = data[sectionName]

      if (!schema || !sectionData) {
        dispatch({ type: "SET_VALIDATING", payload: { isValidating: false } })
        return true
      }

      const result = schema.safeParse(sectionData)

      if (result.success) {
        dispatch({ type: "CLEAR_SECTION_ERRORS", payload: { section } })
        dispatch({ type: "SET_VALIDATING", payload: { isValidating: false } })
        return true
      } else {
        const errors: ValidationError[] = result.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        }))

        dispatch({ type: "SET_SECTION_ERRORS", payload: { section, errors } })
        dispatch({ type: "SET_VALIDATING", payload: { isValidating: false } })
        return false
      }
    } catch (error) {
      console.error("Validation error:", error)
      dispatch({ type: "SET_VALIDATING", payload: { isValidating: false } })
      return false
    }
  }, [])

  const validateAllSections = useCallback(
    async (data: any): Promise<boolean> => {
      dispatch({ type: "SET_VALIDATING", payload: { isValidating: true } })

      const validationPromises = Object.keys(sectionSchemas).map((sectionKey) => {
        const section = Number.parseInt(sectionKey)
        return validateSection(section, data)
      })

      const results = await Promise.all(validationPromises)
      const allValid = results.every((result) => result)

      dispatch({ type: "SET_VALIDATING", payload: { isValidating: false } })
      return allValid
    },
    [validateSection],
  )

  const clearSectionErrors = useCallback((section: number) => {
    dispatch({ type: "CLEAR_SECTION_ERRORS", payload: { section } })
  }, [])

  const clearAllErrors = useCallback(() => {
    dispatch({ type: "CLEAR_ALL_ERRORS" })
  }, [])

  const getSectionErrors = useCallback(
    (section: number): ValidationError[] => {
      return state.sectionErrors[section] || []
    },
    [state.sectionErrors],
  )

  const isSectionValid = useCallback(
    (section: number): boolean => {
      return !state.sectionErrors[section] || state.sectionErrors[section].length === 0
    },
    [state.sectionErrors],
  )

  const hasAnyErrors = useCallback((): boolean => {
    return Object.keys(state.sectionErrors).length > 0
  }, [state.sectionErrors])

  const setValidationMode = useCallback((mode: "onChange" | "onBlur" | "onSubmit") => {
    dispatch({ type: "SET_VALIDATION_MODE", payload: { mode } })
  }, [])

  const value: ValidationContextType = {
    state,
    validateSection,
    validateAllSections,
    clearSectionErrors,
    clearAllErrors,
    getSectionErrors,
    isSectionValid,
    hasAnyErrors,
    setValidationMode,
  }

  return <ValidationContext.Provider value={value}>{children}</ValidationContext.Provider>
}

export function useValidation() {
  const context = useContext(ValidationContext)
  if (context === undefined) {
    throw new Error("useValidation must be used within a ValidationProvider")
  }
  return context
}
