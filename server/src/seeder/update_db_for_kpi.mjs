import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workstation';

async function updateDb() {
  console.log('🔄 Connecting to MongoDB to update data for live KPI Cards...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const usersCol = db.collection('users');
  const jobsCol = db.collection('jobs');
  const proposalsCol = db.collection('proposals');
  const contractsCol = db.collection('contracts');
  const paymentsCol = db.collection('payments');

  // Map of names to clean local webp images
  const freelancerImageMap = {
    'Aarav Mehta': '/freelancers/aarav-sharma.webp',
    'Priya Kapoor': '/freelancers/priya-mehta.webp',
    'Rohan Patel': '/freelancers/rohan-kulkarni.webp',
    'Neha Singh': '/freelancers/neha-singh.webp',
    'Kunal Verma': '/freelancers/kunal-bhatia.webp',
    'Sneha Iyer': '/freelancers/sneha-patel.webp',
    'Aditya Joshi': '/freelancers/aditya-roy.webp',
    'Meera Nair': '/freelancers/kavita-sharma.webp',
    'Rajesh Sharma': '/freelancers/rajesh-kumar.webp',
  };

  // 1. Update the 8 primary freelancers with real local database images
  for (const [name, imgPath] of Object.entries(freelancerImageMap)) {
    const isOnline = ['Aarav Mehta', 'Priya Kapoor', 'Neha Singh', 'Sneha Iyer'].includes(name);
    await usersCol.updateMany(
      { name },
      {
        $set: {
          avatar: { url: imgPath },
          profileImage: imgPath,
          fullAvatarUrl: imgPath,
          isOnline: isOnline,
          online: isOnline,
          verified: true,
        },
      }
    );
  }

  // Also replace any other freelancers that have unsplash URLs with local avatars or UI avatars
  const unsplashUsers = await usersCol.find({
    $or: [
      { 'avatar.url': { $regex: 'unsplash', $options: 'i' } },
      { profileImage: { $regex: 'unsplash', $options: 'i' } },
    ],
  }).toArray();

  console.log(`Found ${unsplashUsers.length} users with Unsplash URLs. Updating with real local images...`);
  const availableWebps = [
    '/freelancers/aarav-desai.webp',
    '/freelancers/aditi-hegde.webp',
    '/freelancers/ananya-iyer.webp',
    '/freelancers/arjun-mehta.webp',
    '/freelancers/ishita-sharma.webp',
    '/freelancers/kavya-singh.webp',
    '/freelancers/rahul-verma.webp',
    '/freelancers/vikash-yadav.webp',
    '/freelancers/vikram-mehta.webp',
  ];

  for (let i = 0; i < unsplashUsers.length; i++) {
    const user = unsplashUsers[i];
    const assignedWebp = availableWebps[i % availableWebps.length];
    await usersCol.updateOne(
      { _id: user._id },
      {
        $set: {
          avatar: { url: assignedWebp },
          profileImage: assignedWebp,
          fullAvatarUrl: assignedWebp,
        },
      }
    );
  }

  // 2. Fetch Rajesh
  let rajesh = await usersCol.findOne({ email: 'rajesh.sharma@email.com' });
  if (!rajesh) {
    console.error('Rajesh not found!');
    process.exit(1);
  }

  // 3. Ensure payments match monthly breakdown in MongoDB
  // Apr: 12000, May: 18000, Jun: 21500, Jul: 28000, Aug: 34000, Sep: 15360 = 128860
  await paymentsCol.deleteMany({ payer: rajesh._id });

  const monthlyRecords = [
    { month: 3, name: 'Apr', amount: 12000, daysAgo: 150 },
    { month: 4, name: 'May', amount: 18000, daysAgo: 120 },
    { month: 5, name: 'Jun', amount: 21500, daysAgo: 90 },
    { month: 6, name: 'Jul', amount: 28000, daysAgo: 60 },
    { month: 7, name: 'Aug', amount: 34000, daysAgo: 30 },
    { month: 8, name: 'Sep', amount: 15360, daysAgo: 5 },
  ];

  const now = new Date();
  const currentYear = now.getFullYear();

  const aarav = await usersCol.findOne({ name: 'Aarav Mehta' });
  const sampleContract = await contractsCol.findOne({ client: rajesh._id });

  for (const m of monthlyRecords) {
    const pDate = new Date(currentYear, m.month, 15, 12, 0, 0);
    await paymentsCol.insertOne({
      payer: rajesh._id,
      recipient: aarav?._id || rajesh._id,
      contract: sampleContract?._id || new mongoose.Types.ObjectId(),
      amount: m.amount,
      netAmount: m.amount,
      platformFee: Math.round(m.amount * 0.05),
      currency: 'INR',
      type: 'escrow_deposit',
      status: 'succeeded',
      invoiceNumber: `INV-${currentYear}-${m.name.toUpperCase()}`,
      createdAt: pDate,
      updatedAt: pDate,
    });
  }
  console.log('✓ Inserted 6 monthly payment records totaling ₹128,860');

  // 4. Update client totalSpent
  await usersCol.updateOne(
    { _id: rajesh._id },
    { $set: { totalSpent: 128860 } }
  );

  // 5. Update Proposals dates so 5 proposals are from today
  const rajeshJobs = await jobsCol.find({ client: rajesh._id }).toArray();
  const jobIds = rajeshJobs.map(j => j._id);

  const allProposals = await proposalsCol.find({ job: { $in: jobIds } }).toArray();
  console.log(`Found ${allProposals.length} proposals on Rajesh's jobs`);

  // Set 5 of them to today
  const today = new Date();
  for (let i = 0; i < allProposals.length; i++) {
    const p = allProposals[i];
    let createdDate;
    if (i < 5) {
      // created today
      createdDate = new Date(today.getTime() - i * 3600 * 1000 * 2); // 2 hours ago, 4 hours ago, etc.
    } else {
      createdDate = new Date(today.getTime() - (i + 2) * 24 * 3600 * 1000);
    }
    await proposalsCol.updateOne(
      { _id: p._id },
      { $set: { createdAt: createdDate, status: 'pending' } }
    );
  }
  console.log('✓ Updated proposals with 5 created today');

  // 6. Contracts / Hired Freelancers
  // Ensure the 7 hired freelancers have active/completed contracts with Rajesh
  const namedFreelancers = await usersCol.find({
    name: { $in: ['Aarav Mehta', 'Priya Kapoor', 'Rohan Patel', 'Neha Singh', 'Kunal Verma', 'Sneha Iyer', 'Aditya Joshi'] }
  }).toArray();

  console.log(`Found ${namedFreelancers.length} named hired freelancers.`);

  // Ensure Mobile Banking UI is in_progress
  await jobsCol.updateOne(
    { title: 'Mobile Banking UI' },
    { $set: { status: 'in_progress' } }
  );

  await mongoose.disconnect();
  console.log('🎉 Database updated successfully for live KPI Cards!');
}

updateDb().catch(err => {
  console.error(err);
  process.exit(1);
});
