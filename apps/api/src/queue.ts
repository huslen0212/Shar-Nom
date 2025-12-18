import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface EnqueueOptions {
  dedupeKey?: string;
}

export async function enqueueJob(
  type: string,
  payload: Prisma.InputJsonValue,
  options?: EnqueueOptions
) {
  if (options?.dedupeKey) {
    const exists = await prisma.job.findUnique({
      where: { dedupeKey: options.dedupeKey },
    });

    if (exists) {
      return exists;
    }
  }

  return prisma.job.create({
    data: {
      type,
      payload,
      dedupeKey: options?.dedupeKey,
    },
  });
}
