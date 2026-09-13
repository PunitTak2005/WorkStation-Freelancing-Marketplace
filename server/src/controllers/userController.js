import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as cloudinaryService from '../services/cloudinaryService.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new ApiError('User not found', 404));
    res.status(200).json(new ApiResponse('Profile retrieved successfully', { user }));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'bio', 'location', 'phone', 'socialLinks', 'expertiseLevel', 
      'experience', 'title', 'twoFactorEnabled', 'experiences', 'certificationsList', 'email'
    ];
    
    if (req.user.role === 'freelancer') {
      allowedFields.push('skills', 'hourlyRate', 'education', 'certifications', 'availability', 'coverBanner', 'portfolio');
    } else if (req.user.role === 'client') {
      allowedFields.push('companyLogo', 'companyDescription', 'industry', 'hourlyRate', 'availability');
    }

    const updates = {};
    for (const key of Object.keys(req.body)) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    // 1. Email validation & uniqueness
    if (updates.email !== undefined && updates.email !== '') {
      const email = String(updates.email).trim().toLowerCase();
      if (email.length > 100) {
        return res.status(400).json({ status: 'fail', field: 'email', message: 'Email cannot exceed 100 characters.' });
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ status: 'fail', field: 'email', message: 'Enter a valid email address.' });
      }
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ status: 'fail', field: 'email', message: 'Email address is already in use.' });
      }
      updates.email = email;
    }

    // 2. Phone validation (Indian mobile)
    if (updates.phone !== undefined && updates.phone !== '') {
      const cleanPhone = String(updates.phone).trim();
      const digits = cleanPhone.replace(/\D/g, '');
      const tenDigits = (digits.startsWith('91') && digits.length === 12) ? digits.slice(2) : digits;
      if (tenDigits.length !== 10 || !/^[6-9]/.test(tenDigits)) {
        return res.status(400).json({ status: 'fail', field: 'phone', message: 'Enter a valid 10-digit Indian mobile number.' });
      }
      updates.phone = cleanPhone;
    }

    // 3. Location validation
    if (updates.location !== undefined && updates.location !== '') {
      const cleanLoc = String(updates.location).trim().replace(/\s+/g, ' ');
      if (cleanLoc.length < 3) {
        return res.status(400).json({ status: 'fail', field: 'location', message: 'Location must be at least 3 characters.' });
      }
      if (cleanLoc.length > 120) {
        return res.status(400).json({ status: 'fail', field: 'location', message: 'Location cannot exceed 120 characters.' });
      }
      if (/^\d+$/.test(cleanLoc)) {
        return res.status(400).json({ status: 'fail', field: 'location', message: 'Location cannot consist only of numbers.' });
      }
      updates.location = cleanLoc;
    }

    // 4. Billing Rate validation
    if (updates.hourlyRate !== undefined && updates.hourlyRate !== '' && updates.hourlyRate !== null) {
      const rate = Number(updates.hourlyRate);
      if (isNaN(rate) || rate < 0 || rate > 1000000) {
        return res.status(400).json({ status: 'fail', field: 'hourlyRate', message: 'Enter a valid positive amount up to ₹10,00,000.' });
      }
      updates.hourlyRate = rate;
    }

    // 5. Availability / Capacity validation
    if (updates.availability !== undefined && updates.availability !== '') {
      const validAvailability = ['available', 'busy', 'not_available'];
      if (!validAvailability.includes(updates.availability)) {
        return res.status(400).json({ status: 'fail', field: 'availability', message: 'Please select a valid capacity status.' });
      }
    }

    // 6. Public Links validation
    if (updates.socialLinks && typeof updates.socialLinks === 'object') {
      const { github, linkedin, website } = updates.socialLinks;
      if (github && !/^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/)?$/.test(github.trim())) {
        return res.status(400).json({ status: 'fail', field: 'github', message: 'Enter a valid GitHub profile URL.' });
      }
      if (linkedin && !/^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(\/)?$/.test(linkedin.trim())) {
        return res.status(400).json({ status: 'fail', field: 'linkedin', message: 'Enter a valid LinkedIn profile URL.' });
      }
      if (website && !/^https?:\/\/.+\..+/.test(website.trim())) {
        return res.status(400).json({ status: 'fail', field: 'website', message: 'Enter a valid website URL starting with https://' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json(new ApiResponse('Profile updated successfully', { user: updatedUser }));
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError('Please upload an avatar image', 400));
    }

    const user = await User.findById(req.user._id);
    
    if (user.avatar && user.avatar.publicId) {
      await cloudinaryService.deleteAsset(user.avatar.publicId);
    }

    const result = await cloudinaryService.uploadAvatar(req.file.buffer);
    
    user.avatar = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await user.save();

    res.status(200).json(new ApiResponse('Avatar updated successfully', { user }));
  } catch (error) {
    next(error);
  }
};

