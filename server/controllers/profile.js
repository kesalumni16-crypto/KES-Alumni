const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// helpers
const toInt = (v) => (v === undefined || v === null || v === '' ? undefined : parseInt(v, 10));
const toBool = (v) => (v === undefined || v === null ? undefined : v === true || v === 'true' || v === 1 || v === '1');
const toDate = (v) => (v ? new Date(v) : undefined);
const cleanStr = (v) => (typeof v === 'string' ? v.trim() : v);
const nonEmpty = (v) => (v === '' ? undefined : v);

// projection used across endpoints
const alumniSelect = {
  id: true,
  firstName: true,
  middleName: true,
  lastName: true,
  username: true,
  dateOfBirth: true,
  email: true,
  phoneNumber: true,
  whatsappNumber: true,
  secondaryPhoneNumber: true,
  gender: true,
  profilePhoto: true,

  personalAddressLine1: true,
  personalAddressLine2: true,
  personalCity: true,
  personalState: true,
  personalPostalCode: true,
  personalCountry: true,

  companyAddressLine1: true,
  companyAddressLine2: true,
  companyCity: true,
  companyState: true,
  companyPostalCode: true,
  companyCountry: true,

  linkedinProfile: true,
  instagramProfile: true,
  twitterProfile: true,
  facebookProfile: true,
  githubProfile: true,
  personalWebsite: true,

  currentJobTitle: true,
  currentCompany: true,
  workExperience: true,
  skills: true,
  achievements: true,

  bio: true,
  interests: true,
  mentorshipAvailable: true,
  lookingForMentor: true,

  currentCity: true,
  currentCountry: true,

  // legacy
  fullName: true,
  currentName: true,
  address: true,
  street: true,
  city: true,
  state: true,
  pincode: true,
  country: true,
  countryCode: true,
  socialMediaWebsite: true,

  role: true,
  yearOfJoining: true,
  passingYear: true,
  admissionInFirstYear: true,
  department: true,
  college: true,
  course: true,

  createdAt: true,
  updatedAt: true,

  education: {
    select: {
      id: true,
      institutionName: true,
      degree: true,
      fieldOfStudy: true,
      startYear: true,
      endYear: true,
      isCurrentlyStudying: true,
      grade: true,
      description: true,
      activities: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { startYear: 'desc' },
  },
};

// username utilities
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s.]/g, '')
    .replace(/\s+/g, '.')
    .replace(/\.+/g, '.')
    .replace(/^\.|\.$/g, '');

async function ensureUniqueUsername(base, selfId) {
  let candidate = base;
  let i = 0;
  // try up to 10 variants; then fallback to id suffix
  while (i < 10) {
    const exists = await prisma.alumni.findFirst({
      where: { username: candidate, id: { not: selfId } },
      select: { id: true },
    });
    if (!exists) return candidate;
    i += 1;
    candidate = `${base}.${i}`;
  }
  return `${base}.${selfId}`;
}

/**
 * Get alumni profile with dashboard data
 */
const getProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: alumniSelect,
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    const fullName = [alumni.firstName, alumni.middleName, alumni.lastName].filter(Boolean).join(' ');
    const result = { ...alumni, fullName };

    return res.status(200).json({ alumni: result });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update alumni profile
 */
