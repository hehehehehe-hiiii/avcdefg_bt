import { FacebookBot } from './facebook-bot'
import fs from 'fs'
import path from 'path'

type FacebookGroup = {
  id: string
  name: string
  privacy: 'OPEN' | 'CLOSED' | 'SECRET' | string
  member_count?: number
  updated_time?: string
}

type FacebookPaging = {
  next?: string
}

type FacebookResponse<T> = {
  data: T[]
  paging?: FacebookPaging
}

export class GroupFetcher extends FacebookBot {
  async getAllGroups(limit: number | null = null): Promise<FacebookGroup[]> {
    try {
      let allGroups: FacebookGroup[] = []

      let nextUrl: string | null =
        `${this.baseURL}/me/groups?access_token=${this.config.access_token}` +
        `&fields=id,name,privacy,member_count,updated_time&limit=100`

      let pageCount = 0
      let totalFetched = 0

      while (nextUrl !== null) {
        pageCount++
        console.log(`📄 Fetching page ${pageCount}...`)

        const response = await this.makeRequest(
          'GET',
          nextUrl
        ) as FacebookResponse<FacebookGroup>

        if (!response.data || response.data.length === 0) {
          break
        }

        allGroups.push(...response.data)
        totalFetched = allGroups.length

        console.log(`📊 Progress: ${totalFetched} groups fetched`)

        if (limit !== null && totalFetched >= limit) {
          allGroups = allGroups.slice(0, limit)
          console.log(`🎯 Limit reached: ${limit} groups`)
          break
        }

        if (response.paging?.next) {
          console.log(`⏱️ Waiting ${this.delay}ms...`)
          await this.sleep(this.delay)
          nextUrl = response.paging.next
        } else {
          nextUrl = null
        }
      }

      const sortedGroups = allGroups.sort(
        (a, b) => (b.member_count ?? 0) - (a.member_count ?? 0)
      )

      this.saveGroups(sortedGroups)

      return sortedGroups
    } catch (error: any) {
      console.error('❌ Error fetching groups:', error.message)
      throw error
    }
  }

  // =========================
  // Save Helpers
  // =========================

  private saveGroups(groups: FacebookGroup[]): void {
    try {
      const jsonData = groups.map((group, index) => ({
        rank: index + 1,
        id: group.id,
        name: group.name,
        privacy: group.privacy,
        member_count: group.member_count ?? 0,
        updated_time: group.updated_time ?? null
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

  private saveAsCSV(groups: FacebookGroup[]): void {
    try {
      const header = 'Rank,Group ID,Group Name,Privacy,Member Count,Last Updated\n'

      const rows = groups.map((group, index) => {
        const safeName = group.name.replace(/"/g, '""')
        return [
          index + 1,
          group.id,
          `"${safeName}"`,
          group.privacy,
          group.member_count ?? 0,
          group.updated_time ?? ''
        ].join(',')
      })

      const csvPath = path.join(process.cwd(), 'groups.csv')
      fs.writeFileSync(csvPath, header + rows.join('\n'), 'utf8')
      console.log('💾 Groups saved to groups.csv')
    } catch (error: any) {
      console.error('❌ Error saving CSV:', error.message)
    }
  }

  private saveGroupIds(groups: FacebookGroup[]): void {
    try {
      const idsPath = path.join(process.cwd(), 'group_ids.txt')
      fs.writeFileSync(
        idsPath,
        groups.map(g => g.id).join('\n'),
        'utf8'
      )
      console.log('💾 Group IDs saved to group_ids.txt')
    } catch (error: any) {
      console.error('❌ Error saving group IDs:', error.message)
    }
  }
}
