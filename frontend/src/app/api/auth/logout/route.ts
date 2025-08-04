import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout Route
 * Handles user logout by clearing authentication cookies
 */

export async function POST(request: NextRequest) {
  try {
    // Create response that redirects to home page
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear authentication cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Support GET request for logout as well
  try {
    const response = NextResponse.redirect(new URL('/', request.url));

    // Clear authentication cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/?error=logout_failed', request.url));
  }
}
