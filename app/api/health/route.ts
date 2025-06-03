import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "application-details-api",
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
