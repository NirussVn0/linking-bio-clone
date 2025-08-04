import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord OAuth2 Authentication Route
 * Handles Discord OAuth2 authentication flow
 */

// Discord OAuth2 configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';
const DISCORD_OAUTH_URL = 'https://discord.com/api/oauth2/authorize';

export async function GET(request: NextRequest) {
  try {
    // Check if Discord client ID is configured
    if (!DISCORD_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Discord OAuth2 not configured' },
        { status: 500 }
      );
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // Build Discord OAuth2 authorization URL
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: DISCORD_REDIRECT_URI,
      response_type: 'code',
      scope: 'identify email',
      state: state,
    });

    const authUrl = `${DISCORD_OAUTH_URL}?${params.toString()}`;

    // Store state in session/cookie for verification (in production, use secure session storage)
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('discord_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Discord OAuth2 error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
