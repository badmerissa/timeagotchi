import { ViteReactSSG } from 'vite-react-ssg'
import { inject } from '@vercel/analytics'
import './index.css'
import { routes } from './App'

inject()

export const createRoot = ViteReactSSG({ routes })
