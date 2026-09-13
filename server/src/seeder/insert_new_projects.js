import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Job from '../models/Job.js';

async function insertProjects() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // 1. Ensure Client 1: Neha Agarwal
    let neha = await User.findOne({ name: 'Neha Agarwal' });
    if (!neha) {
      neha = await User.create({
        name: 'Neha Agarwal',
        email: 'neha.agarwal@example.com',
        password: 'Password123!',
        role: 'client',
        verified: true,
        status: 'active',
        location: 'Lucknow',
        bio: 'Startup Founder & Tech Entrepreneur',
        ratingsAverage: 4.95,
        ratingsCount: 38
      });
      console.log('Created client Neha Agarwal');
    }

    // 2. Ensure Client 2: Rahul Sharma
    let rahul = await User.findOne({ name: 'Rahul Sharma' });
    if (!rahul) {
      rahul = await User.create({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        password: 'Password123!',
        role: 'client',
        verified: true,
        status: 'active',
        location: 'Bengaluru',
        bio: 'Product Lead & FinTech Innovator',
        ratingsAverage: 4.98,
        ratingsCount: 54
      });
      console.log('Created client Rahul Sharma');
    }

    // 3. Upsert Project 1: AI Resume Analyzer Platform
    const p1Data = {
      title: 'AI Resume Analyzer Platform',
      category: 'AI & Machine Learning',
      budget: {
        min: 75000,
        max: 85000,
        type: 'fixed'
      },
      description: 'Build an AI-powered resume screening platform that automatically analyzes resumes, extracts skills, scores candidates, and generates hiring insights. The platform should include a modern dashboard, secure authentication, and scalable backend architecture.',
      skillsRequired: [
        'Python',
        'React',
        'Node.js',
        'MongoDB',
        'OpenAI API',
        'Tailwind CSS'
      ],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      experienceLevel: 'intermediate',
      status: 'open',
      locationType: 'remote',
      proposalCount: 9,
      client: neha._id
    };

    const existingP1 = await Job.findOne({ title: 'AI Resume Analyzer Platform' });
    if (existingP1) {
      await Job.findByIdAndUpdate(existingP1._id, p1Data);
      console.log('Updated existing Project 1: AI Resume Analyzer Platform');
    } else {
      await Job.create(p1Data);
      console.log('Inserted Project 1: AI Resume Analyzer Platform');
    }

    // 4. Upsert Project 2: FinTech Mobile Banking Dashboard
    const p2Data = {
      title: 'FinTech Mobile Banking Dashboard',
      category: 'Mobile Apps',
      budget: {
        min: 100000,
        max: 120000,
        type: 'fixed'
      },
      description: 'Design and develop a premium mobile banking dashboard featuring transaction analytics, spending insights, account management, and real-time notifications with a secure and responsive user experience.',
      skillsRequired: [
        'React Native',
        'TypeScript',
        'Firebase',
        'Node.js',
        'REST API',
        'UI/UX'
      ],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      experienceLevel: 'expert',
      status: 'open',
      locationType: 'remote',
      proposalCount: 14,
      client: rahul._id
    };

    const existingP2 = await Job.findOne({ title: 'FinTech Mobile Banking Dashboard' });
    if (existingP2) {
      await Job.findByIdAndUpdate(existingP2._id, p2Data);
      console.log('Updated existing Project 2: FinTech Mobile Banking Dashboard');
    } else {
      await Job.create(p2Data);
      console.log('Inserted Project 2: FinTech Mobile Banking Dashboard');
    }

    // 5. Ensure Client: Aarav Mehta (FinTrack Solutions, Bengaluru)
    let aarav = await User.findOne({ name: 'Aarav Mehta' });
    const aaravData = {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@fintrack.io',
      password: 'Password123!',
      role: 'client',
      verified: true,
      status: 'active',
      location: 'Bengaluru, Karnataka',
      title: 'Founder & CEO',
      companyDescription: 'FinTrack Solutions – modern fintech analytics and smart cash flow management platform.',
      industry: 'Fintech & Financial Software',
      ratingsAverage: 4.96,
      ratingsCount: 47,
      completedProjects: 28
    };

    if (!aarav) {
      aarav = await User.create(aaravData);
      console.log('Created Client: Aarav Mehta', aarav._id);
    } else {
      await User.findByIdAndUpdate(aarav._id, aaravData);
      console.log('Updated Client: Aarav Mehta', aarav._id);
    }

    // 6. Ensure Client: Priya Sharma (LearnSphere Academy, Jaipur)
    let priya = await User.findOne({ name: 'Priya Sharma' });
    const priyaData = {
      name: 'Priya Sharma',
      email: 'priya.sharma@learnsphere.edu',
      password: 'Password123!',
      role: 'client',
      verified: true,
      status: 'active',
      location: 'Jaipur, Rajasthan',
      title: 'Head of Product & Design',
      companyDescription: 'LearnSphere Academy – interactive modern e-learning mobile education ecosystem.',
      industry: 'EdTech & Digital Education',
      ratingsAverage: 4.98,
      ratingsCount: 62,
      completedProjects: 35
    };

    if (!priya) {
      priya = await User.create(priyaData);
      console.log('Created Client: Priya Sharma', priya._id);
    } else {
      await User.findByIdAndUpdate(priya._id, priyaData);
      console.log('Updated Client: Priya Sharma', priya._id);
    }

    // 7. Upsert Project 3: FinTrack Finance Dashboard
    const fintrackData = {
      title: 'FinTrack Finance Dashboard',
      category: 'Web Development',
      budget: {
        min: 65000,
        max: 65000,
        type: 'fixed'
      },
      description: 'Build a modern responsive finance analytics dashboard for a fintech startup. The dashboard should display transactions, revenue insights, expense tracking, interactive charts, user authentication, and role-based access.',
      skillsRequired: [
        'React.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'Chart.js',
        'JWT Authentication',
        'REST APIs',
        'Tailwind CSS'
      ],
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 5 Weeks
      experienceLevel: 'intermediate',
      status: 'open',
      locationType: 'remote',
      proposalCount: 8,
      client: aarav._id,
      company: 'FinTrack Solutions',
      image: '/projects/fintrack-finance-dashboard.webp',
      deliverables: [
        'Responsive dashboard',
        'User login/signup',
        'Revenue analytics',
        'Expense reports',
        'Export reports',
        'Admin panel'
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    };

    const existingFinTrack = await Job.findOne({ title: 'FinTrack Finance Dashboard' });
    let fintrackJob;
    if (existingFinTrack) {
      fintrackJob = await Job.findByIdAndUpdate(existingFinTrack._id, fintrackData, { new: true });
      console.log('Updated Project: FinTrack Finance Dashboard', fintrackJob._id);
    } else {
      fintrackJob = await Job.create(fintrackData);
      console.log('Inserted Project: FinTrack Finance Dashboard', fintrackJob._id);
    }

    // 8. Upsert Project 4: LearnSphere Mobile UI Design
    const learnsphereData = {
      title: 'LearnSphere Mobile UI Design',
      category: 'UI/UX Design',
      budget: {
        min: 32000,
        max: 32000,
        type: 'fixed'
      },
      description: 'Design a clean and engaging mobile UI for an e-learning application. The app should include onboarding, authentication, course browsing, video lessons, quizzes, certificates, and profile screens.',
      skillsRequired: [
        'Figma',
        'UI Design',
        'UX Research',
        'Prototyping',
        'Design Systems',
        'Mobile Design'
      ],
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 Weeks
      experienceLevel: 'intermediate',
      status: 'open',
      locationType: 'remote',
      proposalCount: 15,
      client: priya._id,
      company: 'LearnSphere Academy',
      image: '/projects/learnsphere-mobile-ui.webp',
      deliverables: [
        '15+ mobile screens',
        'Interactive prototype',
        'Design system',
        'Dark & Light mode',
        'Developer handoff assets'
      ],
      createdAt: new Date() // Today
    };

    const existingLearnSphere = await Job.findOne({ title: 'LearnSphere Mobile UI Design' });
    let learnsphereJob;
    if (existingLearnSphere) {
      learnsphereJob = await Job.findByIdAndUpdate(existingLearnSphere._id, learnsphereData, { new: true });
      console.log('Updated Project: LearnSphere Mobile UI Design', learnsphereJob._id);
    } else {
      learnsphereJob = await Job.create(learnsphereData);
      console.log('Inserted Project: LearnSphere Mobile UI Design', learnsphereJob._id);
    }

    const totalJobs = await Job.countDocuments();
    console.log(`Total jobs in MongoDB: ${totalJobs}`);

    // Update freelancer titles and Mayank Joshi avatar
    const freelancerJobTitles = {
      'Mayank Joshi': 'Full Stack Developer',
      'Aditi Hegde': 'UI/UX Designer',
      'Aditya Roy': 'React Developer',
      'Gaurav Sinha': 'DevOps Engineer',
      'Pooja Reddy': 'Mobile App Developer',
      'Divya Chaudary': 'Graphic Designer',
      'Aarav Desai': 'Full Stack MERN Engineer',
      'Ishita Sharma': 'Cloud & DevOps Architect',
      'Rohan Kulkarni': 'Mobile App Developer (React Native)',
      'Ananya Mishra': 'Product UI/UX Designer',
      'Vikash Yadav': 'Backend & Distributed Systems Engineer',
      'Priyanka Jain': 'Frontend React & Next.js Engineer',
      'Aryan Pathak': 'AI & Machine Learning Specialist',
      'Sakshi Rawat': 'Brand Identity & Visual Designer',
      'Dev Pandey': 'Mobile & Flutter Engineer',
      'Nisha Banerjee': 'SEO & Technical Content Strategist',
      'Harsh Soni': 'Full Stack Web Developer',
      'Simran Kaur': 'UI/UX & Design Systems Lead',
      'Nikhil Rathore': 'Cloud Infrastructure & Kubernetes Engineer',
      'Meghna Das': 'Mobile Application Specialist',
      'Kartik Aggarwal': 'Python & Data Analytics Engineer',
      'Rahul Thakur': 'React Native Cross-Platform Developer',
      'Tanvi Shetty': 'Digital Marketing & Growth Strategist',
      'Abhishek Nayak': 'Full Stack Node.js Engineer',
      'Kunal Bhatia': 'Cybersecurity & Penetration Tester',
      'Shruti Verma': 'Creative Director & Brand Designer',
      'Kavita Sharma': 'Data Science & BI Specialist',
      'Kriti Sen': 'Frontend UI Specialist',
      'Pranav Menon': 'Mobile Solutions Architect',
      'Riya Kapoor': 'Lead Product Designer',
      'Sanjay Singh': 'DevOps & CI/CD Engineer',
      'Neha Desai': 'Full Stack Web Architect',
      'Shilpa Gupta': 'Content & Copywriter Specialist',
      'Vijay Kumar': 'API & Cloud Solutions Engineer',
      'Kavya Singh': 'Mobile iOS & Android Engineer',
      'Rakesh Nair': 'Software Architect & Consultant',
      'Snehal Patil': 'Senior Web3 & Solidity Auditor',
      'Rishabh Jain': 'Machine Learning Engineer',
      'Swati Sharma': 'UI/UX Interaction Designer',
      'Tushar Agarwal': 'Database & Big Data Engineer',
      'Pallavi Iyer': 'Technical Product Manager'
    };

    const allFreelancers = await User.find({ role: 'freelancer' });
    for (const f of allFreelancers) {
      const assignedTitle = freelancerJobTitles[f.name] || (f.skills?.[0] ? `${f.skills[0]} Developer` : 'Full Stack Developer');
      const updateDoc = { title: assignedTitle };
      if (f.name === 'Mayank Joshi') {
        updateDoc.avatar = { url: '/freelancers/mayank-joshi.png' };
      }
      if (f.name === 'Abhishek Nayak') {
        updateDoc.avatar = { url: '/freelancers/abhishek-nayak.png' };
      }
      await User.findByIdAndUpdate(f._id, updateDoc);
    }
    console.log(`Updated ${allFreelancers.length} freelancers with titles.`);

    const mayankDoc = await User.findOne({ name: 'Mayank Joshi' });
    console.log('Mayank Joshi updated status:', {
      name: mayankDoc?.name,
      title: mayankDoc?.title,
      avatar: mayankDoc?.avatar
    });

    process.exit(0);
  } catch (err) {
    console.error('Error inserting projects:', err);
    process.exit(1);
  }
}

insertProjects();
