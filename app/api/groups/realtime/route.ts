export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { GroupFetcher } from '@/lib/group-fetcher'

interface Group {
  id: string
  name: string
  privacy: string
  member_count: number
  updated_time?: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')
    const limitNum = limit ? parseInt(limit, 10) : null

    const fetcher = new GroupFetcher()
    const groups = await fetcher.getAllGroups(limitNum) as Group[]

    const total = groups.length
    const openGroups = groups.filter(g => g.privacy === 'OPEN').length
    const closedGroups = groups.filter(g => g.privacy === 'CLOSED').length
    const secretGroups = groups.filter(g => g.privacy === 'SECRET').length
    const totalMembers = groups.reduce(
      (sum, group) => sum + (group.member_count || 0),
      0
    )
    const avgMembers = total > 0 ? Math.round(totalMembers / total) : 0

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      total,
      groups,
      statistics: {
        total,
        openGroups,
        closedGroups,
        secretGroups,
        totalMembers,
        avgMembers
      },
      topGroups: groups.slice(0, 5)
    })
  } catch (error: any) {
    console.error('Error fetching groups:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch groups',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
