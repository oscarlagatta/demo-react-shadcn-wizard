# Data Persistence Strategy Analysis for Application Configuration Panel

## Overview

The Application Configuration Panel employs a **hybrid data persistence strategy** that combines server-side data management with client-side state management and form handling. The architecture is designed around React Query for server state management, React Hook Form for client-side form state, and a mock API layer that simulates real backend interactions.

## 1. Core Technologies and Libraries

### Primary Technologies

- **React Query (@tanstack/react-query)**: Server state management and caching
- **React Hook Form**: Client-side form state management and validation
- **Zod**: Schema validation and type safety
- **Mock API Functions**: Simulated backend operations


### Supporting Libraries

- **Zustand/Context API**: Implicit state management through React Query
- **Local Browser Cache**: React Query's built-in caching mechanism
- **TypeScript**: Type safety and data structure validation


## 2. Data Storage Mechanisms

### Server-Side Simulation

```typescript
// Mock API functions simulate real backend operations
const fetchConfiguration = async (applicationId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    applicationId: "100",
    applicationName: "Account Analysis Receivables (AAR)",
    // ... complete configuration object
  }
}

const saveConfiguration = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return { success: true, message: "Configuration saved successfully" }
}
```

### Client-Side Caching Strategy

```typescript
export const useConfiguration = (applicationId: string) => {
  return useQuery({
    queryKey: ["configuration", applicationId],
    queryFn: () => fetchConfiguration(applicationId),
    enabled: !!applicationId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}
```

## 3. Data Formats and Structure

### Primary Data Format: JSON

The application uses strongly-typed JSON objects with Zod schema validation:

```typescript
export const fullConfigurationSchema = applicationDetailsSchema
  .merge(organizationAlignmentSchema)
  .merge(supportAlignmentSchema)
  .merge(otherInformationSchema)

// Example data structure
{
  applicationId: "100",
  applicationName: "Account Analysis Receivables (AAR)",
  shortName: "AAR",
  region: ["apac-latam"],
  rto: "tier-5-24-48",
  rpo: "tier-5-daily-backup",
  // ... additional 30+ fields across all sections
}
```

### Schema-Driven Validation

Each section has its own schema that validates specific data types:

- **String validation**: Min/max length, required fields
- **Array validation**: Multi-select regions with minimum selections
- **Enum validation**: Dropdown selections with predefined values
- **Email validation**: Specific format validation for contact emails


## 4. Persistence Scope and Lifecycle

### Application-Wide Scope

- **Single Source of Truth**: One configuration object per application ID
- **Cross-Section Consistency**: All tabs share the same underlying data model
- **Global State Management**: React Query manages the global cache


### User Session Scope

- **Browser Session**: Data persists during browser session via React Query cache
- **Form State**: Unsaved changes maintained in React Hook Form state
- **Navigation Persistence**: Users can navigate between tabs without losing unsaved changes


## 5. Data Saving Frequency and Triggers

### On-Demand Saving Strategy

```typescript
const handleSave = async (data: FullConfigurationForm) => {
  try {
    await saveConfigurationMutation.mutateAsync(data)
    setIsEditMode(false)
    form.reset(data) // Reset form state to mark as clean
    toast({
      title: "Success",
      description: "Configuration saved successfully",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to save configuration. Please try again.",
      variant: "destructive",
    })
  }
}
```

### Save Triggers

1. **Manual Save**: User clicks "Save Changes" button
2. **Form Submission**: Form submit event triggers save operation
3. **No Auto-Save**: Deliberate choice to prevent accidental overwrites


### Change Detection

```typescript
// Tracks unsaved changes across all sections
const hasUnsavedChanges = form.formState.isDirty

// Warning system for unsaved changes
{hasUnsavedChanges && (
  <Alert className="mt-4 border-yellow-200 bg-yellow-50">
    <AlertCircle className="h-4 w-4 text-yellow-600" />
    <AlertDescription className="text-yellow-800">
      You have unsaved changes. Remember to save before leaving.
    </AlertDescription>
  </Alert>
)}
```

## 6. Tab-Specific Data Management

### Section 1: Application Details

