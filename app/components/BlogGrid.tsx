"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import useSWR from "swr";
import type { Blog, BlogMeta } from "@/app/context/blogContext"
import { useBlog } from '@/app/hooks/useBlog';

const BlogGrid = () => {
    const { blogState, dispatch } = useBlog();
    const filteredBlogs = useMemo( () => blogState.category === 'All'? blogState.blogs : blogState.blogs.filter((blog) => blog.category === blogState.category),[blogState.blogs, blogState.category]);
    const fetcher = (url: string) => fetch(url).then(async (res) => {
        const data = await res.json();
        data.data.map( (blog : Blog) => {
            dispatch({ type: "ADD_BLOG", payload: blog });
        })
        return data;     

    });

    useSWR<{ data: Blog[] | [], meta: BlogMeta }>(`/api/blogs?category=${blogState.category}&page=${blogState.page}&limit=${blogState.limit}`, fetcher, {
        fallbackData: { data: blogState.blogs, meta : {
            pagination: {
                start: blogState.page,
                total: blogState.total,
                limit: blogState.limit
            }
        }},
        refreshInterval: 5000,
    });

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlogs && filteredBlogs.map((post : Blog) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold`}>
                  {post.category}
                </span>
              </div>
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 leading-snug mb-2 group-hover:underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600">
                {post.title}
              </h3>
              <div className="mt-5 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        })}</span>
              </div>
            </Link>
          ))}
        </div>
    )
}

export default BlogGrid;