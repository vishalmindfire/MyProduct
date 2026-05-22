'use client';

import { useBlog } from '@/app/hooks/useBlog';

const BlogMore = () => {
   const { blogState, dispatch } = useBlog();
    const clickHandler = (e: React.MouseEvent) => {
    dispatch({ type: "SET_PAGE", payload: blogState.page + 1  })
    dispatch({ type: "SET_LOADED", payload: blogState.loaded + blogState.limit  })
  }
    return (
        <>
        {blogState.total > blogState.loaded && <div className="text-center pt-4">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            onClick={clickHandler}>
            Load more blogs
          </button>
        </div>}
        </>
    )
}

export default BlogMore;