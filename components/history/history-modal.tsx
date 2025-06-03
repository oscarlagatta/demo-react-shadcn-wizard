"use client"

import { useState, useEffect } from "react"
import { Clock, FileText, Filter, Search, ChevronDown, ChevronRight, Eye, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

// Mock data for demonstration
const mockHistoryEntries = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    user: {
      name: "Kumar, Rajesh",
      avatar: "",
    },
    actionType: "UPDATE",
    section: "application_details",
    description: "Updated RTO value from Tier 4 to Tier 5",
    changes: [
      {
        field: "RTO",
        changeType: "MODIFIED",
        oldValue: "Tier 4: Greater than 12 hours, up to and including 24 hours",
        newValue: "Tier 5: Greater than 24 hours, up to and including 48 hours",
      },
    ],
    metadata: {
      ipAddress: "192.168.1.100",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      sessionId: "sess_12345abcde",
    },
    version: "7.2.1",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: {
      name: "Chen, Michael R.",
      avatar: "",
    },
    actionType: "CREATE",
    section: "support_alignment",
    description: "Added new L2 Support Contact",
    changes: [
      {
        field: "L2 Support Contact",
        changeType: "ADDED",
        oldValue: "",
        newValue: "Martinez, Carlos",
      },
    ],
    metadata: {
      ipAddress: "192.168.1.101",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
      sessionId: "sess_67890fghij",
    },
    version: "7.1.0",
  },
]

interface HistoryModalProps {
  applicationId: string
}

export function HistoryModal({ applicationId }: HistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [historyEntries, setHistoryEntries] = useState(mockHistoryEntries)
  const [loading, setLoading] = useState(false)
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [currentPage] = useState(1)
  const [totalPages] = useState(1)

  useEffect(() => {
    if (isOpen) {
      // In a real implementation, this would fetch data from an API
      setLoading(true)
      setTimeout(() => {
        setHistoryEntries(mockHistoryEntries)
        setLoading(false)
      }, 500)
    }
  }, [isOpen])

  const toggleEntryExpansion = (entryId: string) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId)
    } else {
      newExpanded.add(entryId)
    }
    setExpandedEntries(newExpanded)
  }

  const handleRevert = async (entryId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Successfully reverted to previous version", {
        description: "The application has been updated to reflect the selected version.",
      })
    } catch (error) {
      toast.error("Failed to revert", {
        description: "An error occurred while attempting to revert to the selected version.",
      })
    }
  }

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      case "APPROVE":
        return "bg-purple-100 text-purple-800"
      case "REJECT":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="history-button"
          data-testid="view-history-button"
          onClick={() => console.log("History button clicked")}
        >
          <Clock className="h-4 w-4 mr-2" />
          View History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application History - AAR (Account Analysis Receivables)
          </DialogTitle>
        </DialogHeader>

        {/* Filters Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search changes..." className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Action Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="APPROVE">Approve</SelectItem>
                    <SelectItem value="REJECT">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>
                    <SelectItem value="application_details">Application Details</SelectItem>
                    <SelectItem value="organization_alignment">Organization Alignment</SelectItem>
                    <SelectItem value="support_alignment">Support Alignment</SelectItem>
                    <SelectItem value="resource_alignment">Resource Alignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="quarter">This quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Timeline */}
        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : historyEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No history entries found</p>
              </div>
            ) : (
              historyEntries.map((entry, index) => {
                const timestamp = formatTimestamp(entry.timestamp)
                const isExpanded = expandedEntries.has(entry.id)

                return (
                  <Card key={entry.id} className="relative">
                    {/* Timeline connector */}
                    {index < historyEntries.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200 z-0"></div>
                    )}

                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar and timeline dot */}
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={entry.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {entry.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{entry.user.name}</span>
                              <Badge className={getActionTypeColor(entry.actionType)}>
                                {entry.actionType.toLowerCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {entry.section.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span>{timestamp.relative}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {timestamp.date} at {timestamp.time}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">{entry.description}</p>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleEntryExpansion(entry.id)}
                                  className="h-8 px-2"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-1" />
                                  )}
                                  View Details
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>

                            {entry.actionType !== "CREATE" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRevert(entry.id)}
                                className="h-8 px-2 text-orange-600 hover:text-orange-700"
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Revert
                              </Button>
                            )}

                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View Version
                            </Button>
                          </div>

                          {/* Expandable details */}
                          <Collapsible open={isExpanded}>
                            <CollapsibleContent className="mt-4">
                              <Card className="bg-gray-50">
                                <CardContent className="p-4">
                                  <div className="space-y-4">
                                    {/* Field changes */}
                                    {entry.changes && entry.changes.length > 0 && (
                                      <div>
                                        <h4 className="font-medium text-sm mb-2">Field Changes:</h4>
                                        <div className="space-y-2">
                                          {entry.changes.map((change, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded border">
                                              <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">{change.field}</span>
                                                <Badge variant="outline" className="text-xs">
                                                  {change.changeType}
                                                </Badge>
                                              </div>
                                              <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                  <span className="text-gray-500">Previous:</span>
                                                  <div className="bg-red-50 p-2 rounded mt-1 font-mono text-xs">
                                                    {change.oldValue || "—"}
                                                  </div>
                                                </div>
                                                <div>
                                                  <span className="text-gray-500">Current:</span>
                                                  <div className="bg-green-50 p-2 rounded mt-1 font-mono text-xs">
                                                    {change.newValue || "—"}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Metadata */}
                                    <div>
                                      <h4 className="font-medium text-sm mb-2">Metadata:</h4>
                                      <div className="bg-white p-3 rounded border">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="text-gray-500">IP Address:</span>
                                            <p className="font-mono">{entry.metadata.ipAddress}</p>
                                          </div>
                                          <div>
                                            <span className="text-gray-500">User Agent:</span>
                                            <p className="font-mono text-xs truncate">{entry.metadata.userAgent}</p>
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Session ID:</span>
                                            <p className="font-mono text-xs">{entry.metadata.sessionId}</p>
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Version:</span>
                                            <p className="font-mono">{entry.version}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
