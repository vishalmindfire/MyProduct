'use client';

import { BlogProvider } from '@/app/context/blogContext';
import BlogGrid from '@/app/components/BlogGrid';
import BlogCategory from '@/app/components/BlogCategory';
import BlogMore from '@/app/components/BlogMore';
export default function BlogPage() {
 
  return (
    <BlogProvider>
      <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-20 pb-12">
          <span className="inline-block rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
            Axon Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight max-w-2xl">
            Insights on digital asset management
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Product updates, workflow guides, and engineering deep dives from the Axon team.
          </p>
        </section>

        {/* Category filter */}
        <BlogCategory />

        {/* Post grid */}
        <BlogGrid/>

        {/* Load more */}
        <BlogMore/>
      </div>
    </BlogProvider>
  );
}