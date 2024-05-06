import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

// Create a new client for a project id
export async function POST(
  request: Request,
  { params }: { params: { id?: string } },
) {
  try {
    const id = params?.id;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Project id not found',
        },
        {
          status: 400,
        },
      );
    }
    try {
      z.object({
        title: z.string(),
        adminEmail: z.string().email(),
      }).parse(body);
    } catch (error) {
      const validationError = fromError(error).toString();

      console.error('Error Zod parsing request body:', validationError);
      return new Response(validationError, {
        status: 400,
      });
    }

    const createdClient = await prisma.client.create({
      data: {
        ...body,
        projects: {
          connect: {
            id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ok: true,
        createdClient,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { message: 'Error creating project' },
      { status: 500 },
    );
  }
}
