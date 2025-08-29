const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
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
    const photoUrl = `/uploads/photos/${req.file.filename}`;

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
    res.status(500).json({ message: 'Server error' });
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
      // Delete file from filesystem
      const filePath = path.join(__dirname, '..', alumni.profilePhoto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
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
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  upload,
  uploadPhoto,
  deletePhoto,
};