import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected Routes Logic
    if (request.nextUrl.pathname.startsWith('/pos') || request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Role Based Access Control
        const role = user.user_metadata?.role || 'cashier'; // Default to cashier if role missing for safety

        // Admin Routes: Only 'admin' can access
        if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
            // Redirect unauthorized users to home or maybe show an error page
            // preventing Cashier from seeing Admin Dashboard
            const url = request.nextUrl.clone()
            url.pathname = '/' // Redirect to home
            return NextResponse.redirect(url)
        }

        // POS Routes: Both can access generally, or maybe restrict? 
        // User requirement: "Cashier can access Cashier Terminal". "Admin has access to both".
        // So no restriction needed for POS, as long as logged in.
    }

    return response
}
