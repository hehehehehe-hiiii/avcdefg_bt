import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cookie, access_token } = body

    if (!cookie || !access_token) {
      return NextResponse.json(
        { error: 'Cookie and access token are required' },
        { status: 400 }
      )
    }

    // บันทึกข้อมูลลง config.json
    const configPath = path.join(process.cwd(), 'config.json')
    const configData = {
      cookie,
      access_token
    }

    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Login successful'
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save credentials' },
      { status: 500 }
    )
  }
}

