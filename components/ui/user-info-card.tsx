import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, User, Briefcase } from "lucide-react"

interface UserModel {
  nbId: string
  fullName: string
  titleName: string
  workEmail: string
  avatarUrl?: string
  cdsupervisorFullName?: string
}

interface UserInfoCardProps {
  user: UserModel
  className?: string
}

/**
 * UserInfoCard component for displaying user information in a consistent format
 *
 * Features:
 * - Avatar with fallback initials
 * - User name and title
 * - Work email with icon
 * - Supervisor information (if available)
 * - Responsive design
 * - Accessible markup
 */
export function UserInfoCard({ user, className = "" }: UserInfoCardProps) {
  // Generate initials from full name
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.fullName} />
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>

          <div className="flex-grow space-y-1">
            <h3 className="text-primary text-lg font-semibold">{user.fullName}</h3>

            <div className="text-muted-foreground flex items-center text-sm">
              <Briefcase className="mr-2 h-4 w-4" />
              <span>{user.titleName}</span>
            </div>

            <div className="text-muted-foreground flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4" />
              <span>{user.workEmail}</span>
            </div>

            {user.cdsupervisorFullName && (
              <div className="flex items-center text-sm">
                <User className="text-primary mr-2 h-4 w-4" />
                <span className="text-primary font-medium">Supervisor:</span>
                <Badge variant="secondary" className="ml-2">
                  {user.cdsupervisorFullName}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
