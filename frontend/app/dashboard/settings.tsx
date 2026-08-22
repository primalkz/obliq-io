'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { inputCls, ErrorBox } from '../components/form-bits'
import { api } from '../lib'

export default function SettingsView({
  me,
  setMe,
}: {
  me: { name: string; email: string } | null
  setMe: (u: { name: string; email: string }) => void
}) {
  const router = useRouter()
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileErr('')
    setProfileMsg('')
    const f = new FormData(e.currentTarget)
    try {
      const u = await api('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: f.get('name'), email: f.get('email') }),
      })
      setMe(u)
      setProfileMsg('saved')
    } catch (e: any) {
      setProfileErr(e.message)
    }
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPwErr('')
    setPwMsg('')
    const form = e.currentTarget
    const f = new FormData(form)
    try {
      await api('/auth/me/password', {
        method: 'PUT',
        body: JSON.stringify({ current: f.get('current'), password: f.get('password') }),
      })
      form.reset()
      setPwMsg('password updated')
    } catch (e: any) {
      setPwErr(e.message)
    }
  }

  async function deleteAccount() {
    if (!confirm('this deletes your account and every client and filing under it. sure?')) return
    await api('/auth/me', { method: 'DELETE' })
    router.push('/')
  }

  return (
    <>
      <div>
        <p className="eyebrow mb-1">your account</p>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
      </div>

      <form onSubmit={saveProfile} className="card-glass space-y-5 p-8">
        <p className="eyebrow">profile</p>
        <ErrorBox msg={profileErr} />
        {profileMsg && <p className="text-sm text-accent-green">{profileMsg}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Name
            <input name="name" defaultValue={me?.name} required className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input name="email" type="email" defaultValue={me?.email} required className={`${inputCls} mt-1`} />
          </label>
        </div>
        <button className="btn-primary px-5 py-2 text-sm">save changes</button>
      </form>

      <form onSubmit={changePassword} className="card-glass space-y-5 p-8">
        <p className="eyebrow">password</p>
        <ErrorBox msg={pwErr} />
        {pwMsg && <p className="text-sm text-accent-green">{pwMsg}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Current password
            <input name="current" type="password" required className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm font-medium">
            New password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="8+ characters"
              className={`${inputCls} mt-1`}
            />
          </label>
        </div>
        <button className="btn-primary px-5 py-2 text-sm">update password</button>
      </form>

      <div className="card-glass p-6">
        <p className="eyebrow mb-3 !text-accent-orange">danger zone</p>
        <p className="text-sm text-ink-body">
          deleting your account wipes every client and filing under it. there is no undo.
        </p>
        <button
          onClick={deleteAccount}
          className="mt-4 rounded-full border border-accent-orange/40 px-5 py-2 text-sm font-medium text-accent-orange transition-colors hover:bg-accent-orange/10"
        >
          delete my account
        </button>
      </div>
    </>
  )
}
