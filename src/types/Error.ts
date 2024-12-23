import type { PostgrestError } from '@supabase/supabase-js'

export interface CustomError extends Error {
  customCode?: number
}
export interface ExtendedPostgrestError extends PostgrestError {
  statusCode?: number
}
export interface TMDBError {
  status_code?: number
  status_message: string
  success?: boolean
}
