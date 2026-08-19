import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch events from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const event = await prisma.event.create({
      data: {
        ...body,
        userId: userId,
      },
    });
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    const event = await prisma.event.deleteMany({
      where: {
        AND: [
          {
            id: id,
          },
          {
            userId: userId,
          },
        ],
      },
    });
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
