import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'smart-travel-assistant' 
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}