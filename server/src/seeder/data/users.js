export const adminUser = {
  name: 'Admin Workstation',
  email: 'punittak2005@gmail.com',
  password: 'admin123',
  role: 'admin',
  phone: '+91 6367088841',
  verified: true,
  status: 'active',
  location: '184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India',
  bio: 'Platform administrator',
};

export const clientUsers = [
  { name: 'Rajesh Sharma', location: 'Delhi' },
  { name: 'Priya Patel', location: 'Mumbai' },
  { name: 'Arjun Verma', location: 'Bengaluru' },
  { name: 'Sneha Gupta', location: 'Hyderabad' },
  { name: 'Vikram Singh', location: 'Jaipur' },
  { name: 'Ananya Reddy', location: 'Chennai' },
  { name: 'Rohit Mehta', location: 'Pune' },
  { name: 'Kavita Nair', location: 'Kochi' },
  { name: 'Suresh Kumar', location: 'Ahmedabad' },
  { name: 'Deepa Iyer', location: 'Kolkata' },
  { name: 'Amit Joshi', location: 'Udaipur' },
  { name: 'Neha Agarwal', location: 'Lucknow' },
  { name: 'Karan Malhotra', location: 'Chandigarh' },
  { name: 'Pooja Deshmukh', location: 'Nagpur' },
  { name: 'Sanjay Pillai', location: 'Trivandrum' },
  { name: 'Meera Saxena', location: 'Indore' },
  { name: 'Aditya Chauhan', location: 'Dehradun' },
  { name: 'Ritu Bhatia', location: 'Noida' },
  { name: 'Manish Tiwari', location: 'Bhopal' },
  { name: 'Divya Kapoor', location: 'Gurgaon' },
].map(client => {
  const industries = ['FinTech', 'HealthTech', 'E-Commerce', 'SaaS', 'EdTech', 'Logistics', 'Marketing Agency', 'Media & Entertainment'];
  const ind = industries[Math.floor(Math.random() * industries.length)];
  return {
    name: client.name,
    email: `${client.name.toLowerCase().replace(' ', '.')}@email.com`,
    password: 'password123',
    role: 'client',
    verified: true,
    bio: `Founder & Hiring Manager at ${client.name.split(' ')[0]} Innovations. We build modern digital products.`,
    industry: ind,
    companyDescription: `${client.name.split(' ')[0]} Solutions is a premier ${ind} enterprise based in ${client.location}, scaling cutting-edge software products and hiring world-class freelancers.`,
    companyLogo: {
      url: '/clients/deepa-iyer.webp'
    },
    location: client.location,
    totalSpent: Math.floor(Math.random() * 450000) + 50000,
    ratingsAverage: (Math.random() * 1.5 + 3.5).toFixed(1),
    ratingsCount: Math.floor(Math.random() * 26) + 5,
  };
});

const freelancerNames = [
  'Aarav Desai', 'Ishita Sharma', 'Rohan Kulkarni', 'Ananya Mishra', 'Vikash Yadav',
  'Priyanka Jain', 'Aryan Pathak', 'Sakshi Rawat', 'Dev Pandey', 'Nisha Banerjee',
  'Harsh Soni', 'Simran Kaur', 'Nikhil Rathore', 'Meghna Das', 'Kartik Aggarwal',
  'Aditi Hegde', 'Rahul Thakur', 'Tanvi Shetty', 'Abhishek Nayak', 'Divya Chaudary',
  'Kunal Bhatia', 'Shruti Verma', 'Gaurav Sinha', 'Kavita Sharma', 'Mayank Joshi',
  'Kriti Sen', 'Pranav Menon', 'Riya Kapoor', 'Sanjay Singh', 'Neha Desai',
  'Aditya Roy', 'Shilpa Gupta', 'Vijay Kumar', 'Kavya Singh', 'Rakesh Nair',
  'Snehal Patil', 'Rishabh Jain', 'Swati Sharma', 'Tushar Agarwal', 'Pallavi Iyer'
];

const skillsPool = ['React', 'Node.js', 'Python', 'Django', 'Flutter', 'React Native', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'Next.js', 'Vue.js', 'Angular', 'TailwindCSS', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas', 'Power BI', 'Tableau', 'SEO', 'Google Ads', 'Content Writing', 'Copywriting', 'Cybersecurity', 'Penetration Testing', 'Swift', 'Kotlin', 'Java', 'C++', 'Go', 'Rust', 'GraphQL', 'Firebase', 'WordPress', 'Shopify'];

const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Jaipur', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Lucknow'];

