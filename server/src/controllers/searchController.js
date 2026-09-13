import Job from '../models/Job.js';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';
import { CATEGORIES } from '../constants/categories.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json(new ApiResponse('Empty search', { jobs: [], freelancers: [], categories: [] }));
    }

    const [jobs, freelancers] = await Promise.all([
      Job.find(
        { $text: { $search: q }, status: 'open' },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .select('title budget category createdAt'),
      
      User.find({
        role: 'freelancer',
        status: 'active',
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { bio: { $regex: q, $options: 'i' } },
          { skills: { $in: [new RegExp(q, 'i')] } }
        ]
      })
      .limit(5)
      .select('name avatar skills hourlyRate ratingsAverage')
    ]);

    const categoriesList = Array.isArray(CATEGORIES) ? CATEGORIES : Object.values(CATEGORIES || {});
    const matchedCategories = categoriesList.filter(cat => 
      cat.name && cat.name.toLowerCase().includes(q.toLowerCase())
    );

    res.status(200).json(new ApiResponse('Search successful', { 
      jobs, 
      freelancers, 
      categories: matchedCategories 
    }));
  } catch (error) {
    next(error);
  }
};

export const autocomplete = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json(new ApiResponse('Empty query', { suggestions: [] }));
    }

    const [jobs, freelancers] = await Promise.all([
      Job.find({ title: { $regex: q, $options: 'i' }, status: 'open' })
        .limit(3)
        .select('title _id'),
        
      User.find({ name: { $regex: q, $options: 'i' }, role: 'freelancer', status: 'active' })
        .limit(3)
        .select('name avatar _id')
    ]);

    // Aggregate distinct skills matching query
    const skillsAggregation = await User.aggregate([
      { $match: { role: 'freelancer', status: 'active' } },
      { $unwind: "$skills" },
      { $match: { skills: { $regex: q, $options: 'i' } } },
      { $group: { _id: "$skills" } },
      { $limit: 5 }
    ]);
    const skills = skillsAggregation.map(s => s._id);

    const suggestions = [
      ...jobs.map(j => ({ type: 'job', id: j._id, text: j.title })),
      ...freelancers.map(f => ({ type: 'freelancer', id: f._id, text: f.name, avatar: f.avatar?.url })),
      ...skills.map(s => ({ type: 'skill', text: s }))
    ];

    res.status(200).json(new ApiResponse('Autocomplete successful', { suggestions }));
  } catch (error) {
    next(error);
  }
};
