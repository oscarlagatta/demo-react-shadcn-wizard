import { useQuery } from "react-query"

const fetchTeams = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "platform-engineering", label: "Platform Engineering" },
    { value: "application-development", label: "Application Development" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "security", label: "Security" },
    { value: "data-analytics", label: "Data & Analytics" },
    { value: "australia-apps", label: "Australia Apps" },
  ]
}

const fetchAPSSupport = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "john-smith", label: "John Smith - Senior APS Manager" },
    { value: "sarah-johnson", label: "Sarah Johnson - APS Manager" },
    { value: "mike-chen", label: "Mike Chen - Lead APS Manager" },
    { value: "lisa-wong", label: "Lisa Wong - APS Manager" },
    { value: "david-brown", label: "David Brown - Senior APS Manager" },
    { value: "kumar-vipin", label: "Kumar, Vipin" },
  ]
}

const fetchAPSTechLeads = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { value: "alex-kumar", label: "Alex Kumar - Senior Technical Lead" },
    { value: "maria-garcia", label: "Maria Garcia - Technical Lead" },
    { value: "james-wilson", label: "James Wilson - Lead Technical Architect" },
    { value: "priya-patel", label: "Priya Patel - Senior Technical Lead" },
    { value: "robert-taylor", label: "Robert Taylor - Technical Lead" },
    { value: "mengupta-venkata", label: "Mengupta, Venkata Kumar" },
  ]
}

// Add these new hooks for autocomplete functionality
export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAPSSupport = () => {
  return useQuery({
    queryKey: ["aps-support"],
    queryFn: fetchAPSSupport,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAPSTechLeads = () => {
  return useQuery({
    queryKey: ["aps-tech-leads"],
    queryFn: fetchAPSTechLeads,
    staleTime: 5 * 60 * 1000,
  })
}
