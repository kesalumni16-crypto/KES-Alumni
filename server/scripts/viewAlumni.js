const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function viewAlumni() {
  try {
    // Get count of all alumni
    const count = await prisma.alumni.count();
    console.log(`Total alumni in database: ${count}`);
    
    // Get all alumni with pagination (first 10)
    const alumni = await prisma.alumni.findMany({
      take: 10,
      orderBy: {
        id: 'asc'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        yearOfJoining: true,
        passingYear: true,
        department: true,
        college: true,
        course: true,
        isVerified: true
      }
    });
    
    console.log('\nFirst 10 alumni records:');
    console.table(alumni);
    
    console.log('\nTo view more records or all data, use Prisma Studio with: npx prisma studio');
  } catch (error) {
    console.error('Error viewing alumni data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewAlumni();