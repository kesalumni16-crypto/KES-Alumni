const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get published news articles with pagination
 */
const getNewsArticles = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category = '', 
      search = '',
      tags = ''
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      isPublished: true,
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tags && { tags: { hasSome: tags.split(',') } }),
    };

    // Get articles with pagination
    const articles = await prisma.newsArticle.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: [
        { isPinned: 'desc' },
        { publishedAt: 'desc' }
      ],
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            role: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalArticles = await prisma.newsArticle.count({ where });

    res.status(200).json({
      articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalArticles / limit),
        totalArticles,
        hasNext: skip + articles.length < totalArticles,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get news articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get single news article by ID
 */
const getNewsArticleById = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await prisma.newsArticle.findUnique({
      where: { 
        id: parseInt(articleId),
        isPublished: true 
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            role: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ article });
  } catch (error) {
    console.error('Get news article by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create new news article (Admin/SuperAdmin only)
 */
const createNewsArticle = async (req, res) => {
  try {
    const { id: authorId } = req.user;
    const {
      title,
      content,
      excerpt,
      imageUrl,
      category = 'general',
      tags = [],
      isPublished = false,
      isPinned = false,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        content,
        excerpt,
        imageUrl,
        category,
        tags,
        isPublished,
        isPinned,
        authorId,
        publishedAt: isPublished ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Article created successfully',
      article,
    });
  } catch (error) {
    console.error('Create news article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update news article (Admin/SuperAdmin only)
 */
const updateNewsArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const updateData = req.body;

    // Check if article exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id: parseInt(articleId) },
    });

    if (!existingArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // If publishing for the first time, set publishedAt
    if (updateData.isPublished && !existingArticle.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const article = await prisma.newsArticle.update({
      where: { id: parseInt(articleId) },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Article updated successfully',
      article,
    });
  } catch (error) {
    console.error('Update news article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete news article (Admin/SuperAdmin only)
 */
const deleteNewsArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await prisma.newsArticle.findUnique({
      where: { id: parseInt(articleId) },
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await prisma.newsArticle.delete({
      where: { id: parseInt(articleId) },
    });

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete news article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all articles for admin management
 */
const getAllArticlesForAdmin = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category = '', 
      search = '',
      status = '' // published, draft, all
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      ...(category && { category }),
      ...(status === 'published' && { isPublished: true }),
      ...(status === 'draft' && { isPublished: false }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const articles = await prisma.newsArticle.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            role: true,
          },
        },
      },
    });

    const totalArticles = await prisma.newsArticle.count({ where });

    res.status(200).json({
      articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalArticles / limit),
        totalArticles,
        hasNext: skip + articles.length < totalArticles,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get all articles for admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNewsArticles,
  getNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getAllArticlesForAdmin,
};