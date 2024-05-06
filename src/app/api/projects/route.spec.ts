// write test cases for the route

/**
 * @jest-environment node
 */

import { prisma } from '@/lib/prisma';
import { GET } from './route';

describe('GET /api/projects', () => {
  it('responds with project data if found', async () => {
    const request: any = {};
    const projectData = [
      {
        id: '123',
        title: 'Test Project',
        description: 'Test Description',
        deadline: '2024-05-06T07:10:49.589Z',
      },
    ];
    (prisma.project.findMany as jest.Mock).mockResolvedValue(projectData);

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      projects: projectData,
    });
    expect(prisma.project.findMany).toHaveBeenCalledTimes(1);
  });

  it('check pagination by getting only two results', async () => {
    const request: any = {
      nextUrl: {
        searchParams: {
          get: jest.fn().mockReturnValue('1'),
        },
      },
    };

    const projectData = [
      {
        id: '123',
        title: 'Test Project',
        description: 'Test Description',
        deadline: '2024-05-06T07:10:49.589Z',
      },
      {
        id: '124',
        title: 'Test Project 2',
        description: 'Test Description 2',
        deadline: '2024-05-06T07:10:49.589Z',
      },
      {
        id: '125',
        title: 'Test Project 3',
        description: 'Test Description 3',
        deadline: '2024-05-06T07:10:49.589Z',
      },
    ];
    (prisma.project.findMany as jest.Mock).mockResolvedValue(projectData);

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      data: [projectData[0], projectData[1]],
      meta: {
        page: 0,
        take: 30,
        itemCount: 2,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    });
    expect(prisma.project.findMany).toHaveBeenCalledTimes(1);
  });

  it('responds with 400 if project not found', async () => {
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);
    const request: any = {};

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      projects: [],
    });
    expect(prisma.project.findMany).toHaveBeenCalledTimes(1);
  });
});
