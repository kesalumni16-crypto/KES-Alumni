const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'photos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

/**
 * Upload profile photo
 */
const uploadPhoto = async (req, res) => {
  try {
    const { id } = req.user;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the file URL (in production, this would be a cloud storage URL)
    const photoUrl = `https://kes-alumni-bhz1.vercel.app/uploads/photos/${req.file.filename}`;

    // Delete old photo if exists
    const existingAlumni = await prisma.alumni.findUnique({
      where: { id },
      select: { profilePhoto: true },
    });

    if (existingAlumni.profilePhoto) {
      // Extract filename from URL and delete old file
      const oldFilename = existingAlumni.profilePhoto.split('/').pop();
      const oldFilePath = path.join(__dirname, '..', 'uploads', 'photos', oldFilename);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (deleteError) {
          console.error('Error deleting old photo:', deleteError);
        }
      }
    }

    // Update alumni record with photo URL
    const updatedAlumni = await prisma.alumni.update({
      where: { id },
      data: { profilePhoto: photoUrl },
      select: { profilePhoto: true },
    });

    res.status(200).json({
      message: 'Photo uploaded successfully',
      photoUrl: updatedAlumni.profilePhoto,
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ message: 'Server error during photo upload' });
  }
};

/**
 * Delete profile photo
 */
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.user;

    // Get current photo path
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: { profilePhoto: true },
    });

    if (alumni.profilePhoto) {
      // Extract filename from URL and delete file
      const filename = alumni.profilePhoto.split('/').pop();
      const filePath = path.join(__dirname, '..', 'uploads', 'photos', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (deleteError) {
          console.error('Error deleting photo file:', deleteError);
        }
      }
    }

    // Update alumni record to remove photo URL
    await prisma.alumni.update({
      where: { id },
      data: { profilePhoto: null },
    });

    res.status(200).json({
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Photo delete error:', error);
    res.status(500).json({ message: 'Server error during photo deletion' });
  }
};

module.exports = {
  upload,
  uploadPhoto,
  deletePhoto,
};