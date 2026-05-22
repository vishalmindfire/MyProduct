'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type CreateBlogState = {
  errors?: {
    title?: string[]
    slug?: string[]
    content?: string[]
    general?: string[]
  }
  values?: {
    title?: string
    slug?: string
    description?: string
    content?: string
  }
}

export async function createBlog(
  _prevState: CreateBlogState,
  formData: FormData
): Promise<CreateBlogState> {
  const session = await auth()
  if (!session) return { errors: { general: ['Unauthorized. Please sign in.'] } }

  const title   = (formData.get('title')       as string)?.trim()
  const slug    = (formData.get('slug')        as string)?.trim()
  const desc    = (formData.get('description') as string)?.trim()
  const content = (formData.get('content')     as string)?.trim()
  const cover   = formData.get('cover') as File | null
  const publish = formData.get('publishNow') === 'off'

  const errors: CreateBlogState['errors'] = {}
  if (!title)   errors.title   = ['Title is required']
  if (!slug)    errors.slug    = ['Slug is required']
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    errors.slug = ['Use lowercase letters, numbers, and hyphens only']
  if (!content) errors.content = ['Content is required']
  const submitted = { title, slug, description: desc, content }
  if (Object.keys(errors).length) return { errors, values: submitted }

  const token = session.accessToken

  let coverId: number | undefined
  if (cover && cover.size > 0) {
    const uploadForm = new FormData()
    uploadForm.append('files', cover)
    const uploadRes = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: uploadForm,
    })
    if (!uploadRes.ok) {
      return { errors: { general: ['Cover image upload failed. Please try again.'] }, values: submitted }
    }
    const [uploaded] = await uploadRes.json()
    coverId = uploaded.id
  }

  const body = {
    data: {
      title,
      slug,
      ...(desc     && { description: desc }),
      content,
      ...(coverId !== undefined && { cover: coverId }),
      publishedAt: publish ? new Date().toISOString() : null,
    },
  }

  const res = await fetch(`${process.env.STRAPI_URL}/api/blog-posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return {
      errors: { general: [err?.error?.message ?? 'Failed to create post. Please try again.'] },
      values: submitted,
    }
  }

  const { data } = await res.json()
  revalidatePath('/blogs')
  redirect(`/blogs/${data?.slug ?? slug}`)
}
