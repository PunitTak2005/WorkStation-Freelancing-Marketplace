import mongoose from 'mongoose';
import Job from '../models/Job.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as cloudinaryService from '../services/cloudinaryService.js';
import { CATEGORIES } from '../constants/categories.js';

export const createJob = async (req, res, next) => {
  try {
    const jobData = { ...req.body, client: req.user._id };

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => cloudinaryService.uploadAttachment(file.buffer, file.originalname));
      const results = await Promise.all(uploadPromises);
      jobData.attachments = results.map((result, index) => ({
        url: result.secure_url,
        publicId: result.public_id,
        name: req.files[index].originalname
      }));
    }

    if (typeof jobData.skillsRequired === 'string') {
      try {
        jobData.skillsRequired = JSON.parse(jobData.skillsRequired);
      } catch (e) {
        jobData.skillsRequired = jobData.skillsRequired.split(',').map(s => s.trim());
      }
    }
    
    if (jobData.budget && typeof jobData.budget === 'string') {
        jobData.budget = JSON.parse(jobData.budget);
    }

    const job = await Job.create(jobData);
    await job.populate('client', 'name avatar');

    req.app.get('io')?.emit('project:count_changed');

    res.status(201).json(new ApiResponse('Job created successfully', { job }));
  } catch (error) {
    next(error);
  }
};

