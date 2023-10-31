import { AuthRequest } from 'interfaces/app.js'
import { ProfileResponse } from 'interfaces/trending.js'

export const isAuthRequest = (body: unknown): body is AuthRequest => {
  return (
    body != null &&
    typeof body === 'object' &&
    'session' in body &&
    typeof body.session === 'string' &&
    body.session.length > 0
  )
}

export const isProfileResponse = (body: unknown): body is ProfileResponse => {
  return (
    body != null &&
    typeof body === 'object' &&
    'code' in body &&
    typeof body.code === 'number' &&
    body.code === 200 &&
    'data' in body &&
    typeof body.data === 'object' &&
    'balance' in body.data &&
    typeof body.data.balance === 'number' &&
    body.data.balance >= 0
  )
}
