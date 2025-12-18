import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

class FacebookBot {
  protected config: any
  protected baseURL: string
  protected headers: any
  protected delay: number

  constructor() {
    this.config = this.loadConfig()
    this.baseURL = 'https://graph.facebook.com/v19.0'
    this.headers = {
      'Cookie': this.config.cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Content-Type': 'application/json'
    }
    this.delay = 200
  }

  private loadConfig() {
    try {
      const configPath = path.join(process.cwd(), 'config.json')
      const configData = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(configData)
    } catch (error: any) {
      console.error('❌ Error loading config file:', error.message)
      throw error
    }
  }

  async makeRequest(method: string, url: string, data: any = null, headers: any = null) {
    try {
      const config: any = {
        method,
        url,
        headers: headers || this.headers,
        timeout: 30000
      }

      if (data) {
        config.data = data
      }

      const response = await axios(config)
      return response.data
    } catch (error: any) {
      console.error('❌ Request failed:', error.message)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  }

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

class GroupFetcher extends FacebookBot {
  async getAllGroups(limit: number | null = null) {
    try {
      let allGroups: any[] = []
      let nextUrl: string | null =
        `${this.baseURL}/me/groups?access_token=${this.config.access_token}&fields=id,name,privacy,member_count,updated_time&limit=100`
      let pageCount = 0
      let totalFetched = 0

      while (nextUrl) {
        pageCount++
        console.log(`📄 Fetching page ${pageCount}...`)

        const response = await this.makeRequest('GET', nextUrl)

        if (response.data && response.data.length > 0) {
          allGroups = allGroups.concat(response.data)
          totalFetched = allGroups.length

          console.log(`📊 Progress: ${totalFetched} groups fetched`)

          if (limit && totalFetched >= limit) {
            allGroups = allGroups.slice(0, limit)
            console.log(`🎯 Limit reached: ${limit} groups`)
            break
          }

          if (response.paging && response.paging.next) {
            console.log(`⏱️ Waiting ${this.delay}ms...`)
            await this.sleep(this.delay)
            nextUrl = response.paging.next
          } else {
            nextUrl = null
          }
        } else {
          nextUrl = null
        }
      }

      // เรียงลำดับตามจำนวนสมาชิก (มากไปน้อย)
      const sortedGroups = allGroups.sort((a, b) => (b.member_count || 0) - (a.member_count || 0))

      // บันทึกไฟล์
      this.saveGroups(sortedGroups)

      return sortedGroups
    } catch (error: any) {
      console.error('❌ Error fetching groups:', error.message)
      throw error
    }
  }

  private saveGroups(groups: any[]) {
    try {
      const jsonData = groups.map((group, index) => ({
        rank: index + 1,
        id: group.id,
        name: group.name,
        privacy: group.privacy,
        member_count: group.member_count,
        updated_time: group.updated_time
      }))

      const jsonPath = path.join(process.cwd(), 'groups.json')
      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2))
      console.log('💾 Groups saved to groups.json')

      this.saveAsCSV(groups)
      this.saveGroupIds(groups)
    } catch (error: any) {
      console.error('❌ Error saving groups:', error.message)
    }
  }

  private saveAsCSV(groups: any[]) {
    try {
      const csvHeader = 'Rank,Group ID,Group Name,Privacy,Member Count,Last Updated\n'
      const csvRows = groups.map((group, index) =>
        `${index + 1},${group.id},"${group.name.replace(/"/g, '""')}",${group.privacy},${group.member_count},${group.updated_time}`
      ).join('\n')

      const csvContent = csvHeader + csvRows
      const csvPath = path.join(process.cwd(), 'groups.csv')
      fs.writeFileSync(csvPath, csvContent, 'utf8')
      console.log('💾 Groups saved to groups.csv')
    } catch (error: any) {
      console.error('❌ Error saving CSV:', error.message)
    }
  }

  private saveGroupIds(groups: any[]) {
    try {
      const ids = groups.map(group => group.id)
      const idsPath = path.join(process.cwd(), 'group_ids.txt')
      fs.writeFileSync(idsPath, ids.join('\n'))
      console.log('💾 Group IDs saved to group_ids.txt')
    } catch (error: any) {
      console.error('❌ Error saving group IDs:', error.message)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')
    const limitNum = limit ? parseInt(limit, 10) : null

    const fetcher = new GroupFetcher()
    const groups = await fetcher.getAllGroups(limitNum)

    // คำนวณสถิติ
    const total = groups.length
    const openGroups = groups.filter(g => g.privacy === 'OPEN').length
    const closedGroups = groups.filter(g => g.privacy === 'CLOSED').length
    const secretGroups = groups.filter(g => g.privacy === 'SECRET').length
    const totalMembers = groups.reduce((sum, group) => sum + (group.member_count || 0), 0)
    const avgMembers = Math.round(totalMembers / total)

    return NextResponse.json({
      success: true,
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
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}

