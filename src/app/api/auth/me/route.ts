import {  NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';

export async function GET() {
  try {
       const cookieStore = await cookies();
       const token = await cookieStore.get('authToken')?.value;
    console.log('Token:', token);
    console.log('--------------');
    if (!token) {
      console.log('No auth token found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    try {
      const { payload } = await jwtVerify(token, secret);

      const user = await db.user.findUnique({
        where: { id: payload.userId as string },
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      });

      if (!user) {
        console.log('User not found for ID:', payload.userId);
        return new NextResponse('User not found', { status: 404 });
      }

      return NextResponse.json(user);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return new NextResponse('Invalid token', { status: 401 });
    }
  } catch (error) {
    console.error('Error in auth/me:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}