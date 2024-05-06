/**
 * @jest-environment node
 */

import { prisma } from '@/lib/prisma';

import { GET, PUT, DELETE } from './route';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    project: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('GET /api/project/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('responds with project data if found', async () => {
    const id = '123';
    const request: any = {};

    const projectData = {
      id,
      title: 'Test Project',
      description: 'Test Description',
      deadline: '2024-05-06T07:10:49.589Z',
    };
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(projectData);

    const response = await GET(request, { params: { id } });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      project: projectData,
    });
    expect(prisma.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.project.findUnique).toHaveBeenCalledWith({ where: { id } });
  });

  it('responds with 400 if project not found', async () => {
    const id = '123';
    const request: any = {
      params: { id },
    };

    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await GET(request, { params: { id } });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('Project not found');
    expect(prisma.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.project.findUnique).toHaveBeenCalledWith({ where: { id } });
  });
});
