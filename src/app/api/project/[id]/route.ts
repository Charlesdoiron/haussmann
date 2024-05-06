import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  if (!project) {
    return NextResponse.json(
      {
        message: 'Project Not Found!',
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json(project, {
    status: 200,
  });
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  const id = params.id;

  const body = await request.json();

  const updatedProject = await prisma.project.update({
    where: {
      id,
    },
    data: {
      ...body,
      updateAt: new Date(),
    },
  });

  if (!updatedProject) {
    return NextResponse.json(
      {
        message: 'Project Not Found!',
      },
      {
        status: 400,
      },
    );
  }
  return NextResponse.json(updatedProject, {
    status: 200,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const project = await prisma.project.delete({
    where: {
      id,
    },
  });

  if (!project) {
    return NextResponse.json(
      {
        message: 'Project Not Found!',
      },
      {
        status: 400,
      },
    );
  }
  return NextResponse.json(
    {
      id,
    },
    {
      status: 20,
    },
  );
}