const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const existing = await prisma.alumni.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        dateOfBirth: true,
      },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // sanitize inputs
    const b = req.body || {};
    const prepared = {
      firstName: nonEmpty(cleanStr(b.firstName)),
      middleName: nonEmpty(cleanStr(b.middleName)),
      lastName: nonEmpty(cleanStr(b.lastName)),
      dateOfBirth: toDate(b.dateOfBirth),

      countryCode: nonEmpty(cleanStr(b.countryCode)),
      phoneNumber: nonEmpty(cleanStr(b.phoneNumber)),
      whatsappNumber: nonEmpty(cleanStr(b.whatsappNumber)),
      secondaryPhoneNumber: nonEmpty(cleanStr(b.secondaryPhoneNumber)),

      gender: nonEmpty(cleanStr(b.gender)),
      profilePhoto: nonEmpty(cleanStr(b.profilePhoto)),

      personalAddressLine1: nonEmpty(cleanStr(b.personalAddressLine1)),
      personalAddressLine2: nonEmpty(cleanStr(b.personalAddressLine2)),
      personalCity: nonEmpty(cleanStr(b.personalCity)),
      personalState: nonEmpty(cleanStr(b.personalState)),
      personalPostalCode: nonEmpty(cleanStr(b.personalPostalCode)),
      personalCountry: nonEmpty(cleanStr(b.personalCountry)),

      companyAddressLine1: nonEmpty(cleanStr(b.companyAddressLine1)),
      companyAddressLine2: nonEmpty(cleanStr(b.companyAddressLine2)),
      companyCity: nonEmpty(cleanStr(b.companyCity)),
      companyState: nonEmpty(cleanStr(b.companyState)),
      companyPostalCode: nonEmpty(cleanStr(b.companyPostalCode)),
      companyCountry: nonEmpty(cleanStr(b.companyCountry)),

      linkedinProfile: nonEmpty(cleanStr(b.linkedinProfile)),
      instagramProfile: nonEmpty(cleanStr(b.instagramProfile)),
      twitterProfile: nonEmpty(cleanStr(b.twitterProfile)),
      facebookProfile: nonEmpty(cleanStr(b.facebookProfile)),
      githubProfile: nonEmpty(cleanStr(b.githubProfile)),
      personalWebsite: nonEmpty(cleanStr(b.personalWebsite)),

      currentJobTitle: nonEmpty(cleanStr(b.currentJobTitle)),
      currentCompany: nonEmpty(cleanStr(b.currentCompany)),
      workExperience: nonEmpty(cleanStr(b.workExperience)),
      skills: nonEmpty(cleanStr(b.skills)),
      achievements: nonEmpty(cleanStr(b.achievements)),

      bio: nonEmpty(cleanStr(b.bio)),
      interests: nonEmpty(cleanStr(b.interests)),
      mentorshipAvailable: toBool(b.mentorshipAvailable),
      lookingForMentor: toBool(b.lookingForMentor),

      currentCity: nonEmpty(cleanStr(b.currentCity)),
      currentCountry: nonEmpty(cleanStr(b.currentCountry)),

      street: nonEmpty(cleanStr(b.street)),
      city: nonEmpty(cleanStr(b.city)),
      state: nonEmpty(cleanStr(b.state)),
      pincode: nonEmpty(cleanStr(b.pincode)),
      country: nonEmpty(cleanStr(b.country)),

      yearOfJoining: toInt(b.yearOfJoining),
      passingYear: toInt(b.passingYear),
      admissionInFirstYear: toBool(b.admissionInFirstYear),
      department: nonEmpty(cleanStr(b.department)),
      college: nonEmpty(cleanStr(b.college)),
      course: nonEmpty(cleanStr(b.course)),
    };

    // compute username if name changed
    let username = existing.username || null;
    const newFirst = prepared.firstName ?? existing.firstName;
    const newLast = prepared.lastName ?? existing.lastName;

    if ((prepared.firstName && prepared.firstName !== existing.firstName) ||
        (prepared.lastName && prepared.lastName !== existing.lastName) ||
        !username) {
      const base = slugify(`${newFirst}.${newLast}` || `user.${id}`);
      username = await ensureUniqueUsername(base, id);
    }

    // remove undefined to avoid overwriting with null
    Object.keys(prepared).forEach((k) => prepared[k] === undefined && delete prepared[k]);

    const updated = await prisma.alumni.update({
      where: { id },
      data: {
        ...prepared,
        username,
      },
      select: alumniSelect,
    });

    const fullName = [updated.firstName, updated.middleName, updated.lastName].filter(Boolean).join(' ');
    const result = { ...updated, fullName };

    return res.status(200).json({ message: 'Profile updated successfully', alumni: result });
  } catch (error) {
    console.error('Update profile error:', error);
    // handle unique constraint hints
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Duplicate value for a unique field (email/phone/username).' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const { id } = req.user;

    const [self, totals] = await prisma.$transaction([
      prisma.alumni.findUnique({
        where: { id },
        select: { passingYear: true, department: true },
      }),
      prisma.alumni.aggregate({
        _count: { _all: true },
        where: { isVerified: true },
      }),
    ]);

    if (!self) return res.status(404).json({ message: 'Alumni not found' });

    const [sameBatchCount, sameDepartmentCount, mentorsAvailable] = await prisma.$transaction([
      prisma.alumni.count({ where: { passingYear: self.passingYear, isVerified: true } }),
      prisma.alumni.count({ where: { department: self.department, isVerified: true } }),
      prisma.alumni.count({ where: { mentorshipAvailable: true, isVerified: true } }),
    ]);

    return res.status(200).json({
      stats: {
        totalAlumni: totals._count._all,
        sameBatchCount,
        sameDepartmentCount,
        mentorsAvailable,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add education record
 */
const addEducation = async (req, res) => {
  try {
    const { id } = req.user;
    const b = req.body || {};

    if (!b.institutionName || !b.degree || !b.fieldOfStudy || b.startYear === undefined) {
      return res.status(400).json({
        message: 'Institution name, degree, field of study, and start year are required',
      });
    }

    const payload = {
      alumniId: id,
      institutionName: cleanStr(b.institutionName),
      degree: cleanStr(b.degree),
      fieldOfStudy: cleanStr(b.fieldOfStudy),
      startYear: toInt(b.startYear),
      endYear: b.endYear === null ? null : toInt(b.endYear),
      isCurrentlyStudying: !!toBool(b.isCurrentlyStudying),
      grade: nonEmpty(cleanStr(b.grade)) || null,
      description: nonEmpty(cleanStr(b.description)) || null,
      activities: nonEmpty(cleanStr(b.activities)) || null,
    };

    const education = await prisma.education.create({ data: payload });

    return res.status(201).json({ message: 'Education record added successfully', education });
  } catch (error) {
    console.error('Add education error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update education record
 */
const updateEducation = async (req, res) => {
  try {
    const { id } = req.user;
    const { educationId } = req.params;

    const eduId = parseInt(educationId, 10);
    if (Number.isNaN(eduId)) {
      return res.status(400).json({ message: 'Invalid educationId' });
    }

    const existing = await prisma.education.findFirst({
      where: { id: eduId, alumniId: id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    const b = req.body || {};
    const data = {
      institutionName: nonEmpty(cleanStr(b.institutionName)),
      degree: nonEmpty(cleanStr(b.degree)),
      fieldOfStudy: nonEmpty(cleanStr(b.fieldOfStudy)),
      startYear: toInt(b.startYear),
      endYear: b.endYear === null ? null : toInt(b.endYear),
      isCurrentlyStudying: toBool(b.isCurrentlyStudying),
      grade: b.grade === null ? null : nonEmpty(cleanStr(b.grade)),
      description: b.description === null ? null : nonEmpty(cleanStr(b.description)),
      activities: b.activities === null ? null : nonEmpty(cleanStr(b.activities)),
    };
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const updated = await prisma.education.update({
      where: { id: eduId },
      data,
    });

    return res.status(200).json({ message: 'Education record updated successfully', education: updated });
  } catch (error) {
    console.error('Update education error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete education record
 */
const deleteEducation = async (req, res) => {
  try {
    const { id } = req.user;
    const { educationId } = req.params;

    const eduId = parseInt(educationId, 10);
    if (Number.isNaN(eduId)) {
      return res.status(400).json({ message: 'Invalid educationId' });
    }

    const existing = await prisma.education.findFirst({
      where: { id: eduId, alumniId: id },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    await prisma.education.delete({ where: { id: eduId } });

    return res.status(200).json({ message: 'Education record deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  addEducation,
  updateEducation,
  deleteEducation,
};
