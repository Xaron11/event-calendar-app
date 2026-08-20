import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const EventCreateSchema = z.object({
  id: z.string().trim().min(1, 'ID cannot be empty').optional(),
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  start: z.string().trim().min(1, 'Start date is required'),
  end: z.string().trim().min(1, 'End date is required'),
  allDay: z.boolean(),
});

export async function GET() {
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
  } catch (error: unknown) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events from database' },
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
    const rawBody = await req.json();
    const parseResult = EventCreateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, title, start, end, allDay } = parseResult.data;

    const event = await prisma.event.create({
      data: {
        id: id || crypto.randomUUID(),
        title,
        start,
        end,
        allDay,
        userId,
      },
    });
    return NextResponse.json(event);
  } catch (error: unknown) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
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

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ error: 'Valid event ID is required' }, { status: 400 });
    }

    const result = await prisma.event.deleteMany({
      where: {
        id: id.trim(),
        userId: userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, count: result.count });
  } catch (error: unknown) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
