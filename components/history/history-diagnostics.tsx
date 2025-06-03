import { Card, CardContent, Typography } from "@mui/material"
import { TroubleshootingGuide } from "./troubleshooting-guide"

const HistoryDiagnostics = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h6">History Diagnostics</Typography>
          <Typography variant="body1">This page provides diagnostic information about your browser history.</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Browser Environment</Typography>
          <Typography variant="body1">Information about your browser and operating system.</Typography>
          {/* Add browser environment details here */}
        </CardContent>
      </Card>

      <TroubleshootingGuide />
    </div>
  )
}

export default HistoryDiagnostics
