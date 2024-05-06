import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Get all projects with pagination
export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10); // default to page 1
  const perPage = parseInt(
    request.nextUrl.searchParams.get('perPage') || '30',
    10,
  ); // default to 30 projects per page

  const skip = (page - 1) * perPage;

  const totalCount = await prisma.project.count();

  const projects = await prisma.project.findMany({
    skip,
    take: perPage,
  });

  if (!projects) {
    return NextResponse.json({
      ok: false,
      message: 'Projects not found',
    });
  }

  const itemCount = projects.length;
  const pageCount = Math.ceil(totalCount / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < pageCount;

  return NextResponse.json({
    ok: true,
    data: projects,
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
