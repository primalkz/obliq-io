'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AuthShell from '../components/auth-shell'
import { inputCls, ErrorBox } from '../components/form-bits'
import { api } from '../lib'

export default function Register() {
  const router = useRouter()
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    const f = new FormData(e.currentTarget)
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          password: f.get('password'),
        }),
      })
      router.push('/dashboard')
    } catch (e: any) {
      setErr(e.message)
    }
  }

  return (
    <AuthShell title="Create your account" sub="Free for your first 5 clients.">
      <form onSubmit={submit} className="mt-6 space-y-4">
        <ErrorBox msg={err} />
        <label className="block text-sm font-medium">
          Your name
          <input name="name" required placeholder="Aarti Kumar" className={inputCls} />
        </label>
        <label className="block text-sm font-medium">
          Work email
          <input name="email" type="email" required placeholder="you@firm.in" className={inputCls} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="8+ characters"
            className={inputCls}
          />
        </label>
        <button className="btn-primary w-full">Try Obliq free</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-body">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent-blue">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
