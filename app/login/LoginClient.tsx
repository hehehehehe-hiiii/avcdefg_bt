'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginClient() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [loginType, setLoginType] = useState<'user' | 'facebook'>('user')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [cookie, setCookie] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ')
            const t = setTimeout(() => setSuccess(''), 5000)
            return () => clearTimeout(t)
        }
    }, [searchParams])

    const handleUserLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch('/api/auth/login-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'เข้าสู่ระบบล้มเหลว')
            }

            localStorage.setItem('user_authenticated', 'true')
            localStorage.setItem('username', data.user.username)
            router.push('/groups')
        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาด')
        } finally {
            setLoading(false)
        }
    }

    const handleFacebookLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cookie,
                    access_token: accessToken,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'เข้าสู่ระบบล้มเหลว')
            }

            localStorage.setItem('fb_authenticated', 'true')
            router.push('/groups')
        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาด')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4 overflow-y-auto">
            <div className="glass-panel rounded-2xl p-8 w-full max-w-md border border-white/10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-white">เข้าสู่ระบบ</h1>
                    <p className="text-gray-400 text-sm">เลือกวิธีการเข้าสู่ระบบ</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
                    {['user', 'facebook'].map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setLoginType(t as any)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium ${loginType === t ? 'bg-white text-black' : 'text-gray-400'
                                }`}
                        >
                            {t === 'user' ? 'บัญชีผู้ใช้' : 'Facebook'}
                        </button>
                    ))}
                </div>

                {success && <div className="mb-4 text-green-400">{success}</div>}
                {error && <div className="mb-4 text-red-400">{error}</div>}

                {loginType === 'user' ? (
                    <form onSubmit={handleUserLogin} className="space-y-4">
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="ชื่อผู้ใช้"
                            required
                            className="w-full p-3 rounded-xl bg-white/5"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="รหัสผ่าน"
                            required
                            className="w-full p-3 rounded-xl bg-white/5"
                        />
                        <button disabled={loading} className="w-full bg-white text-black py-3 rounded-xl">
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFacebookLogin} className="space-y-4">
                        <textarea
                            value={cookie}
                            onChange={e => setCookie(e.target.value)}
                            placeholder="Facebook Cookie"
                            rows={4}
                            required
                            className="w-full p-3 rounded-xl bg-white/5"
                        />
                        <textarea
                            value={accessToken}
                            onChange={e => setAccessToken(e.target.value)}
                            placeholder="Access Token"
                            rows={3}
                            required
                            className="w-full p-3 rounded-xl bg-white/5"
                        />
                        <button disabled={loading} className="w-full bg-white text-black py-3 rounded-xl">
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
