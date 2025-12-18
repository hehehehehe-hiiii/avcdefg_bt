'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingScreen from '@/components/LoadingScreen'

export default function Home() {
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Check authentication after loading
    const checkAuth = () => {
      const userAuth = localStorage.getItem('user_authenticated')
      const fbAuth = localStorage.getItem('fb_authenticated')
      
      if (userAuth || fbAuth) {
        router.push('/groups')
      } else {
        router.push('/login')
      }
    }

    // Show loading for at least 2 seconds
    const timer = setTimeout(() => {
      setShowLoading(false)
      checkAuth()
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />
  }

  return null
}
