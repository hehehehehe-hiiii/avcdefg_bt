import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import { createUser, initDatabase } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    // Initialize database
    await initDatabase()

    const body = await request.json()

    // Validate input
    const validated = registerSchema.parse(body)
    const { username, password } = validated

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await createUser(username, hashedPassword)

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    if (error.message === 'Username already exists') {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to register' },
      { status: 500 }
    )
  }
}

