import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runWorker() {
  const job = await prisma.job.findFirst({
    where: {
      status: 'pending',
      runAt: { lte: new Date() },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (!job) return;

  try {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'processing', attempts: { increment: 1 } },
    });

    if (job.type === 'SendEmail') {
      const payload = job.payload as any;

      console.log('📧 EMAIL SENT');
      console.log('To:', payload.to);
      console.log('Subject:', payload.subject);
      console.log('Template:', payload.template);
      console.log('Data:', payload.data);
    }

    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'done' },
    });
  } catch (err: any) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: job.attempts + 1 >= job.maxAttempts ? 'dead' : 'pending',
        lastError: err.message,
      },
    });
  }
}

setInterval(runWorker, 2000);

console.log('Job worker started');
