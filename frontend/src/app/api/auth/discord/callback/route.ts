import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord OAuth2 Callback Route
 * Handles the callback from Discord OAuth2 authorization
 */

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth2 errors
    if (error) {
      console.error('Discord OAuth2 error:', error);
      return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(new URL('/?error=invalid_request', request.url));
    }

    // Verify state parameter for CSRF protection
    const storedState = request.cookies.get('discord_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
    }

    // Check if Discord credentials are configured
    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
      console.error('Discord OAuth2 credentials not configured');
      return NextResponse.redirect(new URL('/?error=server_error', request.url));
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for token:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();

    // Get user information from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info:', await userResponse.text());
      return NextResponse.redirect(new URL('/?error=user_info_failed', request.url));
    }

    const discordUser = await userResponse.json();

    // Send user data to backend for authentication/registration
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/auth/discord/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discordUser,
          accessToken: tokenData.access_token,
        }),
      });

      if (!backendResponse.ok) {
        console.error('Backend authentication failed:', await backendResponse.text());
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
      }

      const authData = await backendResponse.json();

      // Set authentication cookies and redirect to dashboard
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      
      // Clear OAuth state cookie
      response.cookies.delete('discord_oauth_state');
      
      // Set authentication cookies (in production, use secure, httpOnly cookies)
      response.cookies.set('auth_token', authData.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      response.cookies.set('refresh_token', authData.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    } catch (backendError) {
      console.error('Backend communication error:', backendError);
      return NextResponse.redirect(new URL('/?error=backend_error', request.url));
    }
  } catch (error) {
    console.error('Discord callback error:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
