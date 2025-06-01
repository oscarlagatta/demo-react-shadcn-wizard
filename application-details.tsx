"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ApplicationDetailsPage() {
  const [expandedSections, setExpandedSections] = useState({
    applicationDetails: true,
    organizationAlignment: true,
    supportAlignment: true,
    other: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">100 - Account Analysis Receivables (AAR)</h1>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                APAC
              </Badge>
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                UCAL
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Back
            </Button>
            <Button variant="outline" size="sm">
              myCTO
            </Button>
            <Button variant="outline" size="sm">
              AppIQ
            </Button>
            <Button variant="outline" size="sm">
              Attest Record
            </Button>
            <Button variant="outline" size="sm">
              Transfer Ownership
            </Button>
            <Button size="sm">Edit</Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          <a href="#" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
            Application Detail
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Service & Function Alignment
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Additional Detail
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Resource Alignment
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Onboarding
          </a>
          <a href="#" className="py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
            Audit Logs
          </a>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Application Details Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("applicationDetails")}>
            <CardTitle className="flex items-center justify-between">
              <span>Application Details</span>
              {expandedSections.applicationDetails ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.applicationDetails && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shortName" className="flex items-center gap-2">
                    Short Name
                    <InfoTooltip content="Abbreviated name for the application" />
                  </Label>
                  <Input id="shortName" value="AAR" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center gap-2">
                    Region
                    <InfoTooltip content="Geographic region where the application operates" />
                  </Label>
                  <Input id="region" value="APAC, LATAM" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twoDot" className="flex items-center gap-2">
                    Two Dot
                    <InfoTooltip content="Two-level application categorization" />
                  </Label>
                  <Input id="twoDot" value="VM" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twoDotDesc" className="flex items-center gap-2">
                    Two Dot Desc
                    <InfoTooltip content="Description of the two-dot categorization" />
                  </Label>
                  <Input id="twoDotDesc" value="GCIB AND GTS TECH" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threeDot" className="flex items-center gap-2">
                    Three Dot
                    <InfoTooltip content="Three-level application categorization" />
                  </Label>
                  <Input id="threeDot" value="VMB" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threeDotDesc" className="flex items-center gap-2">
                    Three Dot Desc
                    <InfoTooltip content="Description of the three-dot categorization" />
                  </Label>
                  <Input id="threeDotDesc" value="GCIB AND GTS TECH" readOnly className="bg-gray-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description
                  <InfoTooltip content="Detailed description of the application functionality" />
                </Label>
                <Textarea
                  id="description"
                  value="Performs all billing and receivables functions for analyzed accounts. It provides a GUI interface for billed accounts to recognize income. Collections are done via direct debit of customer accounts or by checks remitted to Bank Physical Lockboxes."
                  readOnly
                  className="bg-gray-50 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rto" className="flex items-center gap-2">
                    RTO
                    <InfoTooltip content="Recovery Time Objective" />
                  </Label>
                  <Input
                    id="rto"
                    value="Tier 5: Greater than 24 hours, up to and including 48 hours"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpo" className="flex items-center gap-2">
                    RPO
                    <InfoTooltip content="Recovery Point Objective" />
                  </Label>
                  <Input
                    id="rpo"
                    value="Tier 5: Daily backup: Greater than 4 hours, up to and including 24 hours"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtoApprover" className="flex items-center gap-2">
                    RTO/RPO Approver
                    <InfoTooltip content="Person who approved the RTO/RPO settings" />
                  </Label>
                  <Input id="rtoApprover" value="Rodriguez, Maria C." readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtoApproveDate" className="flex items-center gap-2">
                    RTO/RPO Approve Date
                    <InfoTooltip content="Date when RTO/RPO was approved" />
                  </Label>
                  <Input id="rtoApproveDate" value="Sep 20, 2024, 6:24:51 AM" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usesMainframe" className="flex items-center gap-2">
                    Uses Mainframe
                    <InfoTooltip content="Whether the application uses mainframe technology" />
                  </Label>
                  <Select value="no" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationHosting" className="flex items-center gap-2">
                    Application Hosting
                    <InfoTooltip content="Where the application is hosted" />
                  </Label>
                  <Input
                    id="applicationHosting"
                    value="In-house (Hosted entirely inside the bank network)"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Organization Alignment Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("organizationAlignment")}>
            <CardTitle className="flex items-center justify-between">
              <span>Organization Alignment</span>
              {expandedSections.organizationAlignment ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.organizationAlignment && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="techExec" className="flex items-center gap-2">
                    Tech Exec
                    <InfoTooltip content="Technology Executive responsible for the application" />
                  </Label>
                  <Input id="techExec" value="Thompson, Sarah K." readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managementContact" className="flex items-center gap-2">
                    Management Contact
                    <InfoTooltip content="Primary management contact for the application" />
                  </Label>
                  <Input id="managementContact" value="Chen, Michael R." readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationManager" className="flex items-center gap-2">
                    Application Manager
                    <InfoTooltip content="Manager responsible for application operations" />
                  </Label>
                  <Input id="applicationManager" value="Williams, Jennifer L." readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="flex items-center gap-2">
                    Portfolio
                    <InfoTooltip content="Portfolio this application belongs to" />
                  </Label>
                  <Input id="portfolio" value="APAC" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioLead" className="flex items-center gap-2">
                    Portfolio Lead
                    <InfoTooltip content="Lead person for the portfolio" />
                  </Label>
                  <Input id="portfolioLead" value="Anderson, David M." readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team" className="flex items-center gap-2">
                    Team
                    <InfoTooltip content="Team responsible for the application" />
                  </Label>
                  <Input id="team" value="Australia Apps" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organisation" className="flex items-center gap-2">
                    Organisation
                    <InfoTooltip content="Organization unit" />
                  </Label>
                  <Input id="organisation" value="" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineOfBusiness" className="flex items-center gap-2">
                    Line Of Business
                    <InfoTooltip content="Business line this application supports" />
                  </Label>
                  <Input id="lineOfBusiness" value="" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aligningOrg" className="flex items-center gap-2">
                    Aligning Org
                    <InfoTooltip content="Aligning organization" />
                  </Label>
                  <Input id="aligningOrg" value="GCIB AND GTS TECH" readOnly className="bg-gray-50" />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Support Alignment Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("supportAlignment")}>
            <CardTitle className="flex items-center justify-between">
              <span>Support Alignment</span>
              {expandedSections.supportAlignment ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.supportAlignment && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apsSupport" className="flex items-center gap-2">
                    APS Support Manager
                    <InfoTooltip content="Application Production Support Manager" />
                  </Label>
                  <Input id="apsSupport" value="Kumar, Rajesh" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apsTechnicalLead" className="flex items-center gap-2">
                    APS Technical Lead
                    <InfoTooltip content="Technical lead for APS" />
                  </Label>
                  <Input id="apsTechnicalLead" value="Patel, Priya S." readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l2SupportGroup" className="flex items-center gap-2">
                    L2 Support Group
                    <InfoTooltip content="Level 2 support group identifier" />
                  </Label>
                  <Input id="l2SupportGroup" value="APPS-GWB-USTMR AAREC-US" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l2SupportContact" className="flex items-center gap-2">
                    L2 Support Contact
                    <InfoTooltip content="Level 2 support contact person" />
                  </Label>
                  <Input id="l2SupportContact" value="Martinez, Carlos" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bpsSupported" className="flex items-center gap-2">
                    BPS Supported
                    <InfoTooltip content="Business Process Support availability" />
                  </Label>
                  <Select value="yes" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportModel" className="flex items-center gap-2">
                    Support Model
                    <InfoTooltip content="Type of support model used" />
                  </Label>
                  <Select value="bps-24x7" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bps-24x7">BPS - 24x7</SelectItem>
                      <SelectItem value="bps-business-hours">BPS - Business Hours</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Other Section */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleSection("other")}>
            <CardTitle className="flex items-center justify-between">
              <span>Other</span>
              {expandedSections.other ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.other && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="updatedBy" className="flex items-center gap-2">
                    Updated By
                    <InfoTooltip content="Person who last updated this record" />
                  </Label>
                  <Input id="updatedBy" value="Kumar, Rajesh" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updatedDate" className="flex items-center gap-2">
                    Updated Date
                    <InfoTooltip content="Date when this record was last updated" />
                  </Label>
                  <Input id="updatedDate" value="Oct 30, 2024, 2:38:48 PM" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastAttestedDate" className="flex items-center gap-2">
                    Last Attested Date
                    <InfoTooltip content="Date when this record was last attested" />
                  </Label>
                  <Input id="lastAttestedDate" value="Oct 24, 2024, 10:25:31 AM" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attestedBy" className="flex items-center gap-2">
                    Attested By
                    <InfoTooltip content="Person who last attested this record" />
                  </Label>
                  <Input id="attestedBy" value="Kumar, Rajesh" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextDueAttestedDate" className="flex items-center gap-2">
                    Next Due Attested Date
                    <InfoTooltip content="Next date when attestation is due" />
                  </Label>
                  <Input id="nextDueAttestedDate" value="Mar 31, 2025, 12:00:00 AM" readOnly className="bg-gray-50" />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
