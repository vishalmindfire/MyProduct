'use client';
import React, { useContext } from 'react';
import { BlogContext } from '@/app/context/blogContext';
const categories = ["All", "Product", "Guide", "Tips", "Engineering", "Use case"];

const BlogCategory = () => {
    const { blogState, dispatch } = useContext(BlogContext);

    const handleClick = (e: React.MouseEvent) => {
        const value = e.currentTarget.getAttribute('value');
        if(value){
            dispatch({ type: "SET_CATEGORY", payload: value  })
        }
    }
    return (
        <div className="border-b border-zinc-100 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-center gap-1 overflow-x-auto pb-0 -mb-px">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  className={`shrink-0 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                        cat === blogState.category
                        ? "border-zinc-950 dark:border-zinc-50 text-zinc-950 dark:text-zinc-50"
                        : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`
                  }
                  value={cat}
                  onClick={handleClick}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
    )
}

export default BlogCategory;