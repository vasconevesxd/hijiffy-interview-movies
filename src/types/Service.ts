export interface QueryParams {
  [key: string]: string | number
}

export interface Headers {
  'Content-Type': string
  Accept: string
  Authorization: string
}
export interface RequestOptions {
  method: string
  headers: Headers
  body?: string
}
