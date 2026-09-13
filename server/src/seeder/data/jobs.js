export const generateJobs = (clientIds) => {
  const jobs = [];

  // 2 Premium Freelance Projects (Prompt Guarantee)
  jobs.push({
    title: 'AI Resume Analyzer Platform',
    description: 'We are building an enterprise-grade AI Resume Analyzer platform that parses candidate CVs, extracts structured data, evaluates role fitness using LLM scoring, and produces comprehensive candidate scorecards. Features include resume parsing, AI skill matching, candidate dashboard, admin analytics, and secure authentication.',
    category: 'AI & Machine Learning',
    budget: { min: 75000, max: 85000, type: 'fixed' },
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    experienceLevel: 'intermediate',
    skillsRequired: ['Python', 'React', 'Node.js', 'MongoDB', 'OpenAI API', 'Tailwind CSS'],
    locationType: 'remote',
    status: 'open',
    client: clientIds[0]
  });

  jobs.push({
    title: 'FinTech Mobile Banking Dashboard',
    description: 'Looking for a senior mobile architect to develop a sleek, ultra-responsive cross-platform mobile banking dashboard. Key requirements include interactive portfolio tracking, transaction history with instant categorization, spending breakdown charts, push notification alerts, and end-to-end encrypted authentication.',
    category: 'Mobile Apps',
    budget: { min: 100000, max: 120000, type: 'fixed' },
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    experienceLevel: 'expert',
    skillsRequired: ['React Native', 'TypeScript', 'Firebase', 'Node.js', 'REST API', 'UI/UX'],
    locationType: 'remote',
    status: 'open',
    client: clientIds[1] || clientIds[0]
  });
  
  const categories = [
    { name: 'Web Development', count: 8 },
    { name: 'Mobile Apps', count: 7 },
    { name: 'UI/UX Design', count: 7 },
    { name: 'Graphic Design', count: 5 },
    { name: 'AI & Machine Learning', count: 5 },
    { name: 'Data Science', count: 5 },
    { name: 'Content Writing', count: 6 },
    { name: 'Video Editing', count: 5 },
    { name: 'Digital Marketing', count: 6 },
    { name: 'Cybersecurity', count: 6 }
  ];

  const jobTemplates = {
    'Web Development': [
      { title: 'React Dashboard', skills: ['React', 'Node.js', 'TailwindCSS'] },
      { title: 'MERN Ecommerce', skills: ['React', 'Node.js', 'MongoDB', 'Express'] },
      { title: 'Full-stack Next.js Blog Platform', skills: ['Next.js', 'MongoDB', 'TypeScript'] }
    ],
    'Mobile Apps': [
      { title: 'Mobile Fitness App', skills: ['Flutter', 'Firebase', 'Mobile App'] },
      { title: 'Design Mobile App UI for Fitness Tracker', skills: ['Flutter', 'Firebase'] },
      { title: 'React Native Delivery App', skills: ['React Native', 'Node.js'] }
    ],
    'UI/UX Design': [
      { title: 'Redesign SaaS Platform Interface', skills: ['Figma', 'Adobe XD'] },
      { title: 'Wireframing for FinTech App', skills: ['Figma', 'Illustrator'] }
    ],
    'Graphic Design': [
      { title: 'Logo Design Project', skills: ['Photoshop', 'Illustrator', 'Branding'] },
      { title: 'Logo and Brand Identity', skills: ['Photoshop', 'Illustrator'] },
      { title: 'Social Media Post Designs', skills: ['Photoshop', 'Figma'] }
    ],
    'AI & Machine Learning': [
      { title: 'AI Resume Builder', skills: ['Python', 'NLP', 'FastAPI', 'LangChain'] },
      { title: 'Python ML Model for Customer Churn Prediction', skills: ['Python', 'Machine Learning', 'TensorFlow'] },
      { title: 'NLP based Chatbot', skills: ['Python', 'PyTorch'] }
    ],
    'Data Science': [
      { title: 'Data Analytics Dashboard', skills: ['Data Analysis', 'Tableau', 'Pandas', 'Python'] },
      { title: 'Data Analysis and Visualization Dashboard', skills: ['Data Analysis', 'Tableau', 'Pandas'] },
      { title: 'Sales Forecasting Model', skills: ['Python', 'Data Analysis'] }
    ],
    'Content Writing': [
      { title: 'Content Writing Project', skills: ['Content Writing', 'SEO', 'Copywriting'] },
      { title: 'SEO Optimized Blog Posts for Tech Startup', skills: ['Content Writing', 'SEO'] },
      { title: 'Website Copywriting', skills: ['Copywriting'] }
    ],
    'Video Editing': [
      { title: 'YouTube Vlogs Editing', skills: ['Premiere Pro', 'After Effects'] },
      { title: 'Promotional Video for Instagram', skills: ['Premiere Pro'] }
    ],
    'Digital Marketing': [
      { title: 'SEO Campaign', skills: ['SEO', 'Google Ads', 'Analytics'] },
      { title: 'Google Ads Campaign Management', skills: ['Google Ads', 'SEO'] },
      { title: 'Social Media Strategy for E-commerce', skills: ['SEO', 'Content Writing'] }
    ],
    'Cybersecurity': [
      { title: 'Web Application Penetration Testing', skills: ['Cybersecurity', 'Penetration Testing'] },
      { title: 'Security Audit for Mobile App', skills: ['Cybersecurity'] }
    ]
  };

  const statuses = Array(45).fill('open').concat(Array(10).fill('in_progress')).concat(Array(5).fill('completed'));
  let statusIndex = 0;

  categories.forEach(category => {
    for (let i = 0; i < category.count; i++) {
      const template = jobTemplates[category.name][i % jobTemplates[category.name].length];
      const budgetType = Math.random() > 0.5 ? 'fixed' : 'hourly';
      let budget;
      if (budgetType === 'fixed') {
        budget = { min: 5000, max: Math.floor(Math.random() * 195000) + 10000, type: 'fixed' };
      } else {
        budget = { min: 500, max: Math.floor(Math.random() * 2500) + 1000, type: 'hourly' };
      }

      jobs.push({
        title: `${template.title} ${i + 1}`,
        description: `We are looking for an experienced professional to work on this project. You will be responsible for end-to-end delivery of the requirements. The ideal candidate should have strong communication skills and a proven track record of successful deliveries in similar domains.`,
        category: category.name,
        budget,
        deadline: new Date(Date.now() + (Math.floor(Math.random() * 150) + 30) * 24 * 60 * 60 * 1000),
        experienceLevel: ['entry', 'intermediate', 'expert'][Math.floor(Math.random() * 3)],
        skillsRequired: template.skills,
        locationType: Math.random() > 0.8 ? 'hybrid' : 'remote',
        status: statuses[statusIndex++],
        client: clientIds[Math.floor(Math.random() * clientIds.length)]
      });
    }
  });

  return jobs;
};
