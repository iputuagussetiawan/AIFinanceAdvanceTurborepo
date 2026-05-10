import { NextRequest, NextResponse } from 'next/server'

export async function entries(request: NextRequest) {
    // 1. Get the dynamic path (e.g., /api/user/profile -> path: ['user', 'profile'])
    const pathname = request.nextUrl.pathname
    const path = pathname.replace('/api/', '')

    // 2. Define your backend base URL
    const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000'
    const targetUrl = `${API_BASE_URL}/${path}${request.nextUrl.search}`

    // 3. Clone headers and remove host (prevents SSL/Target issues)
    const headers = new Headers(request.headers)
    headers.delete('host')

    try {
        // 4. Forward the request to Express
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: request.method !== 'GET' ? await request.blob() : undefined,
            cache: 'no-store',
        })

        // 5. Return the response back to the browser
        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        })
    } catch (error) {
        console.error('Proxy Error:', error)
        return NextResponse.json({ message: 'Internal Proxy Error' }, { status: 500 })
    }
}

// Map all methods to the same handler
export const GET = entries
export const POST = entries
export const PUT = entries
export const DELETE = entries
export const PATCH = entries