- **Data Types**: Basic strings, arrays (regions), enums (RTO/RPO)
- **Validation**: Required fields, length limits, dropdown selections
- **Dependencies**: RTO/RPO options loaded from separate API calls
- **Persistence**: All changes tracked in single form state


### Section 2: Organization Alignment

- **Data Types**: Contact names, organizational hierarchies
- **Validation**: Required contact fields, organizational structure validation
- **Dependencies**: Organization and line-of-business options from predefined lists
- **Persistence**: Integrated with main configuration object


### Section 3: Support Alignment

- **Data Types**: Contact information, email addresses, support models
- **Validation**: Email format validation, required support contacts
- **Dependencies**: Support region and timezone options
- **Persistence**: Support escalation paths stored as text fields


### Section 4: Other Information

- **Data Types**: Read-only metadata fields
- **Validation**: No user input validation (read-only)
- **Dependencies**: System-generated timestamps and version information
- **Persistence**: Updated automatically by system, not user-editable


## 7. State Management Across Tabs

### Unified Form State

```typescript
const form = useForm<FullConfigurationForm>({
  resolver: zodResolver(fullConfigurationSchema),
  defaultValues: {
    // All 30+ fields initialized with default values
  },
})

// Single form state manages all tabs
const renderCurrentSection = () => {
  switch (currentSection) {
    case 0: return <ApplicationDetailsSection form={form} isEditMode={isEditMode} />
    case 1: return <OrganizationAlignmentSection form={form} isEditMode={isEditMode} />
    case 2: return <SupportAlignmentSection form={form} isEditMode={isEditMode} />
    case 3: return <OtherInformationSection form={form} isEditMode={isEditMode} />
  }
}
```

### Cross-Tab Data Consistency

- **Shared Form Instance**: All sections use the same form instance
- **Real-time Updates**: Changes in one section immediately available in others
- **Validation Scope**: Schema validation applies across all sections
- **Navigation Safety**: Users can switch tabs without losing changes


## 8. Data Security and Privacy Considerations

### Client-Side Security

- **Type Safety**: TypeScript and Zod prevent data corruption
- **Input Validation**: All user inputs validated before processing
- **XSS Prevention**: React's built-in XSS protection
- **No Sensitive Data Storage**: No passwords or sensitive data in client state


### Data Transmission Security

```typescript
// Simulated secure API calls
const saveConfiguration = async (data: any) => {
  // In real implementation, this would use HTTPS
  // and include authentication headers
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return { success: true, message: "Configuration saved successfully" }
}
```

### Privacy Considerations

- **User Consent**: No personal data stored without explicit user action
- **Data Minimization**: Only necessary configuration data persisted
- **Audit Trail**: System tracks who made changes and when
- **Access Control**: Edit mode prevents unauthorized modifications


## 9. Error Handling and Recovery

### Network Error Handling

```typescript
const { data: configurationData, isLoading, error } = useConfiguration(applicationId)

if (error) {
  return (
    <Alert variant="destructive" className="m-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Failed to load configuration. Please try again.</AlertDescription>
    </Alert>
  )
}
```

### Data Recovery Mechanisms

- **Automatic Retry**: React Query automatically retries failed requests
- **Cache Fallback**: Stale data served while fetching fresh data
- **Form State Preservation**: Unsaved changes preserved during navigation
- **User Notifications**: Toast notifications for save success/failure


## 10. Performance Optimizations

### Caching Strategy

```typescript
export const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}
```

### Lazy Loading

- **Section-Based Rendering**: Only current section rendered
- **Conditional API Calls**: Dropdown options loaded only when needed
- **Optimistic Updates**: UI updates immediately, syncs with server later


### Memory Management

- **Form State Cleanup**: Form state reset after successful save
- **Query Invalidation**: Stale data automatically refreshed
- **Component Unmounting**: Proper cleanup when components unmount


## 11. Future Scalability Considerations

### Database Integration Points

The current mock API structure is designed to easily integrate with real databases:

- **RESTful API Compatibility**: Mock functions mirror REST API patterns
- **GraphQL Ready**: Data structure supports GraphQL queries
- **Microservices Architecture**: Separate API calls for different data types


### Real-time Updates

The architecture supports future real-time features:

