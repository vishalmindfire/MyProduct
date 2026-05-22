import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateBlogForm from './CreateBlogForm'

export const metadata: Metadata = {
  title: 'New post — Express DAM',
}

export default async function CreateBlogPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
      <div className="mx-auto w-full max-w-2xl px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-6"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4 3 8l4 4" />
            </svg>
            All articles
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            New post
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Fill in the fields below and publish to Strapi.
          </p>
        </div>

        <CreateBlogForm />

      </div>
    </div>
  )
}
