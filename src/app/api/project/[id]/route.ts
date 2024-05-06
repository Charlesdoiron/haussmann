import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

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
        ok: false,
        message: 'Project not found',
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      project,
    },
    {
      status: 200,
    },
  );
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  try {
    const id = params.id;
    const body = await request.json();
    try {
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        deadline: z.date().optional(),
      }).parse(body);
    } catch (error) {
      const validationError = fromError(error).toString();
      console.error('Error Zod parsing request body:', validationError);

      return new Response(validationError, {
        status: 400,
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    if (!updatedProject) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Project not found',
        },
        {
          status: 400,
        },
      );
    }
    return NextResponse.json(
      {
        ok: true,
        project: updatedProject,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { message: 'Error updating project' },
      { status: 500 },
    );
  }
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
        ok: false,
        message: 'Project not found!',
      },
      {
        status: 400,
      },
    );
  }
  return NextResponse.json(
    {
      ok: true,
      id,
    },
    {
      status: 200,
    },
  );
}
