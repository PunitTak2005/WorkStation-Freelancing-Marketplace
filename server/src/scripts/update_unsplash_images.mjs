import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workstation';

async function updateUnsplashImages() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const usersCol = db.collection('users');
  const jobsCol = db.collection('jobs');

  // 1. Update users
  const unsplashUsers = await usersCol.find({
    $or: [
      { 'avatar.url': { $regex: 'unsplash', $options: 'i' } },
      { profileImage: { $regex: 'unsplash', $options: 'i' } },
      { fullAvatarUrl: { $regex: 'unsplash', $options: 'i' } },
      { 'coverBanner.url': { $regex: 'unsplash', $options: 'i' } },
      { 'companyLogo.url': { $regex: 'unsplash', $options: 'i' } },
      { 'portfolio.images.url': { $regex: 'unsplash', $options: 'i' } }
    ]
  }).toArray();

  console.log(`Found ${unsplashUsers.length} users with Unsplash references.`);

  for (const user of unsplashUsers) {
    const updates = {};
    const isClient = user.role === 'client';

    if (user.avatar?.url && user.avatar.url.includes('unsplash')) {
      const newAvatar = isClient ? '/clients/deepa-iyer.webp' : '/freelancers/aarav-desai.webp';
      updates['avatar.url'] = newAvatar;
      updates.profileImage = newAvatar;
      updates.fullAvatarUrl = newAvatar;
    }
    if (user.profileImage && user.profileImage.includes('unsplash')) {
      updates.profileImage = isClient ? '/clients/deepa-iyer.webp' : '/freelancers/aarav-desai.webp';
    }
    if (user.fullAvatarUrl && user.fullAvatarUrl.includes('unsplash')) {
      updates.fullAvatarUrl = isClient ? '/clients/deepa-iyer.webp' : '/freelancers/aarav-desai.webp';
    }
    if (user.coverBanner?.url && user.coverBanner.url.includes('unsplash')) {
      updates['coverBanner.url'] = '/banners/workstation-hero.webp';
    }
    if (user.companyLogo?.url && user.companyLogo.url.includes('unsplash')) {
      updates['companyLogo.url'] = '/clients/deepa-iyer.webp';
    }
    if (user.portfolio && Array.isArray(user.portfolio)) {
      const projectImgs = [
        '/projects/crm-dashboard.webp',
        '/projects/ecommerce-platform.webp',
        '/projects/analytics-dashboard.webp',
        '/projects/mobile-banking-app.webp'
      ];
      updates.portfolio = user.portfolio.map((p, idx) => {
        if (p.images && Array.isArray(p.images)) {
          p.images = p.images.map(img => {
            if (img.url && img.url.includes('unsplash')) {
              return { ...img, url: projectImgs[idx % projectImgs.length] };
            }
            return img;
          });
        }
        return p;
      });
    }

    if (Object.keys(updates).length > 0) {
      await usersCol.updateOne({ _id: user._id }, { $set: updates });
      console.log(`Updated user ${user.name || user._id}`);
    }
  }

  // 2. Also ensure Aarav Desai has the new banner and original avatar
  await usersCol.updateOne(
    { email: 'aarav.desai@email.com' },
    {
      $set: {
        'avatar.url': '/freelancers/aarav-desai.webp',
        profileImage: '/freelancers/aarav-desai.webp',
        fullAvatarUrl: '/freelancers/aarav-desai.webp',
        'coverBanner.url': '/banners/workstation-hero.webp'
      }
    }
  );

  // 3. Update client Deepa Iyer
  await usersCol.updateOne(
    { email: 'deepa.client@finedge.tech' },
    {
      $set: {
        'avatar.url': '/clients/deepa-iyer.webp',
        profileImage: '/clients/deepa-iyer.webp',
        fullAvatarUrl: '/clients/deepa-iyer.webp',
      }
    }
  );

  // 4. Update client Rahul Sharma
  await usersCol.updateOne(
    { email: 'rahul.client@travelsphere.in' },
    {
      $set: {
        'avatar.url': '/clients/rahul-sharma.webp',
        profileImage: '/clients/rahul-sharma.webp',
        fullAvatarUrl: '/clients/rahul-sharma.webp',
      }
    }
  );

  // 5. Update client Kavita Nair
  await usersCol.updateOne(
    { email: 'kavita.client@hrpulse.io' },
    {
      $set: {
        'avatar.url': '/clients/kavita-nair.webp',
        profileImage: '/clients/kavita-nair.webp',
        fullAvatarUrl: '/clients/kavita-nair.webp',
      }
    }
  );

  // Verify no unsplash remaining across all collections
  const remainingUnsplash = await usersCol.countDocuments({
    $or: [
      { 'avatar.url': { $regex: 'unsplash', $options: 'i' } },
      { profileImage: { $regex: 'unsplash', $options: 'i' } },
      { 'coverBanner.url': { $regex: 'unsplash', $options: 'i' } }
    ]
  });

  console.log(`Migration complete! Remaining users with Unsplash: ${remainingUnsplash}`);
  await mongoose.disconnect();
}

updateUnsplashImages().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
