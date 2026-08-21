'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AuthShell from '../components/auth-shell'
import { inputCls, ErrorBox } from '../components/form-bits'
import { api } from '../lib'

export default function Login() {
  const router = useRouter()
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    const f = new FormData(e.currentTarget)
    try {
      await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: f.get('email'), password: f.get('password') }),
      })
      router.push('/dashboard')
    } catch (e: any) {
      setErr(e.message)
    }
  }

  return (
    <AuthShell title="Welcome back" sub="Sign in to your firm's calendar.">
      <form onSubmit={submit} className="mt-6 space-y-4">
        <ErrorBox msg={err} />
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" required placeholder="you@firm.in" className={inputCls} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input name="password" type="password" required minLength={8} className={inputCls} />
        </label>
        <button className="btn-primary w-full">Sign in</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-body">
        New here?{' '}
        <Link href="/register" className="font-medium text-accent-blue">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
