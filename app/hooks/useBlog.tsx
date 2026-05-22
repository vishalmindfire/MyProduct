import { BlogContext } from '@/app/context/blogContext'
import { useContext } from 'react';

export const useBlog = () => {
    const {blogState, dispatch} = useContext(BlogContext);

    return { blogState: blogState, dispatch: dispatch };
}