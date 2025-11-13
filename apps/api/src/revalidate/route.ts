import { revalidatePath } from 'next/cache';

interface RevalidateBody {
  path: string;
  token: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as RevalidateBody;
  const { path, token } = body;

  if (token !== process.env.REVALIDATE_TOKEN) {
    return new Response('unauthorized', { status: 401 });
  }

  await revalidatePath(path);

  return Response.json({ revalidated: true, path });
}
