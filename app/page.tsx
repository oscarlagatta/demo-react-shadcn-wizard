"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ApplicationConfigurationPanel from "./application-configuration-panel"
import ServiceFunctionAlignment from "./service-function-alignment"
import AdditionalDetailPage from "./additional-detail"
import ResourceAlignmentPage from "./resource-alignment"

export default function BankingApplicationPage() {
  const [activeTab, setActiveTab] = useState("application-detail")

  const tabs = [
    { id: "application-detail", label: "Application Detail", active: true },
    { id: "service-function", label: "Service & Function Alignment", active: false },
    { id: "additional-detail", label: "Additional Detail", active: false },
    { id: "resource-alignment", label: "Resource Alignment", active: false },
    { id: "onboarding", label: "Onboarding", active: false },
    { id: "audit-logs", label: "Audit Logs", active: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              100 - Account Analysis Receivables (AAR)
            </h1>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                APAC
              </Badge>
              <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs">
                UCAL
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              Back
            </Button>
            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              myCTO
            </Button>
            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              AppIQ
            </Button>
            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              Attest Record
            </Button>
            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              Transfer Ownership
            </Button>
            <Button size="sm" className="text-xs lg:text-sm">
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Responsive */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4 lg:py-6">
        {activeTab === "application-detail" && <ApplicationConfigurationPanel />}
        {activeTab === "service-function" && <ServiceFunctionAlignment />}
        {activeTab === "additional-detail" && <AdditionalDetailPage />}
        {activeTab === "resource-alignment" && <ResourceAlignmentPage />}
        {activeTab !== "application-detail" &&
          activeTab !== "service-function" &&
          activeTab !== "additional-detail" &&
          activeTab !== "resource-alignment" && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="text-center py-8 lg:py-12">
                <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
                <p className="text-sm lg:text-base text-gray-600">
                  This section is not implemented in the configuration panel demo.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
