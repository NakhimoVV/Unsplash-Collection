// app/api/test/route.ts

import { NextResponse } from 'next/server'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function GET() {
  try {
    const collections =
      await sql`SELECT * FROM collections ORDER BY created_at DESC`
    return NextResponse.json(collections)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 },
    )
  }
}
