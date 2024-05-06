import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Get all clients for a project id with pagination
export async function GET(
  _request: Request,
  {
    params,
    query,
  }: { params: { id: string }; query: { page?: string; perPage?: string } },
) {
  const id = params.id;
  const page = parseInt(query?.page || '1', 10); // default to page 1
  const perPage = parseInt(query?.perPage || '30', 10); // default to 30 clients per page

  const skip = (page - 1) * perPage;

  const totalCount = await prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          clients: true,
        },
      },
    },
  });

  const clients = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      clients: {
        skip,
        take: perPage,
      },
    },
  });

  if (!clients) {
    return NextResponse.json({
      ok: false,
      message: 'Clients not found',
    });
  }

  const itemCount = clients.clients.length;
  const totalClients = totalCount?._count.clients || 0;
  const pageCount = Math.ceil(totalClients / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < pageCount;

  return NextResponse.json({
    ok: true,
    data: clients,
    meta: {
      page: page - 1, // zero-based index
      take: perPage,
      itemCount,
      pageCount,
      hasPreviousPage,
      hasNextPage,
    },
  });
}
