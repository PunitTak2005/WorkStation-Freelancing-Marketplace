import { z } from 'zod';

// Reusable basic primitives
export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dots, or hyphens');

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email address is required')
  .email('Please enter a valid email address')
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const indianPhoneSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^(\+91[\-\s]?)?[6789]\d{9}$/.test(val),
    'Please enter a valid 10-digit Indian phone number'
  );

// Authentication Schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['client', 'freelancer'], {
      required_error: 'Please select a role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  });

// Marketplace Job Schema
export const postJobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Project title must be at least 5 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string()
      .trim()
      .min(20, 'Please describe your project in at least 20 characters')
      .max(5000, 'Description cannot exceed 5000 characters'),
    category: z.string().min(1, 'Please select a category'),
    experienceLevel: z.enum(['entry', 'intermediate', 'expert'], {
      required_error: 'Please select an experience level',
    }),
    locationType: z.enum(['remote', 'onsite', 'hybrid'], {
      required_error: 'Please select a location type',
    }),
    budgetType: z.enum(['fixed', 'hourly']).default('fixed'),
    minBudget: z.coerce
      .number({ invalid_type_error: 'Minimum budget must be a number' })
      .positive('Minimum budget must be greater than 0'),
    maxBudget: z.coerce
      .number({ invalid_type_error: 'Maximum budget must be a number' })
      .positive('Maximum budget must be greater than 0'),
    deadline: z.string().min(1, 'Please specify a deadline date'),
  })
  .refine((data) => data.maxBudget >= data.minBudget, {
    message: 'Maximum budget cannot be less than minimum budget',
    path: ['maxBudget'],
  });

// Proposal Bidding Schema
export const milestoneSchema = z.object({
  title: z.string().trim().min(3, 'Milestone title must be at least 3 characters'),
  amount: z.coerce.number().positive('Milestone amount must be positive'),
  deadline: z.string().min(1, 'Milestone deadline is required'),
});

export const submitProposalSchema = z.object({
  freelancerName: z
    .string()
    .trim()
    .min(2, 'Freelancer name must be at least 2 characters')
    .max(50, 'Freelancer name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  contactEmail: emailSchema,
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (e.g. 6367088841)'),
  coverLetter: z
    .string()
    .trim()
    .min(100, 'Your cover letter must be at least 100 characters long to provide a thorough pitch')
    .max(2000, 'Cover letter cannot exceed 2000 characters'),
  bidAmount: z.coerce
    .number({ invalid_type_error: 'Expected budget must be a number' })
    .positive('Expected budget must be greater than zero'),
  deliveryTime: z.coerce
    .number({ invalid_type_error: 'Delivery timeline must be a number' })
    .int('Delivery timeline must be a whole number of days')
    .min(1, 'Minimum delivery timeline is 1 day')
    .max(365, 'Delivery timeline cannot exceed 365 days'),
  milestones: z.array(milestoneSchema).optional(),
});

// Profile Update Schemas
export const editFreelancerProfileSchema = z.object({
  name: nameSchema,
  bio: z.string().trim().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  hourlyRate: z.coerce
    .number({ invalid_type_error: 'Rate must be a number' })
    .nonnegative('Hourly rate cannot be negative')
    .max(50000, 'Rate cannot exceed ₹50,000/hr')
    .optional(),
  availability: z.enum(['available', 'busy', 'not_available']).default('available'),
  location: z.string().trim().max(100).optional(),
  phone: indianPhoneSchema,
});

export const editClientProfileSchema = z.object({
  name: nameSchema,
  companyDescription: z.string().trim().max(1000).optional(),
  industry: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  phone: indianPhoneSchema,
});

/**
 * Auto-formats raw Indian mobile digits into "+91 XXXXX XXXXX"
 */
export const formatIndianPhoneNumber = (value) => {
  if (!value) return '';
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  }
  digits = digits.slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 5) {
    return `+91 ${digits}`;
  }
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
};

/**
 * Validates Indian Phone number (10 digits, starting with 6,7,8,9)
 */
export const validateIndianPhone = (value) => {
  if (!value || !value.trim()) return 'Phone number is required.';
  const digits = value.replace(/\D/g, '');
  const tenDigits = (digits.startsWith('91') && digits.length === 12) ? digits.slice(2) : digits;
  if (tenDigits.length !== 10) {
    return 'Enter a valid 10-digit Indian mobile number.';
  }
  if (!/^[6-9]/.test(tenDigits)) {
    return 'Indian mobile numbers must start with 6, 7, 8, or 9.';
  }
  return null;
};

/**
 * Validates Email Address
 */
export const validateEmail = (value) => {
  if (!value || !value.trim()) return 'Email address is required.';
  const trimmed = value.trim();
  if (trimmed.length > 100) return 'Email cannot exceed 100 characters.';
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return 'Enter a valid email address.';
  }
  return null;
};

/**
 * Validates Location / Address
 */
export const validateLocation = (value) => {
  if (!value || !value.trim()) return 'Location is required.';
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (trimmed.length < 3) return 'Location must be at least 3 characters.';
  if (trimmed.length > 120) return 'Location cannot exceed 120 characters.';
  if (/^\d+$/.test(trimmed)) return 'Location cannot consist only of numbers.';
  return null;
};

/**
 * Validates Billing Rate
 */
export const validateBillingRate = (value) => {
  if (value === '' || value === undefined || value === null) return null;
  const num = Number(value);
  if (isNaN(num)) return 'Billing rate must be a valid number.';
  if (num < 0) return 'Billing rate cannot be negative.';
  if (num > 1000000) return 'Billing rate cannot exceed ₹10,00,000/hr.';
  return null;
};

/**
 * Validates URLs (GitHub, LinkedIn, Website)
 */
export const validateUrl = (url, type = 'website') => {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (type === 'github') {
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/)?$/;
    if (!githubRegex.test(trimmed)) {
      return 'Enter a valid GitHub profile URL (e.g. https://github.com/username).';
    }
  } else if (type === 'linkedin') {
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(\/)?$/;
    if (!linkedinRegex.test(trimmed)) {
      return 'Enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username).';
    }
  } else {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with https://';
      }
    } catch {
      return 'Enter a valid website URL starting with https://';
    }
  }
  return null;
};
