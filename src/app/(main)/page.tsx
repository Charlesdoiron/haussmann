'use client';

import { PrismaClient } from '@prisma/client';
import { useEffect } from 'react';

const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  try {
    // Try querying the database
    await prisma.$connect();
    console.log('Prisma is connected to the database.');
    // Optional: Perform a test query
    const clients = await prisma.client.findMany();
    console.log('Retrieved clients:', clients);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the function to check database connection
checkDatabaseConnection();

export default function Home() {
  useEffect(() => {
    checkDatabaseConnection();
  }, []);
  return <div className='flex h-full flex-col font-app font-medium'>Hello</div>;
}
