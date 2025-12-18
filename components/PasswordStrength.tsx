'use client'

import { useMemo } from 'react'

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '', width: '0%' }

    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    }

    if (checks.length) score++
    if (checks.lowercase) score++
    if (checks.uppercase) score++
    if (checks.number) score++
    if (checks.special) score++

    if (score <= 2) {
      return { level: 1, label: 'อ่อนแอ', color: 'bg-red-500', width: '33%' }
    } else if (score <= 3) {
      return { level: 2, label: 'ปานกลาง', color: 'bg-yellow-500', width: '66%' }
    } else if (score <= 4) {
      return { level: 3, label: 'แข็งแรง', color: 'bg-blue-500', width: '100%' }
    } else {
      return { level: 4, label: 'แข็งแรงมาก', color: 'bg-green-500', width: '100%' }
    }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">ระดับความปลอดภัย:</span>
        <span className={`text-xs font-medium ${
          strength.level === 1 ? 'text-red-400' :
          strength.level === 2 ? 'text-yellow-400' :
          strength.level === 3 ? 'text-blue-400' :
          'text-green-400'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
          style={{ width: strength.width }}
        />
      </div>
    </div>
  )
}

