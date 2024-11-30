import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  return NextResponse.json(
    {
      error: 'Internal Server Error',
    },
    { status: 500 }
  )
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function validateUser(user: unknown): asserts user is { id: string } {
  if (!user || typeof user !== 'object' || !('id' in user)) {
    throw new ApiError('Unauthorized', 401)
  }
} 