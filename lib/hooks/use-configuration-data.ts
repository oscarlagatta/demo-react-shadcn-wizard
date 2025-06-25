import { useQuery } from "react-query"

// Add these new hooks for autocomplete functionality
export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        { value: "platform-engineering", label: "Platform Engineering" },
        { value: "application-development", label: "Application Development" },
        { value: "infrastructure", label: "Infrastructure" },
        { value: "security", label: "Security" },
        { value: "data-analytics", label: "Data & Analytics" },
      ]
    },
  })
}

export function useAPSSupport() {
  return useQuery({
    queryKey: ["aps-support"],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        { value: "john-smith", label: "John Smith - Senior APS Manager" },
        { value: "sarah-johnson", label: "Sarah Johnson - APS Manager" },
        { value: "mike-chen", label: "Mike Chen - Lead APS Manager" },
        { value: "lisa-wong", label: "Lisa Wong - APS Manager" },
        { value: "david-brown", label: "David Brown - Senior APS Manager" },
      ]
    },
  })
}

export function useAPSTechLeads() {
  return useQuery({
    queryKey: ["aps-tech-leads"],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return [
        { value: "alex-kumar", label: "Alex Kumar - Senior Technical Lead" },
        { value: "maria-garcia", label: "Maria Garcia - Technical Lead" },
        { value: "james-wilson", label: "James Wilson - Lead Technical Architect" },
        { value: "priya-patel", label: "Priya Patel - Senior Technical Lead" },
        { value: "robert-taylor", label: "Robert Taylor - Technical Lead" },
      ]
    },
  })
}
