import { z } from 'zod';
import { procedure, router } from '../trpc';
import prisma from '@/lib/prisma';

export const appRouter = router({
  getEvents: procedure.query(async ({ input, ctx }) => {
    if (!ctx.user) {
      return [];
    }

    const events = await prisma.event.findMany({
      where: {
        userId: ctx.user.id,
      },

      select: {
        id: true,
        title: true,
        start: true,
        end: true,
        userId: false,
      },
    });

    return events;
  }),
  createEvent: procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        start: z.string(),
        end: z.string(),
        allDay: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        return null;
      }

      const newEvent = {
        ...input,
        userId: ctx.user.id,
      };

      const event = await prisma.event.create({
        data: newEvent,
      });

      return event;
    }),
  deleteEvent: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        return null;
      }

      await prisma.event.deleteMany({
        where: {
          AND: [
            {
              id: input.id,
            },
            {
              userId: ctx.user.id,
            },
          ],
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
