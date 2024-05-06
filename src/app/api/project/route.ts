import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    try {
      z.object({
        title: z.string(),
        description: z.string(),
        deadline: z.date(),
      }).parse(body);
    } catch (error) {
      const validationError = fromError(error).toString();
      console.error('Error Zod parsing request body:', validationError);

      return new Response(validationError, {
        status: 400,
      });
    }

    const { title, description, deadline } = body;
    const createdProject = await prisma.project.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
      },
    });

    return NextResponse.json(createdProject, {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Error creating project' },
      { status: 500 },
    );
  }
}
