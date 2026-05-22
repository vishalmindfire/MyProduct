import { createContext, useReducer, useEffect } from 'react';

type ProviderProps = {
    children : React.ReactNode;
}

type Blog = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  publishedAt: string;
  category: string;
  createdAt: Date;
};

type BlogState = {
    blogs: [] | Blog[];
    isLoading: boolean;
    category: string;
    total: number;
    loaded: number;
    page: number;
    limit: number;
}

type BlogMeta = {
    pagination: {
        start: number,
        limit: number,
        total: number
    }
}
type BlogAction = 
   | { type: 'SET_LOADING'; payload: boolean }
   | { type: 'SET_CATEGORY'; payload: string }
   | { type: 'SET_TOTAL'; payload: number }
   | { type: 'SET_PAGE'; payload: number }
   | { type: 'SET_LOADED'; payload: number }
   | { type: 'ADD_BLOG'; payload: Blog }
   | { type: 'ADD_BLOG_START'; payload: Blog }
   | { type: 'REMOVE_BLOG'; payload: Blog['id'] }
   | { type: 'CLEAR_BLOG'};

const BlogReducer = (state: BlogState, action: BlogAction): BlogState => {
    switch(action.type){
        case 'SET_LOADING': {
            return { ...state, isLoading: action.payload}
        }
        case 'SET_CATEGORY': {
            return {...state, category: action.payload}
        }
        case 'SET_TOTAL': {
            return {...state, total: action.payload}
        }
        case 'SET_PAGE': {
             return {...state, page: action.payload}
        }
        case 'SET_LOADED': {
            return {...state, loaded: action.payload}
        }
        case 'ADD_BLOG': {
           const filter = state.blogs.filter( (blog) => blog.id === action.payload.id);
           if(filter.length){
                return state;
           }
           const updatedBlogs = [...state.blogs, action.payload]
           return { ...state, blogs : updatedBlogs}
        }
        case 'ADD_BLOG_START': {
           const filter = state.blogs.filter( (blog) => blog.id === action.payload.id);
           if(filter.length){
                return state;
           }
           const updatedBlogs = [action.payload, ...state.blogs]
           return { ...state, blogs : updatedBlogs}
        }
        case 'REMOVE_BLOG': {
           const updatedBlogs = state.blogs.filter((blog) => blog.id !== action.payload)
           return { ...state, blogs : updatedBlogs}
        }
        default: 
            return state;
    }
}
const initialState: BlogState = {
    category: "",
    isLoading: true,
    blogs: [],
    total: 0,
    loaded: 0,
    page: 1,
    limit: 1
}

const BlogContext = createContext<{
    blogState: BlogState;
    dispatch: React.Dispatch<BlogAction>;
}>({
    blogState: initialState,
    dispatch: () => null,
})

const BlogProvider = (props: ProviderProps) : React.ReactNode => {
    const [state, dispatch] = useReducer(BlogReducer, initialState);

    useEffect(() => {
        const getBlogs = async () => {
           const res = await fetch(
                `/api/blogs?category=${state.category}&page=${state.page}&limit=${state.limit}`,
            );
            const data = await res.json(); 
            data.data.map((blog: Blog) => {
                dispatch({ type: "ADD_BLOG", payload: blog});
            })
            dispatch({ type: "SET_LOADING", payload: false});
            dispatch({ type: "SET_TOTAL", payload: data.meta.pagination.total});
            dispatch({ type: "SET_LOADED", payload: state.loaded + state.limit});
        }
        if(state.isLoading) {
            getBlogs();
        }
    },[]);

    return (
        <BlogContext.Provider value={{blogState: state, dispatch}}>
            {props.children}
        </BlogContext.Provider>
    )
}

export { BlogProvider, BlogContext, type Blog, type BlogMeta };
