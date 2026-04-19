import axios from 'axios'

const getBaseURL = () => {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
  
  if (apiUrl) {
    return apiUrl
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080/api'
  }
  
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}/api`
  }
  
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || process.env.SITE_NAME
  if (siteName) {
    return `https://${siteName}/api`
  }
  
  return 'http://localhost:8080/api'
}

const baseURL = getBaseURL()

const publicFetch = axios.create({
  baseURL
})

export { publicFetch, baseURL }
