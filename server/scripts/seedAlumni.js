const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/auth');

const prisma = new PrismaClient();

// Sample alumni data
const sampleAlumni = [
  // Add your own data here with correct email for testing
  {
    fullName: "Nikhil Dattaram Sutar",
    email: "nikhilsutar81@gmail.com", // Replace with your actual email
    phoneNumber: "9137888218", // Replace with your actual phone
    yearOfJoining: 2018,
    passingYear: 2022,
    admissionInFirstYear: true,
    department: "Computer Science",
    college: "KES Shroff College",
    course: "B.Tech",
    isVerified: true
  },
  // Sample data for 99 more alumni
  ...Array(99).fill().map((_, i) => ({
    fullName: `Alumni ${i + 1}`,
    email: `alumni${i + 1}@example.com`,
    phoneNumber: `${9000000000 + i}`,
    yearOfJoining: 2015 + Math.floor(i / 20),
    passingYear: 2019 + Math.floor(i / 20),
    admissionInFirstYear: i % 5 !== 0, // 20% transferred
    department: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration"][i % 5],
    college: ["Engineering College", "Arts College", "Science College", "Business School", "Medical College"][i % 5],
    course: ["B.Tech", "B.Sc", "BBA", "M.Tech", "MBA"][i % 5],
    isVerified: true
  }))
];

async function seedAlumni() {
  console.log('Starting to seed alumni data...');
  
  try {
    // Generate a default password for all sample accounts
    const defaultPassword = 'Password123!';
    const hashedPassword = await hashPassword(defaultPassword);
    
    // Create alumni records with the hashed password
    for (const alumniData of sampleAlumni) {
      const alumni = await prisma.alumni.create({
        data: {
          ...alumniData,
          password: hashedPassword
        }
      });
      console.log(`Created alumni with ID: ${alumni.id}`);
    }
    
    console.log('Seeding completed successfully!');
    console.log(`Total alumni created: ${sampleAlumni.length}`);
    console.log('Default password for all accounts: Password123!');
    console.log('You can now log in with any of the sample email addresses and the default password.');
    console.log('For testing with email verification, use your own email that you added to the sample data.');
  } catch (error) {
    console.error('Error seeding alumni data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAlumni();