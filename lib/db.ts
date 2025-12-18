import { sql } from '@vercel/postgres'

// Initialize database connection
if (!process.env.POSTGRES_URL) {
  console.warn('⚠️ POSTGRES_URL is not set. Database features will not work.')
}

export async function initDatabase() {
  try {
    // สร้างตาราง users ถ้ายังไม่มี
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Database initialized')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}

export async function createUser(username: string, hashedPassword: string) {
  try {
    const result = await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
      RETURNING id, username, created_at
    `
    return result.rows[0]
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('Username already exists')
    }
    throw error
  }
}

export async function getUserByUsername(username: string) {
  try {
    const result = await sql`
      SELECT id, username, password, created_at
      FROM users
      WHERE username = ${username}
    `
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

