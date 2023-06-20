import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const user = getAuth(req);

  const events = await prisma.event.findMany({
    where: {
      userId: user.userId!!,
    },
    select: {
      id: true,
      title: true,
      start: true,
      end: true,
      allDay: true,
      userId: false,
    },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const user = getAuth(req);

  const event = await prisma.event.create({
    data: {
      ...(await req.json()),
      userId: user.userId!!,
    },
  });
  console.log(event);
  return NextResponse.json(event);
}

export async function DELETE(req: NextRequest) {
  const user = getAuth(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const event = await prisma.event.deleteMany({
    where: {
      AND: [
        {
          id: id!!,
        },
        {
          userId: user.userId!!,
        },
      ],
    },
  });
  return NextResponse.json(event);
}