export const addPortfolioItem = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { title, description, url } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return next(new ApiError('Please upload at least one image for portfolio', 400));
    }

    const uploadPromises = req.files.map(file => cloudinaryService.uploadPortfolioImage(file.buffer));
    const results = await Promise.all(uploadPromises);
    
    const images = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id
    }));

    const newItem = {
      title,
      description,
      url,
      images
    };

    user.portfolio.push(newItem);
    await user.save();

    res.status(201).json(new ApiResponse('Portfolio item added successfully', { user }));
  } catch (error) {
    next(error);
  }
};

export const deletePortfolioItem = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const itemIndex = user.portfolio.findIndex(item => item._id.toString() === req.params.itemId);
    
    if (itemIndex === -1) {
      return next(new ApiError('Portfolio item not found', 404));
    }

    const item = user.portfolio[itemIndex];
    if (item.images && item.images.length > 0) {
      const deletePromises = item.images.map(img => cloudinaryService.deleteAsset(img.publicId));
      await Promise.all(deletePromises);
    }

    user.portfolio.splice(itemIndex, 1);
    await user.save();

    res.status(200).json(new ApiResponse('Portfolio item deleted successfully', { user }));
  } catch (error) {
    next(error);
  }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otp -refreshToken -resetPasswordToken -email');
      
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    const userObj = user.toObject ? user.toObject() : user;
    res.status(200).json(new ApiResponse('Profile retrieved successfully', { 
      ...userObj,
      user: userObj 
    }));
  } catch (error) {
    next(error);
  }
};

export const getFreelancers = async (req, res, next) => {
  try {
    const { 
      skill,
      skills, 
      level,
      expertiseLevel,
      experience, 
      minRate, 
      maxRate, 
      location, 
      minRating, 
      availability, 
      search,
      q,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { role: 'freelancer', status: 'active' };

    const searchParam = search || q;
    const skillParam = skill || skills;
    const andConditions = [];

    if (searchParam && searchParam.trim()) {
      const regex = { $regex: searchParam.trim(), $options: 'i' };
      andConditions.push({
        $or: [
          { name: regex },
          { title: regex },
          { skills: regex },
          { bio: regex }
        ]
      });
    }

    if (skillParam && skillParam.trim()) {
      const terms = skillParam.split(',').map(s => s.trim()).filter(Boolean);
      if (terms.length === 1) {
        andConditions.push({ skills: { $regex: terms[0], $options: 'i' } });
      } else if (terms.length > 1) {
        andConditions.push({ skills: { $in: terms.map(t => new RegExp(t, 'i')) } });
      }
    }

    // Expertise level filter: All, Beginner, Intermediate, Expert
    // Support ?level=Expert or ?expertiseLevel=Expert or ?experience=Expert
    const levelParam = level || expertiseLevel || experience;
    if (levelParam && levelParam !== 'All' && levelParam !== 'all') {
      const normalized = levelParam.toLowerCase() === 'beginner' ? 'entry' : levelParam.toLowerCase();
      andConditions.push({
        $or: [
          { experience: { $regex: `^(${normalized}|${levelParam})$`, $options: 'i' } },
          { expertiseLevel: { $regex: `^(${normalized}|${levelParam})$`, $options: 'i' } }
        ]
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }
    if (location && location !== 'All') query.location = { $regex: location, $options: 'i' };
    if (minRating) query.ratingsAverage = { $gte: Number(minRating) };
    if (availability && availability !== 'all') query.availability = availability;

    let sortOption = {};
    if (sort === 'rating_desc' || sort === 'rating') {
      sortOption = { ratingsAverage: -1, ratingsCount: -1 };
    } else if (sort === 'rate_asc' || sort === 'lowest_rate') {
      sortOption = { hourlyRate: 1 };
    } else if (sort === 'rate_desc' || sort === 'highest_rate') {
      sortOption = { hourlyRate: -1 };
    } else if (sort === 'completed_projects' || sort === 'experience') {
      sortOption = { completedProjects: -1 };
    } else if (sort) {
      const parts = sort.split(',');
      parts.forEach(part => {
        if (part.startsWith('-')) {
          sortOption[part.substring(1)] = -1;
        } else {
          sortOption[part] = 1;
        }
      });
    } else {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [freelancers, totalResults] = await Promise.all([
      User.find(query)
        .select('-password -otp -refreshToken -resetPasswordToken -email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalResults / limitNum) || 1;
    const hasMore = pageNum < totalPages;

    res.status(200).json(new ApiResponse('Freelancers retrieved successfully', {
      freelancers,
      data: freelancers,
      total: totalResults,
      page: pageNum,
      totalPages,
      pagination: {
        page: pageNum,
        currentPage: pageNum,
        totalPages,
        total: totalResults,
        totalResults,
        hasMore
      }
    }));
  } catch (error) {
    next(error);
  }
};

export const getFeaturedFreelancers = async (req, res, next) => {
  try {
    const freelancers = await User.find({ role: 'freelancer', status: 'active', ratingsAverage: { $exists: true } })
      .sort({ ratingsAverage: -1 })
      .limit(8)
      .select('name avatar title skills hourlyRate ratingsAverage completedProjects location bio');

    res.status(200).json(new ApiResponse('Featured freelancers retrieved successfully', { freelancers }));
  } catch (error) {
    next(error);
  }
};