export const freelancerUsers = freelancerNames.map(name => {
  const numSkills = Math.floor(Math.random() * 4) + 3;
  const shuffledSkills = [...skillsPool].sort(() => 0.5 - Math.random());
  const selectedSkills = shuffledSkills.slice(0, numSkills);
  const location = cities[Math.floor(Math.random() * cities.length)];
  const experiences = ['entry', 'intermediate', 'expert'];
  const experience = experiences[Math.floor(Math.random() * experiences.length)];
  const availabilities = ['available', 'available', 'available', 'busy'];

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

  const title = freelancerJobTitles[name] || `${selectedSkills[0]} Developer`;
  
  return {
    name,
    title,
    email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    password: 'password123',
    role: 'freelancer',
    verified: true,
    bio: `Passionate professional with expertise in ${selectedSkills.slice(0, 2).join(' and ')}. Delivered multiple successful projects and always eager to learn.`,
    skills: selectedSkills,
    hourlyRate: Math.floor(Math.random() * 4500) + 500,
    experience,
    expertiseLevel: experience === 'entry' ? 'Beginner' : (experience === 'expert' ? 'Expert' : 'Intermediate'),
    availability: availabilities[Math.floor(Math.random() * availabilities.length)],
    avatar: {
      url: (() => {
        const directMap = {
          // 20 Males (Strictly Male Portraits with exact name matching)
          'Aarav Desai': '/freelancers/aarav-desai.webp',
          'Rohan Kulkarni': '/freelancers/rohan-kulkarni.webp',
          'Vikash Yadav': '/freelancers/vikash-yadav.webp',
          'Aryan Pathak': '/freelancers/aryan-pathak.webp',
          'Dev Pandey': '/freelancers/kabir-sharma.webp',
          'Harsh Soni': '/freelancers/harsh-soni.webp',
          'Nikhil Rathore': '/freelancers/nikhil-rathore.webp',
          'Kartik Aggarwal': '/freelancers/arjun-mehta.webp',
          'Rahul Thakur': '/freelancers/rahul-verma.webp',
          'Abhishek Nayak': '/freelancers/abhishek-nayak.png',
          'Kunal Bhatia': '/freelancers/kunal-bhatia.webp',
          'Gaurav Sinha': '/freelancers/gaurav-sinha.webp',
          'Mayank Joshi': '/freelancers/mayank-joshi.png',
          'Pranav Menon': '/freelancers/aman-verma.webp',
          'Sanjay Singh': '/freelancers/sanjay-singh.webp',
          'Aditya Roy': '/freelancers/aditya-roy.webp',
          'Vijay Kumar': '/freelancers/arjun-singh.webp',
          'Rakesh Nair': '/freelancers/aarav-sharma.webp',
          'Rishabh Jain': '/freelancers/rishabh-jain.webp',
          'Tushar Agarwal': '/freelancers/tushar-agarwal.webp',

          // 20 Females (Strictly Female Portraits with exact name matching)
          'Ishita Sharma': '/freelancers/ishita-sharma.webp',
          'Ananya Mishra': '/freelancers/ananya-iyer.webp',
          'Priyanka Jain': '/freelancers/priya-sharma.webp',
          'Sakshi Rawat': '/freelancers/sakshi-rawat.png',
          'Nisha Banerjee': '/freelancers/nisha-banerjee.png',
          'Simran Kaur': '/freelancers/simran-kaur.webp',
          'Meghna Das': '/freelancers/meghna-das.webp',
          'Aditi Hegde': '/freelancers/aditi-hegde.webp',
          'Tanvi Shetty': '/freelancers/maya-lin.webp',
          'Divya Chaudary': '/freelancers/divya-chaudary.webp',
          'Divya Chowdhury': '/freelancers/divya-chaudary.webp',
          'Shruti Verma': '/freelancers/claire-dubois.webp',
          'Kavita Sharma': '/freelancers/kavita-sharma.webp',
          'Pooja Reddy': '/freelancers/kavita-sharma.webp',
          'Kriti Sen': '/freelancers/kriti-sen.webp',
          'Riya Kapoor': '/freelancers/riya-kapoor.webp',
          'Neha Desai': '/freelancers/neha-desai.webp',
          'Shilpa Gupta': '/freelancers/shilpa-gupta.webp',
          'Kavya Singh': '/freelancers/kavya-singh.webp',
          'Snehal Patil': '/freelancers/sneha-patel.webp',
          'Swati Sharma': '/freelancers/swati-sharma.webp',
          'Pallavi Iyer': '/freelancers/pallavi-iyer.webp',
        };
        return directMap[name] || '/freelancers/aarav-desai.webp';
      })(),
    },
    coverBanner: {
      url: '/banners/workstation-hero.webp',
    },
    completedProjects: Math.floor(Math.random() * 46) + 5,
    earnings: Math.floor(Math.random() * 950000) + 50000,
    ratingsAverage: (Math.random() * 2 + 3.0).toFixed(1),
    ratingsCount: Math.floor(Math.random() * 38) + 3,
    portfolio: [
      {
        title: `E-commerce App for ${location} Business`,
        description: `Developed a comprehensive platform using modern web technologies. Improved sales by 30%.`,
        projectUrl: 'https://github.com/sample',
        images: [{ url: '/projects/ecommerce-platform.webp' }],
      },
      {
        title: `Dashboard Analytics System`,
        description: `Created a scalable and interactive dashboard for tracking real-time user metrics and revenue.`,
        projectUrl: 'https://github.com/sample',
        images: [{ url: '/projects/analytics-dashboard.webp' }],
      }
    ].slice(0, Math.floor(Math.random() * 2) + 1),
    education: [
      {
        institution: ['IIT Delhi', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore'][Math.floor(Math.random() * 4)],
        degree: 'B.Tech in Computer Science',
        startYear: '2015',
        endYear: '2019'
      }
    ],
    certifications: [
      'AWS Certified Developer',
      'MongoDB Certified Associate',
      'Google Professional Cloud Architect',
      'Meta Front-End Developer'
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    socialLinks: {
      github: `https://github.com/${name.toLowerCase().replace(' ', '')}`,
      linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '')}`
    }
  };
});
