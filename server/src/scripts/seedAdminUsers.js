import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation';

async function seedAdminUsers() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI);

  // 1. Ensure Secondary Admin exists
  const secondaryAdminEmail = 'security.admin@workstation.dev';
  let secAdmin = await User.findOne({ email: secondaryAdminEmail });
  if (!secAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    secAdmin = await User.create({
      name: 'Pooja Deshmukh',
      email: secondaryAdminEmail,
      password: hashedPassword,
      role: 'admin',
      title: 'Head of Trust & Platform Security',
      bio: 'Oversees marketplace compliance, verification standards, escrow protection, and administrative auditing.',
      location: 'Bengaluru, Karnataka, India',
      phone: '+91 98201 54321',
      status: 'active',
      verified: true,
      avatar: { url: '/freelancers/pooja-deshmukh.webp' },
      twoFactorEnabled: true,
      lastActive: new Date(),
    });
    console.log('Created secondary admin:', secondaryAdminEmail);
  } else {
    console.log('Secondary admin already exists:', secondaryAdminEmail);
  }

  // 2. Introduce realistic variations among existing users (statuses, verification, locations, lastActive)
  const allUsers = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: 1 });
  console.log('Total non-admin users in database:', allUsers.length);

  const indianCities = [
    'Udaipur, Rajasthan, India',
    'Jaipur, Rajasthan, India',
    'Bengaluru, Karnataka, India',
    'Pune, Maharashtra, India',
    'Mumbai, Maharashtra, India',
    'Delhi-NCR, India',
    'Hyderabad, Telangana, India',
    'Ahmedabad, Gujarat, India',
  ];

  let suspendedCount = 0;
  let unverifiedCount = 0;

  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    let dirty = false;

    // Distribute cities if generic or missing
    if (!user.location || user.location === 'India' || user.location === 'India, Remote') {
      user.location = indianCities[i % indianCities.length];
      dirty = true;
    }

    // Set lastActive randomly across the last 14 days
    const daysAgo = (i % 14);
    const lastActiveDate = new Date();
    lastActiveDate.setDate(lastActiveDate.getDate() - daysAgo);
    lastActiveDate.setMinutes(lastActiveDate.getMinutes() - ((i * 17) % 60));
    user.lastActive = lastActiveDate;
    dirty = true;

    // Distribute suspended accounts on specific indices
    const isProtected = user.email.includes('aarav') || user.email.includes('punittak');
    if (!isProtected && (i === 7 || i === 15 || i === 23 || i === 31 || i === 47 || i === 59 || i === 71)) {
      user.status = 'suspended';
      suspendedCount++;
      dirty = true;
    } else if (!isProtected && (i === 11 || i === 29 || i === 41)) {
      user.status = 'pending';
      dirty = true;
    } else {
      user.status = 'active';
    }

    // Distribute unverified accounts (~15%)
    if (!isProtected && (i % 6 === 2)) {
      user.verified = false;
      unverifiedCount++;
      dirty = true;
    }

    if (dirty) {
      await user.save();
    }
  }

  // Summary counts
  const [total, freelancers, clients, admins, active, suspended, pending, verified] = await Promise.all([
    User.countDocuments({ isDeleted: { $ne: true } }),
    User.countDocuments({ role: 'freelancer', isDeleted: { $ne: true } }),
    User.countDocuments({ role: 'client', isDeleted: { $ne: true } }),
    User.countDocuments({ role: 'admin', isDeleted: { $ne: true } }),
    User.countDocuments({ status: 'active', isDeleted: { $ne: true } }),
    User.countDocuments({ status: 'suspended', isDeleted: { $ne: true } }),
    User.countDocuments({ status: 'pending', isDeleted: { $ne: true } }),
    User.countDocuments({ verified: true, isDeleted: { $ne: true } }),
  ]);

  console.log('======================================================');
  console.log('           ADMIN USERS SEEDING COMPLETED              ');
  console.log('======================================================');
  console.log('Total Users:       ', total);
  console.log('Freelancers:       ', freelancers);
  console.log('Clients:           ', clients);
  console.log('Admins:            ', admins, '(punittak2005@gmail.com, security.admin@workstation.dev)');
  console.log('Active Status:     ', active);
  console.log('Suspended Status:  ', suspended);
  console.log('Pending Status:    ', pending);
  console.log('Verified Accounts: ', verified);
  console.log('Unverified:        ', total - verified);
  console.log('======================================================');

  await mongoose.disconnect();
  process.exit(0);
}

seedAdminUsers().catch(err => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
