import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProjects() {
  try {
    // Create 5 random projects
    for (let i = 0; i < 5; i++) {
      await prisma.project.create({
        data: {
          title: `Project ${i + 1}`,
          description: `Description for Project ${i + 1}`,
          deadline: new Date(
            Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
          ), // Random deadline within 30 days
        },
      });
      console.log(`Project ${i + 1} created`);
    }
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProjects();
