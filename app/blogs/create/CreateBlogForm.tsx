'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { createBlog, type CreateBlogState } from './actions'

const inputBase =
  'w-full rounded-xl border bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none transition-colors'
const inputNormal  = 'border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500'
const inputError   = 'border-red-300 dark:border-red-700 focus:border-red-500'

function toSlug(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function CreateBlogForm() {
  const [state, action, pending] = useActionState<CreateBlogState, FormData>(
    createBlog,
    {}
  )
  const [fields, setFields] = useState({ title: '', description: '', content: '' })
  const [slug, setSlug]             = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [preview, setPreview]       = useState<string | null>(null)


  const [prevValues, setPrevValues] = useState(state.values)
  if (prevValues !== state.values && state.values) {
    setPrevValues(state.values)
    setFields({
      title:       state.values.title       ?? '',
      description: state.values.description ?? '',
      content:     state.values.content     ?? '',
    })
    setSlug(state.values.slug ?? '')
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setFields(f => ({ ...f, title: val }))
    if (!slugEdited) setSlug(toSlug(val))
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <form action={action} className="space-y-6">

      {/* General error banner */}
      {state.errors?.general && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {state.errors.general[0]}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="How We Built Something Great"
          value={fields.title}
          onChange={handleTitleChange}
          className={`${inputBase} ${state.errors?.title ? inputError : inputNormal}`}
        />
        {state.errors?.title && (
          <p className="text-xs text-red-500 dark:text-red-400">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Slug <span className="text-red-500">*</span>
        </label>
        <div className={`flex items-center rounded-xl border bg-white dark:bg-zinc-900 overflow-hidden transition-colors ${state.errors?.slug ? 'border-red-300 dark:border-red-700' : 'border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-400 dark:focus-within:border-zinc-500'}`}>
          <span className="pl-4 pr-1 text-sm text-zinc-400 dark:text-zinc-500 select-none shrink-0">
            /blogs/
          </span>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
            placeholder="how-we-built-something-great"
            className="flex-1 bg-transparent py-2.5 pr-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
          />
        </div>
        {state.errors?.slug && (
          <p className="text-xs text-red-500 dark:text-red-400">{state.errors.slug[0]}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          placeholder="A short summary shown on the blog listing page…"
          value={fields.description}
          onChange={(e) => setFields(f => ({ ...f, description: e.target.value }))}
          className={`${inputBase} ${inputNormal} resize-none`}
        />
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={14}
          required
          placeholder="Write your article here… HTML is supported."
          value={fields.content}
          onChange={(e) => setFields(f => ({ ...f, content: e.target.value }))}
          className={`${inputBase} ${state.errors?.content ? inputError : inputNormal} font-mono leading-relaxed resize-y`}
        />
        {state.errors?.content && (
          <p className="text-xs text-red-500 dark:text-red-400">{state.errors.content[0]}</p>
        )}
        <p className="text-xs text-zinc-400 dark:text-zinc-500">HTML is accepted.</p>
      </div>

      {/* Cover image */}
      <div className="space-y-2">
        <label htmlFor="cover" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Cover image
        </label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Cover preview"
            className="rounded-xl object-cover w-full h-44 border border-zinc-200 dark:border-zinc-700"
          />
        )}
        <input
          id="cover"
          name="cover"
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="w-full text-sm text-zinc-500 dark:text-zinc-400
            file:mr-3 file:py-1.5 file:px-4
            file:rounded-full file:border file:border-zinc-200 dark:file:border-zinc-700
            file:text-xs file:font-medium file:text-zinc-700 dark:file:text-zinc-300
            file:bg-transparent hover:file:bg-zinc-50 dark:hover:file:bg-zinc-800
            file:cursor-pointer file:transition-colors"
        />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-2.5">
        <input
          id="publishNow"
          name="publishNow"
          type="checkbox"
          defaultChecked
          className="size-4 rounded border-zinc-300 dark:border-zinc-600 accent-zinc-900 dark:accent-zinc-100"
        />
        <label htmlFor="publishNow" className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
          Publish immediately
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Link
          href="/blogs"
          className="inline-flex h-9 items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-4 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-zinc-950 dark:bg-zinc-50 px-5 text-sm font-medium text-white dark:text-zinc-950 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending && (
            <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {pending ? 'Saving…' : 'Publish post'}
        </button>
      </div>

    </form>
  )
}
