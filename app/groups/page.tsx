'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Group {
  id: string
  name: string
  privacy: string
  member_count: number
  updated_time?: string
}

export default function GroupsPage() {
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPolling, setIsPolling] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // ตรวจสอบ authentication
    const isAuthenticated = localStorage.getItem('fb_authenticated')
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // ดึง groups ครั้งแรก
    fetchGroups()

    // ตั้งค่า polling ทุก 30 วินาที
    const interval = setInterval(() => {
      fetchGroups(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [router])

  const fetchGroups = async (silent = false) => {
    if (!silent) {
      setLoading(true)
    } else {
      setIsPolling(true)
    }
    setError('')

    try {
      const response = await fetch('/api/groups/realtime?limit=100')
      const data = await response.json()

      if (response.ok && data.success) {
        setGroups(data.groups || [])
        setLastUpdate(new Date())
      } else {
        setError(data.error || 'Failed to fetch groups')
        // ถ้า authentication failed ให้ redirect ไป login
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('fb_authenticated')
          router.push('/login')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
      setIsPolling(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('fb_authenticated')
    router.push('/login')
  }

  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'OPEN':
        return '🌐'
      case 'CLOSED':
        return '🔒'
      case 'SECRET':
        return '👥'
      default:
        return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-bg text-gray-300">
      {/* Header */}
      <header className="nav-glass sticky top-0 z-30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <div>
                <h1 className="text-xl font-semibold text-white">Facebook Groups</h1>
                {lastUpdate && (
                  <p className="text-xs text-gray-400">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                    {isPolling && <span className="ml-2 text-gold">🔄 Updating...</span>}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchGroups()}
                disabled={loading || isPolling}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
              >
                {loading || isPolling ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-sm font-medium text-red-400 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {loading && groups.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-gold mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400">Loading groups...</p>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No groups found</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">
                Total Groups: <span className="text-gold">{groups.length}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group, index) => (
                <div
                  key={group.id}
                  className="glass-panel rounded-xl p-4 border border-white/10 hover:border-gold/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getPrivacyIcon(group.privacy)}</span>
                        <h3 className="text-base font-semibold text-white group-hover:text-gold transition-colors line-clamp-2">
                          {group.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {formatMemberCount(group.member_count)} members
                        </span>
                        <span className="capitalize">{group.privacy.toLowerCase()}</span>
                      </div>
                    </div>
                    <div className="ml-2 text-xs text-gray-500 font-mono">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 font-mono">ID: {group.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

