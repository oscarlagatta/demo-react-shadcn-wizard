"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Save, X, FileText, Users, Headphones, MapPin } from "lucide-react"
import { toast } from "sonner"

import { ApplicationDetailsSection } from "@/components/configuration/application-details-section"
import { OrganizationAlignmentSection } from "@/components/configuration/organization-alignment-section"
import { SupportAlignmentSection } from "@/components/configuration/support-alignment-section"
import { OtherInformationSection } from "@/components/configuration/other-information-section"

import { useConfiguration, useSaveConfiguration } from "@/lib/hooks/use-configuration-data"
import { fullConfigurationSchema, type FullConfigurationForm } from "@/lib/schemas/configuration"

interface ApplicationConfigurationPanelProps {
  applicationId: string
}

export default function ApplicationConfigurationPanel({ applicationId }: ApplicationConfigurationPanelProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState("application-details")

  const { data: configuration, isLoading, error } = useConfiguration(applicationId)
  const saveConfigurationMutation = useSaveConfiguration()

  const form = useForm<FullConfigurationForm>({
    resolver: zodResolver(fullConfigurationSchema),
    defaultValues: configuration,
    values: configuration, // This ensures form updates when data loads
  })

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancel = () => {
    setIsEditMode(false)
    form.reset(configuration) // Reset to original values
  }

  const handleSave = async (data: FullConfigurationForm) => {
    try {
      await saveConfigurationMutation.mutateAsync(data)
      setIsEditMode(false)
      toast.success("Configuration saved successfully")
    } catch (error) {
      toast.error("Failed to save configuration")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load configuration</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl lg:text-2xl xl:text-3xl">Application Configuration</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Manage application settings, organizational alignment, and support configuration
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs lg:text-sm">
                ID: {configuration?.applicationId}
              </Badge>
              <Badge
                variant={configuration?.status === "In Production" ? "default" : "secondary"}
                className="text-xs lg:text-sm"
              >
                {configuration?.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        {!isEditMode ? (
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Configuration
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
              disabled={saveConfigurationMutation.isPending}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(handleSave)}
              className="flex items-center gap-2"
              disabled={saveConfigurationMutation.isPending}
            >
              <Save className="h-4 w-4" />
              {saveConfigurationMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Configuration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
                    <TabsTrigger
                      value="application-details"
                      className="flex items-center gap-2 py-3 px-4 text-xs lg:text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Application Details</span>
                      <span className="sm:hidden">Details</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="organization-alignment"
                      className="flex items-center gap-2 py-3 px-4 text-xs lg:text-sm"
                    >
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Organization</span>
                      <span className="sm:hidden">Org</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="support-alignment"
                      className="flex items-center gap-2 py-3 px-4 text-xs lg:text-sm"
                    >
                      <Headphones className="h-4 w-4" />
                      <span className="hidden sm:inline">Support</span>
                      <span className="sm:hidden">Support</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="other-information"
                      className="flex items-center gap-2 py-3 px-4 text-xs lg:text-sm"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">Other Info</span>
                      <span className="sm:hidden">Other</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 lg:p-8">
                  <TabsContent value="application-details" className="mt-0">
                    <ApplicationDetailsSection form={form} isEditMode={isEditMode} />
                  </TabsContent>

                  <TabsContent value="organization-alignment" className="mt-0">
                    <OrganizationAlignmentSection form={form} isEditMode={isEditMode} />
                  </TabsContent>

                  <TabsContent value="support-alignment" className="mt-0">
                    <SupportAlignmentSection form={form} isEditMode={isEditMode} />
                  </TabsContent>

                  <TabsContent value="other-information" className="mt-0">
                    <OtherInformationSection form={form} isEditMode={isEditMode} />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Footer Information */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs lg:text-sm text-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Last Updated: {configuration?.updatedDate}</span>
              <Separator orientation="vertical" className="hidden sm:block h-4" />
              <span>Updated By: {configuration?.updatedBy}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Version: {configuration?.version}</span>
              <Separator orientation="vertical" className="hidden sm:block h-4" />
              <span>Next Attestation: {configuration?.nextDueAttestedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
