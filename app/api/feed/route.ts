import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const messages = await prisma.testMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // Get the latest 50 logs/messages
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