export const getProjectsCount = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      if (status === 'active') {
        query.status = { $in: ['open', 'in_progress'] };
      } else if (status !== 'all') {
        query.status = status;
      }
    } else {
      // By default count active projects (open + in_progress)
      query.status = { $in: ['open', 'in_progress'] };
    }

    const count = await Job.countDocuments(query);
    const total = await Job.countDocuments({});

    res.status(200).json(new ApiResponse('Projects count fetched successfully', {
      count,
      activeProjects: count,
      total
    }));
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { 
      search, 
      q,
      category, 
      minBudget, 
      maxBudget, 
      experienceLevel, 
      experience,
      locationType, 
      status = 'open', 
      skillsRequired,
      skills,
      sort,
      lastId,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Title search (full title, partial title, case insensitive regex)
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      query.title = { $regex: searchTerm.trim(), $options: 'i' };
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      const catClean = category.replace(/\+/g, ' ').trim();
      let regexPattern = `^${catClean}$`;
      if (/web(\s*dev)?(elopment)?/i.test(catClean)) {
        regexPattern = '^(Web Development|Web Dev)$';
      } else if (/mobile/i.test(catClean)) {
        regexPattern = '^(Mobile Development|Mobile App Development|Mobile Apps)$';
      } else if (/ai|machine\s*learning/i.test(catClean)) {
        regexPattern = '^(AI & ML|AI & Machine Learning|AI/ML)$';
      } else if (/ui|ux/i.test(catClean)) {
        regexPattern = '^(UI/UX Design|UI/UX)$';
      } else if (/marketing/i.test(catClean)) {
        regexPattern = '^(Digital Marketing|Marketing)$';
      }
      query.category = { $regex: regexPattern, $options: 'i' };
    }

    // Budget range filter
    if (minBudget || maxBudget) {
      const min = Number(minBudget);
      const max = Number(maxBudget);
      const budgetConds = [];

      if (!isNaN(min) && !isNaN(max)) {
        budgetConds.push(
          { 'budget.min': { $lte: max }, 'budget.max': { $gte: min } },
          { budget: { $gte: min, $lte: max } }
        );
      } else if (!isNaN(min)) {
        budgetConds.push(
          { 'budget.max': { $gte: min } },
          { 'budget.min': { $gte: min } },
          { budget: { $gte: min } }
        );
      } else if (!isNaN(max)) {
        budgetConds.push(
          { 'budget.min': { $lte: max } },
          { budget: { $lte: max } }
        );
      }

      if (budgetConds.length > 0) {
        query.$or = budgetConds;
      }
    }

    // Experience level
    const expLevel = experienceLevel || experience;
    if (expLevel && expLevel !== 'All' && expLevel !== 'all') {
      query.experienceLevel = { $regex: `^${expLevel}$`, $options: 'i' };
    }

    // Location type
    if (locationType && locationType !== 'All' && locationType !== 'all') {
      query.locationType = locationType;
    }

    // Skills
    const skillsList = skillsRequired || skills;
    if (skillsList) {
      const parsedSkills = skillsList.split(',').map(s => s.trim()).filter(Boolean);
      if (parsedSkills.length > 0) {
        query.skillsRequired = { $in: parsedSkills.map(s => new RegExp(s, 'i')) };
      }
    }

    if (lastId) {
      query._id = { $lt: lastId };
    }

    // Sorting
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'budget_desc' || sort === 'highest_budget') {
      sortOption = { 'budget.max': -1, 'budget.min': -1 };
    } else if (sort === 'budget_asc' || sort === 'lowest_budget') {
      sortOption = { 'budget.min': 1 };
    } else if (sort === 'deadline_asc' || sort === 'deadline_soon') {
      sortOption = { deadline: 1 };
    } else if (sort === 'proposals_desc' || sort === 'most_popular') {
      sortOption = { proposalCount: -1 };
    } else if (sort) {
      const parts = sort.split(',');
      parts.forEach(part => {
        if (part.startsWith('-')) {
          sortOption[part.substring(1)] = -1;
        } else {
          sortOption[part] = 1;
        }
      });
      if (!sortOption._id) sortOption._id = -1;
    } else {
      sortOption = { createdAt: -1, _id: -1 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('client', 'name avatar ratingsAverage location verified companyDescription industry title'),
      Job.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;
    const hasMore = pageNum < totalPages;
    const nextCursor = jobs.length > 0 ? jobs[jobs.length - 1]._id : null;

    if (req.user) {
      jobs.forEach(job => {
        job._doc.isSaved = job.savedBy && job.savedBy.includes(req.user._id);
      });
    }

    res.status(200).json(new ApiResponse('Jobs retrieved successfully', { 
      jobs,
      data: jobs,
      total,
      page: pageNum,
      totalPages,
      pagination: {
        page: pageNum,
        totalPages,
        total,
        hasMore
      },
      hasMore, 
      nextCursor 
    }));
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Job not found', 404));
    }

    const job = await Job.findById(id)
      .populate('client', 'name avatar ratingsAverage location completedProjects createdAt companyDescription industry title');
      
    if (!job) return next(new ApiError('Job not found', 404));

    if (req.user) {
        job._doc.isSaved = job.savedBy && job.savedBy.includes(req.user._id);
    }

    const similarJobs = await Job.find({ 
      category: job.category, 
      status: 'open',
      _id: { $ne: job._id } 
    }).limit(4).populate('client', 'name avatar');

    const jobObj = job.toObject ? job.toObject() : job;
    res.status(200).json(new ApiResponse('Job retrieved successfully', { 
      ...jobObj,
      job: jobObj, 
      similarJobs 
    }));
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError('Job not found', 404));
    
    if (job.client.toString() !== req.user._id.toString()) {
      return next(new ApiError('Not authorized to update this job', 403));
    }

    if (job.status !== 'open') {
      return next(new ApiError('Cannot update a job that is not open', 400));
    }

    const allowedUpdates = ['title', 'description', 'budget', 'skillsRequired', 'category', 'experienceLevel', 'locationType'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();
    req.app.get('io')?.emit('project:count_changed');
    res.status(200).json(new ApiResponse('Job updated successfully', { job }));
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError('Job not found', 404));
    
    if (job.client.toString() !== req.user._id.toString()) {
      return next(new ApiError('Not authorized to delete this job', 403));
    }

    job.status = 'cancelled';
    await job.save();

    req.app.get('io')?.emit('project:count_changed');

    res.status(200).json(new ApiResponse('Job cancelled successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 12, search, q } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const userId = req.user?._id || req.user?.id;
    const query = { client: userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      query.title = { $regex: searchTerm.trim(), $options: 'i' };
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('client', 'name avatar ratingsAverage location verified companyDescription industry title'),
      Job.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;
    const hasMore = pageNum < totalPages;

    return res.status(200).json({
      success: true,
      message: 'My jobs retrieved successfully',
      jobs,
      data: jobs,
      pagination: {
        page: pageNum,
        pages: totalPages,
        currentPage: pageNum,
        totalPages,
        total,
        totalResults: total,
        limit: limitNum,
        hasMore,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSaveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError('Job not found', 404));

    const isSaved = job.savedBy.includes(req.user._id);
    
    if (isSaved) {
      job.savedBy.pull(req.user._id);
    } else {
      job.savedBy.addToSet(req.user._id);
    }
    
    await job.save();

    res.status(200).json(new ApiResponse(isSaved ? 'Job removed from saved' : 'Job saved successfully', { isSaved: !isSaved }));
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query = { savedBy: req.user._id };

    const [jobs, totalResults] = await Promise.all([
      Job.find(query)
        .populate('client', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalResults / Number(limit));

    res.status(200).json(new ApiResponse('Saved jobs retrieved successfully', {
      jobs,
      pagination: { currentPage: Number(page), totalPages, totalResults }
    }));
  } catch (error) {
    next(error);
  }
};

export const getTrendingJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .sort({ proposalCount: -1, createdAt: -1 })
      .limit(6)
      .populate('client', 'name avatar');

    res.status(200).json(new ApiResponse('Trending jobs retrieved', { jobs }));
  } catch (error) {
    next(error);
  }
};

export const getJobCategories = async (req, res, next) => {
  try {
    const aggResult = await Job.aggregate([
      { $match: { status: 'open' } },
      {
        $project: {
          normalizedCategory: {
            $switch: {
              branches: [
                {
                  case: { $regexMatch: { input: '$category', regex: /web(\s*dev)?(elopment)?/i } },
                  then: 'Web Development'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /mobile/i } },
                  then: 'Mobile Development'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /ai|machine\s*learning/i } },
                  then: 'AI & ML'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /ui|ux/i } },
                  then: 'UI/UX Design'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /content|writing/i } },
                  then: 'Content Writing'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /marketing/i } },
                  then: 'Digital Marketing'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /data\s*science/i } },
                  then: 'Data Science'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /graphic/i } },
                  then: 'Graphic Design'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /video/i } },
                  then: 'Video Editing'
                },
                {
                  case: { $regexMatch: { input: '$category', regex: /cyber/i } },
                  then: 'Cybersecurity'
                }
              ],
              default: '$category'
            }
          }
        }
      },
      {
        $group: {
          _id: '$normalizedCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1, _id: 1 } }
    ]);

    const total = await Job.countDocuments({ status: 'open' });

    // Map counts
    const countsMap = {};
    aggResult.forEach(item => {
      if (item._id) countsMap[item._id] = item.count;
    });

    // Primary categories requested
    const primaryCategoryNames = [
      'Web Development',
      'Mobile Development',
      'AI & ML',
      'UI/UX Design',
      'Content Writing',
      'Digital Marketing',
      'Data Science',
    ];

    // Build the category list ensuring primary categories exist with counts, plus any other active categories with count > 0
    const categories = primaryCategoryNames.map(name => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      count: countsMap[name] || 0
    }));

    // Append any other active categories (e.g. Graphic Design, Video Editing, Cybersecurity) with count > 0
    Object.keys(countsMap).forEach(catName => {
      if (!primaryCategoryNames.includes(catName)) {
        categories.push({
          name: catName,
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          count: countsMap[catName]
        });
      }
    });

    res.status(200).json(new ApiResponse('Job categories retrieved', {
      total,
      categories
    }));
  } catch (error) {
    next(error);
  }
};
