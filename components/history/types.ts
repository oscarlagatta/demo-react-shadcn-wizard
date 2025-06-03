// History Data Types
export interface HistoryEntry {
  id: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  actionType: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "VIEW"
  section: "application_details" | "organization_alignment" | "support_alignment" | "resource_alignment" | "other"
  description: string
  changes?: FieldChange[]
  version: string
  metadata: {
    ipAddress: string
    userAgent: string
    sessionId: string
    requestId: string
  }
  rollbackData?: any
}

export interface FieldChange {
  field: string
  changeType: "ADDED" | "MODIFIED" | "REMOVED"
  oldValue: any
  newValue: any
  dataType: string
}

export interface HistoryFilters {
  searchQuery: string
  actionType: string | null
  dateRange: string | null
  userId: string | null
  section: string | null
}

export interface HistoryResponse {
  entries: HistoryEntry[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasMore: boolean
}

export interface HistoryQueryParams {
  page: number
  limit: number
  filters: HistoryFilters
}