- **WebSocket Integration**: React Query supports real-time subscriptions
- **Optimistic Updates**: Already implemented for immediate UI feedback
- **Conflict Resolution**: Schema validation provides foundation for conflict handling


This comprehensive data persistence strategy ensures reliable, secure, and performant data management across all configuration panel tabs while maintaining flexibility for future enhancements and real backend integration.


# Comprehensive State Management and Data Persistence Strategy Analysis

## 1. Overall Architecture Overview

The Application Configuration Panel employs a **multi-layered state management architecture** that combines several complementary strategies:

```typescript
// Architecture Layers:
// 1. Server State Layer (React Query)
// 2. Form State Layer (React Hook Form)
// 3. UI State Layer (Local Component State)
// 4. Global State Layer (Implicit through React Query Cache)
```

## 2. Component-Level State Management Analysis

### 2.1 Main Panel Component (`ApplicationConfigurationPanel`)

#### Internal State Management

```typescript
export default function ApplicationConfigurationPanel() {
  // UI Navigation State
  const [currentSection, setCurrentSection] = useState(0)
  
  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Form State Management
  const form = useForm<FullConfigurationForm>({
    resolver: zodResolver(fullConfigurationSchema),
    defaultValues: {
      // 30+ fields with default values
    },
  })
  
  // Server State Management
  const { data: configurationData, isLoading, error } = useConfiguration(applicationId)
  const saveConfigurationMutation = useSaveConfiguration()
}
```

#### State Synchronization Mechanisms

```typescript
// Automatic Form Population from Server Data
useEffect(() => {
  if (configurationData) {
    form.reset(configurationData) // Syncs server data to form state
  }
}, [configurationData, form])

// Change Detection for Unsaved State
const hasUnsavedChanges = form.formState.isDirty

// State Persistence on Save
const handleSave = async (data: FullConfigurationForm) => {
  await saveConfigurationMutation.mutateAsync(data)
  form.reset(data) // Marks form as clean after successful save
}
```

### 2.2 Section Components State Management

#### Application Details Section

```typescript
export function ApplicationDetailsSection({ form, isEditMode }: ApplicationDetailsSectionProps) {
  // External Data Dependencies
  const { data: regions = [], isLoading: regionsLoading } = useRegions()
  const { data: rtoOptions = [], isLoading: rtoLoading } = useRto()
  const { data: rpoOptions = [], isLoading: rpoLoading } = useRpo()
  const { data: approvers = [], isLoading: approversLoading } = useRtoRpoApprovers()
  
  // No internal state - relies entirely on passed form instance
  // All state changes flow through the shared form object
}
```

#### Organization Alignment Section

```typescript
export function OrganizationAlignmentSection({ form, isEditMode }: OrganizationAlignmentSectionProps) {
  // Real-time State Watching for Summary Display
  const watchedValues = form.watch()
  
  // Dynamic Summary Updates
  return (
    <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div>
          <span className="font-medium text-green-700">Primary Organization:</span>
          <span className="text-green-600">
            {watchedValues.organization ? formatOrganizationName(watchedValues.organization) : "Not selected"}
          </span>
        </div>
      </div>
    </div>
  )
}
```

## 3. Data Flow and State Synchronization Patterns

