import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from './db';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    console.log('Token:', token);
    
    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    try {
      const { payload } = await jwtVerify(token, secret);
      console.log('Payload:', payload);
      const user = await db.user.findUnique({
        where: { id: payload.id as string },
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return null;
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}