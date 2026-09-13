import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/workstation');
const db = mongoose.connection.db;

const users = await db.collection('users').find({ role: 'freelancer' }).project({ name: 1, avatar: 1, verified: 1, availability: 1, email: 1 }).toArray();
console.log('Freelancers in DB:', users.length);
console.log('Sample freelancer avatar:', JSON.stringify(users.slice(0, 4), null, 2));

const rajesh = await db.collection('users').findOne({ email: 'rajesh.sharma@email.com' });
console.log('Rajesh found:', !!rajesh);

if (rajesh) {
  const jobs = await db.collection('jobs').find({ client: rajesh._id }).toArray();
  console.log('Rajesh jobs:', jobs.length, jobs.map(j => ({ id: j._id, title: j.title, status: j.status })));
  
  const contracts = await db.collection('contracts').find({ client: rajesh._id }).toArray();
  console.log('Rajesh contracts:', contracts.length);
  
  const jobIds = jobs.map(j => j._id);
  const proposals = await db.collection('proposals').find({ job: { $in: jobIds } }).toArray();
  console.log('Proposals on Rajesh jobs:', proposals.length);
  
  const payments = await db.collection('payments').find({ payer: rajesh._id }).toArray();
  console.log('Payments by Rajesh:', payments.length, 'Total sum:', payments.reduce((acc, p) => acc + (p.amount || 0), 0));
}

await mongoose.disconnect();