### 3.1 Unidirectional Data Flow

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-r9ae{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-r9ae .error-icon{fill:#552222;}#mermaid-diagram-r9ae .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-r9ae .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-r9ae .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-r9ae .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-r9ae .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-r9ae .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-r9ae .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-r9ae .marker{fill:#666;stroke:#666;}#mermaid-diagram-r9ae .marker.cross{stroke:#666;}#mermaid-diagram-r9ae svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-r9ae p{margin:0;}#mermaid-diagram-r9ae .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-r9ae .cluster-label text{fill:#333;}#mermaid-diagram-r9ae .cluster-label span{color:#333;}#mermaid-diagram-r9ae .cluster-label span p{background-color:transparent;}#mermaid-diagram-r9ae .label text,#mermaid-diagram-r9ae span{fill:#000000;color:#000000;}#mermaid-diagram-r9ae .node rect,#mermaid-diagram-r9ae .node circle,#mermaid-diagram-r9ae .node ellipse,#mermaid-diagram-r9ae .node polygon,#mermaid-diagram-r9ae .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-r9ae .rough-node .label text,#mermaid-diagram-r9ae .node .label text{text-anchor:middle;}#mermaid-diagram-r9ae .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-r9ae .node .label{text-align:center;}#mermaid-diagram-r9ae .node.clickable{cursor:pointer;}#mermaid-diagram-r9ae .arrowheadPath{fill:#333333;}#mermaid-diagram-r9ae .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-r9ae .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-r9ae .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-r9ae .edgeLabel p{background-color:white;}#mermaid-diagram-r9ae .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-r9ae .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-r9ae .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-r9ae .cluster text{fill:#333;}#mermaid-diagram-r9ae .cluster span{color:#333;}#mermaid-diagram-r9ae div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-r9ae .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-r9ae .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-r9ae .marker,#mermaid-diagram-r9ae marker,#mermaid-diagram-r9ae marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-r9ae .label,#mermaid-diagram-r9ae text,#mermaid-diagram-r9ae text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-r9ae .background,#mermaid-diagram-r9ae rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-r9ae .entityBox,#mermaid-diagram-r9ae .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-r9ae .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-r9ae .label-container,#mermaid-diagram-r9ae rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-r9ae line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-r9ae :root{--mermaid-font-family:var(--font-geist-sans);}Server/APIReact Query CacheForm Default ValuesForm StateUI ComponentsUser InteractionsSave Mutation
```

### 3.2 State Synchronization Mechanisms

#### Cross-Section State Sharing

```typescript
// All sections share the same form instance
const renderCurrentSection = () => {
  const sharedProps = { form, isEditMode }
  
  switch (currentSection) {
    case 0: return <ApplicationDetailsSection {...sharedProps} />
    case 1: return <OrganizationAlignmentSection {...sharedProps} />
    case 2: return <SupportAlignmentSection {...sharedProps} />
    case 3: return <OtherInformationSection {...sharedProps} />
  }
}
```

#### Real-time Field Watching

```typescript
// Components can watch specific fields for real-time updates
const ApplicationDetailsSection = ({ form }) => {
  // Watch specific fields for summary display
  const rtoValue = form.watch("rto")
  const rpoValue = form.watch("rpo")
  const hostingValue = form.watch("applicationHosting")
  
  // Summary updates automatically when watched fields change
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div>RTO: {getRTODisplayValue(rtoValue)}</div>
        <div>RPO: {getRPODisplayValue(rpoValue)}</div>
        <div>Hosting: {getHostingDisplayValue(hostingValue)}</div>
      </div>
    </div>
  )
}
```

## 4. Data Persistence Strategy Deep Dive

### 4.1 Multi-Tier Persistence Architecture

#### Tier 1: Browser Memory (React Query Cache)

```typescript
// React Query Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})
```

#### Tier 2: Form State (React Hook Form)

```typescript
// Form state persists across navigation
const form = useForm<FullConfigurationForm>({
  mode: "onChange", // Validates on every change
  resolver: zodResolver(fullConfigurationSchema),
  defaultValues: {
    // Comprehensive default state
    applicationId: "",
    applicationName: "",
    // ... 30+ fields
  },
})
```

#### Tier 3: Server Persistence (Mock API)

```typescript
// Simulated server persistence with realistic delays
const saveConfiguration = async (data: FullConfigurationForm) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 2000))
  
  // Simulate server-side validation and processing
  if (!data.applicationId) {
    throw new Error("Application ID is required")
  }
  
  // Simulate successful save
  return {
    success: true,
    message: "Configuration saved successfully",
    timestamp: new Date().toISOString(),
    version: "v2.1.4" // Incremented version
  }
}
```

### 4.2 Data Format Specifications

#### Primary Data Structure (JSON)

```typescript
interface FullConfigurationForm {
  // Application Details (12 fields)
  applicationId: string
  applicationName: string
  shortName: string
  region: string[]
  twoDot: string
  twoDotDesc: string
  threeDot: string
  threeDotDesc: string
  description: string
  rto: string
  rpo: string
  rtoApprover: string
  rtoApproveDate: string
  usesMainframe: "yes" | "no" | "partial"
  applicationHosting: "in-house" | "cloud-public" | "cloud-private" | "hybrid" | "third-party"
  status: string
  
