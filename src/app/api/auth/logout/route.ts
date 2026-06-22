import { NextResponse } from 'next/server';

export const dynamic = "force-static";

export async function POST() {
  const response = NextResponse.json({ status: 'success' }, { status: 200 });
  
  // Clear session cookie
  response.cookies.set('session', '', { maxAge: -1 });
  
  // Clear user_email cookie
  response.cookies.set('user_email', '', { maxAge: -1 });

  return response;
}
