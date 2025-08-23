# Alumni Portal Sample Data

## Overview

This directory contains scripts for seeding the database with sample alumni data for testing purposes.

## Available Scripts

### `seedAlumni.js`

This script adds 100 sample alumni records to the database:
- 1 record with your actual email (for testing email verification)
- 99 records with fictional data

### `viewAlumni.js`

This script displays the first 10 alumni records from the database in a table format and shows the total count of alumni records.

## How to Use

1. **Edit the Sample Data**:
   - Open `seedAlumni.js`
   - Replace the first entry with your actual information (especially email) for testing email verification

2. **Run the Seed Script**:
   ```
   npm run seed
   ```

3. **View the Seeded Data**:
   ```
   npm run view-alumni
   ```

4. **Default Login Credentials**:
   - Email: Any email from the sample data
   - Password: `Password123!`

## Viewing the Data

You can view the seeded data in several ways:

1. **Using Prisma Studio**:
   ```
   npx prisma studio
   ```
   This opens a web interface at http://localhost:5555 where you can browse and edit the database.

2. **Using the API**:
   - Log in with any of the sample accounts
   - Access the profile endpoint to view user data

3. **Using PostgreSQL Client**:
   - Connect to your database using a PostgreSQL client like pgAdmin or DBeaver
   - View the `Alumni` table

## Data Verification Process

When a real user registers through the application:

1. User submits registration form
2. System sends an OTP to the provided email
3. User verifies their identity by entering the OTP
4. Upon successful verification:
   - User is marked as verified in the database
   - A random password is generated and sent to the user's email
   - User can then log in with their email and the provided password

The sample data bypasses this verification process by setting `isVerified: true` for all records.