  // Organization Alignment (9 fields)
  techExec: string
  managementContact: string
  applicationManager: string
  portfolio: string
  portfolioLead: string
  team: string
  organization: string
  lineOfBusiness: string
  aligningOrg: string
  
  // Support Alignment (11 fields)
  apsSupport: string
  apsTechnicalLead: string
  l2SupportGroup: string
  l2SupportContact: string
  supportContact: string
  supportContactEmail: string
  bpsSupported: "yes" | "no" | "limited"
  supportModel: string
  escalationPath: string
  supportRegion: string
  supportTimezone: string
  
  // Other Information (8 fields)
  updatedBy: string
  updatedDate: string
  lastAttestedDate: string
  attestedBy: string
  nextDueAttestedDate: string
  createdBy: string
  createdDate: string
  version: string
}
```

#### Validation Schema Structure

```typescript
// Hierarchical validation with section-specific rules
export const applicationDetailsSchema = z.object({
  applicationName: z.string()
    .min(1, "Application name is required")
    .max(100, "Application name is too long"),
  shortName: z.string()
    .min(1, "Short name is required")
    .max(10, "Short name must be 10 characters or less"),
  region: z.array(z.string())
    .min(1, "At least one region must be selected"),
  // ... additional validation rules
})
```

### 4.3 Persistence Scope and Lifecycle

#### Application-Wide Scope

```typescript
// Single configuration per application ID
const useConfiguration = (applicationId: string) => {
  return useQuery({
    queryKey: ["configuration", applicationId], // Scoped by application ID
    queryFn: () => fetchConfiguration(applicationId),
    enabled: !!applicationId,
  })
}
```

#### Session-Based Persistence

```typescript
// Form state persists during browser session
const ApplicationConfigurationPanel = () => {
  // State survives component re-renders and navigation
  const form = useForm<FullConfigurationForm>({
    // Form state maintained until explicit reset or page refresh
  })
  
  // Navigation between sections preserves unsaved changes
  const handleSectionClick = (sectionIndex: number) => {
    // No state loss during navigation
    setCurrentSection(sectionIndex)
  }
}
```

## 5. State Management Adaptation to User Interactions

### 5.1 Edit Mode State Transitions

#### View Mode → Edit Mode

```typescript
const handleEditToggle = () => {
  if (isEditMode && hasUnsavedChanges) {
    // Protect against accidental data loss
    const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
    if (!confirmDiscard) return
    
    // Reset form to server state
    form.reset(configurationData)
  }
  setIsEditMode(!isEditMode)
}
```

#### Edit Mode → Save State

```typescript
const handleSave = async (data: FullConfigurationForm) => {
  try {
    // Optimistic UI update
    setIsEditMode(false)
    
    // Server persistence
    await saveConfigurationMutation.mutateAsync(data)
    
    // Sync form state with saved data
    form.reset(data)
    
    // User feedback
    toast({
      title: "Success",
      description: "Configuration saved successfully",
    })
  } catch (error) {
    // Rollback on error
    setIsEditMode(true)
    toast({
      title: "Error",
      description: "Failed to save configuration. Please try again.",
      variant: "destructive",
    })
  }
}
```

### 5.2 Navigation State Management

#### Section Navigation with State Preservation

```typescript
const handleSectionClick = (sectionIndex: number) => {
  // No validation required - form state preserved
  setCurrentSection(sectionIndex)
  
  // All sections share the same form instance
  // Changes made in one section are immediately available in others
}
```

#### Progress Tracking

```typescript
// Dynamic progress calculation
const progress = ((currentSection + 1) / configurationSections.length) * 100

// Visual progress indicators
<Progress value={progress} className="h-2" />
```

### 5.3 Field-Level State Management

#### Real-time Validation

```typescript
// Field-level validation on change
const form = useForm({
  mode: "onChange", // Validates immediately on field change
  resolver: zodResolver(fullConfigurationSchema),
})

