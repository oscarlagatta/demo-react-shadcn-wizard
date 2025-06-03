// History Service - Data Management
export interface HistoryQueryParams {
  page: number
  limit: number
  filters: {
    searchQuery?: string
    actionType?: string
    dateRange?: string
    userId?: string
    section?: string
  }
}

export interface HistoryResponse {
  items: HistoryEntry[]
  total: number
}

export interface HistoryEntry {
  id: string
  timestamp: string
  actionType: string
  userId: string
  section: string
  description: string
  applicationId: string
  versionId: string
  details: any
}

export class HistoryService {
  private baseUrl = "/api/applications"

  async getHistory(applicationId: string, params: HistoryQueryParams): Promise<HistoryResponse> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.filters.searchQuery && { search: params.filters.searchQuery }),
      ...(params.filters.actionType && { actionType: params.filters.actionType }),
      ...(params.filters.dateRange && { dateRange: params.filters.dateRange }),
      ...(params.filters.userId && { userId: params.filters.userId }),
      ...(params.filters.section && { section: params.filters.section }),
    })

    const response = await fetch(`${this.baseUrl}/${applicationId}/history?${queryParams}`)

    if (!response.ok) {
      throw new Error("Failed to fetch history")
    }

    return response.json()
  }

  async revertToVersion(applicationId: string, historyEntryId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${applicationId}/revert/${historyEntryId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to revert to version")
    }
  }

  async exportHistory(applicationId: string, format: "csv" | "json" | "pdf"): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${applicationId}/history/export?format=${format}`)

    if (!response.ok) {
      throw new Error("Failed to export history")
    }

    return response.blob()
  }

  async createHistoryEntry(
    applicationId: string,
    entry: Omit<HistoryEntry, "id" | "timestamp">,
  ): Promise<HistoryEntry> {
    const response = await fetch(`${this.baseUrl}/${applicationId}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) {
      throw new Error("Failed to create history entry")
    }

    return response.json()
  }
}
