/**
 * @jest-environment node
 */

import { prisma } from '@/lib/prisma';
import { POST } from './route';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    project: {
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('POST /api/project/create', () => {
  it('responds with JSON', async () => {
    const request: any = {
      json: async () => ({
        title: 'Tes',
        description: 'Test Description',
        deadline: new Date('2024-05-10'),
      }),
    };

    (prisma.project.create as jest.Mock).mockResolvedValue({
      title: 'Test Project',
      description: 'Test Description',
      deadline: new Date('2024-05-10'),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.title).toBe('Test Project');
    expect(prisma.project.create).toHaveBeenCalledTimes(1);
  });

  it('responds with 400 if request body is invalid (invalid date)', async () => {
    const request: any = {
      json: async () => ({
        title: 'Tes',
        description: 'Test Description',
        deadline: '2024-05-10',
      }),
    };
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it('responds with 500 if an error occurs', async () => {
    const request: any = {
      json: async () => ({
        title: 'Tes',
        description: 'Test Description',
        deadline: new Date('2024-05-10'),
      }),
    };

    (prisma.project.create as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.message).toBe('Error creating project');
    expect(prisma.project.create).toHaveBeenCalledTimes(1);
  });

  it('responds with 400 if request body is invalid (missing title)', async () => {
    const request: any = {
      json: async () => ({
        description: 'Test Description',
        deadline: new Date('2024-05-10'),
      }),
    };
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(prisma.project.create).not.toHaveBeenCalled();
  });
});