// Conditional field rendering based on other field values
const ApplicationDetailsSection = ({ form }) => {
  const usesMainframe = form.watch("usesMainframe")
  
  return (
    <>
      <FormField name="usesMainframe" />
      {usesMainframe === "yes" && (
        <FormField name="mainframeDetails" />
      )}
    </>
  )
}
```

#### Dependent Field Updates

```typescript
// Multi-select regions affecting other fields
const handleRegionChange = (selectedRegions: string[]) => {
  form.setValue("region", selectedRegions)
  
  // Automatically update support region if only one region selected
  if (selectedRegions.length === 1) {
    form.setValue("supportRegion", selectedRegions[0])
  }
}
```

## 6. Error Handling and Recovery Strategies

### 6.1 Network Error Recovery

```typescript
const { data, isLoading, error, refetch } = useConfiguration(applicationId)

// Automatic retry with exponential backoff
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount < 3) {
          return Math.pow(2, failureCount) * 1000 // Exponential backoff
        }
        return false
      },
    },
  },
})
```

### 6.2 Form State Recovery

```typescript
// Preserve form state during errors
const handleSave = async (data: FullConfigurationForm) => {
  const originalEditMode = isEditMode
  
  try {
    await saveConfigurationMutation.mutateAsync(data)
  } catch (error) {
    // Restore previous state on error
    setIsEditMode(originalEditMode)
    
    // Form state automatically preserved by React Hook Form
    // User doesn't lose their changes
  }
}
```

### 6.3 Data Consistency Checks

```typescript
// Validate data consistency before save
const validateConsistency = (data: FullConfigurationForm) => {
  const errors: string[] = []
  
  // Cross-field validation
  if (data.supportRegion && !data.region.includes(data.supportRegion)) {
    errors.push("Support region must be one of the selected application regions")
  }
  
  // Business rule validation
  if (data.bpsSupported === "yes" && !data.supportModel.includes("bps")) {
    errors.push("BPS support requires a BPS support model")
  }
  
  return errors
}
```

## 7. Performance Optimization Strategies

### 7.1 Selective Re-rendering

```typescript
// Memoized section components to prevent unnecessary re-renders
const ApplicationDetailsSection = memo(({ form, isEditMode }) => {
  // Only re-renders when form or isEditMode changes
})

// Selective field watching to minimize re-renders
const watchedFields = form.watch(["rto", "rpo", "applicationHosting"])
```

### 7.2 Lazy Loading and Code Splitting

```typescript
// Lazy load section components
const ApplicationDetailsSection = lazy(() => import("./application-details-section"))
const OrganizationAlignmentSection = lazy(() => import("./organization-alignment-section"))

// Suspense boundaries for loading states
<Suspense fallback={<SectionLoadingSkeleton />}>
  {renderCurrentSection()}
</Suspense>
```

### 7.3 Optimistic Updates

```typescript
const useSaveConfiguration = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: saveConfiguration,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["configuration"] })
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(["configuration", newData.applicationId])
      
      // Optimistically update cache
      queryClient.setQueryData(["configuration", newData.applicationId], newData)
      
      return { previousData }
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["configuration", newData.applicationId],
        context?.previousData
      )
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["configuration"] })
    },
  })
}
```

## 8. Security and Data Integrity

### 8.1 Input Sanitization

```typescript
// Zod schema provides input sanitization
const applicationDetailsSchema = z.object({
  applicationName: z.string()
    .trim() // Remove whitespace
    .min(1, "Required")
    .max(100, "Too long")
    .regex(/^[a-zA-Z0-9\s\-_()]+$/, "Invalid characters"), // Sanitize input
})
```

### 8.2 State Validation

```typescript
// Validate state before persistence
const handleSave = async (data: FullConfigurationForm) => {
  // Client-side validation
  const validationResult = fullConfigurationSchema.safeParse(data)
  
  if (!validationResult.success) {
    toast({
      title: "Validation Error",
      description: "Please fix the errors before saving",
      variant: "destructive",
    })
    return
  }
  
  // Proceed with save
  await saveConfigurationMutation.mutateAsync(validationResult.data)
}
```

This comprehensive state management and data persistence strategy ensures robust, scalable, and user-friendly configuration management across all panel sections while maintaining data integrity and optimal performance.