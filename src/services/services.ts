import type { TMDBError } from '@/types/Error'
import type { QueryParams, Headers, APIError, RequestOptions } from '@/types/Service'

const API_BASE_URL = 'https://api.themoviedb.org/3'

// Get headers dynamically with the API key from environment variables
const getHeaders = (): Headers => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
})

// Build a URL with optional query parameters
const buildURL = (endpoint: string, params: QueryParams = {}): URL => {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key].toString()))
  return url
}

// Handle API response and errors
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error: TMDBError = await response.json()
    useErrorStore().setError({ error })
  }
  return response.json()
}

// Generic fetch function for TMDB API
const makeRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: Record<string, unknown> | null = null,
  params: QueryParams = {}
): Promise<T> => {
  const options: RequestOptions = {
    method,
    headers: getHeaders(),
    ...(body && { body: JSON.stringify(body) })
  }

  const response = await fetch(buildURL(endpoint, params).toString(), options)
  return handleResponse<T>(response)
}

// Export reusable API methods
export const services = {
  get: <T>(endpoint: string, params: QueryParams = {}): Promise<T> =>
    makeRequest<T>(endpoint, 'GET', null, params),
  post: <T>(
    endpoint: string,
    body: Record<string, unknown> = {},
    params: QueryParams = {}
  ): Promise<T> => makeRequest<T>(endpoint, 'POST', body, params),
  put: <T>(
    endpoint: string,
    body: Record<string, unknown> = {},
    params: QueryParams = {}
  ): Promise<T> => makeRequest<T>(endpoint, 'PUT', body, params),
  delete: <T>(endpoint: string, params: QueryParams = {}): Promise<T> =>
    makeRequest<T>(endpoint, 'DELETE', null, params)
}
