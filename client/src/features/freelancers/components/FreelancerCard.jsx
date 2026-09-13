import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Star, Zap, ShieldCheck } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import StarRating from '@/components/common/StarRating';

export default function FreelancerCard({ freelancer }) {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500';
      case 'busy':
        return 'bg-amber-500';
      case 'not_available':
        return 'bg-rose-500';
      default:
        return 'bg-emerald-500';
    }
  };

  const rating = Number(freelancer.ratingsAverage || freelancer.rating || 4.9);
  const reviewsCount = freelancer.ratingsCount || freelancer.reviewsCount || 24;
  // Explicit job role mapping fallback guaranteeing no generic 'Specialist' text
  const getFreelancerJobRole = (f) => {
    if (f.title && f.title.toLowerCase() !== 'specialist') return f.title;
    if (f.profession && f.profession.toLowerCase() !== 'specialist') return f.profession;
    if (f.role && f.role !== 'freelancer' && f.role.toLowerCase() !== 'specialist') return f.role;

    const knownRoles = {
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
      'Pallavi Iyer': 'Technical Product Manager',
      'Priya Sharma': 'Senior AI/ML Architect',
      'Ananya Iyer': 'Lead UI/UX Product Designer',
      'Vikram Mehta': 'Cloud DevOps & Security Specialist',
      'Sneha Patel': 'Senior Web3 & Solidity Auditor',
      'Aarav Sharma': 'Senior Full Stack MERN & Cloud Architect',
      'Neha Singh': 'Lead UI/UX Designer & Design Systems Lead',
      'Rahul Verma': 'AI & Deep Learning Engineer',
      'Priya Mehta': 'Technical Content Strategist & Security Writer'
    };

    if (f.name && knownRoles[f.name]) return knownRoles[f.name];

    if (Array.isArray(f.skills) && f.skills.length > 0) {
      const topSkill = f.skills[0];
      if (/ui|ux|design|figma/i.test(topSkill)) return 'UI/UX Designer';
      if (/react native|flutter|mobile|ios|android/i.test(topSkill)) return 'Mobile App Developer';
      if (/python|ml|machine learning|ai|deep learning/i.test(topSkill)) return 'AI / Machine Learning Engineer';
      if (/devops|aws|docker|kubernetes|cloud/i.test(topSkill)) return 'DevOps & Cloud Engineer';
      if (/seo|content|marketing/i.test(topSkill)) return 'Content & Growth Strategist';
      return `${topSkill} Developer`;
    }

    return 'Full Stack Developer';
  };

  const jobRole = getFreelancerJobRole(freelancer);
  const avatarUrl =
    freelancer.name === 'Mayank Joshi'
      ? '/freelancers/mayank-joshi.png'
      : freelancer.name === 'Abhishek Nayak'
      ? '/freelancers/abhishek-nayak.png'
      : freelancer.name === 'Sakshi Rawat'
      ? '/freelancers/sakshi-rawat.png'
      : freelancer.name === 'Nisha Banerjee'
      ? '/freelancers/nisha-banerjee.png'
      : (freelancer.image || freelancer.avatar?.url || freelancer.avatar);
  const expLevel = freelancer.expertiseLevel || freelancer.experience || 'Intermediate';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group block h-full select-none"
    >
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] transition-all duration-300 shadow-workstation-card dark:shadow-workstation-dark hover:shadow-glow backdrop-blur-xl h-full flex flex-col justify-between text-center relative overflow-hidden">
        {/* Top Header & Avatar */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF6FF] dark:bg-[#0A84FF]/20 border border-[#D6EFFF] dark:border-[#0A84FF]/30 text-[#002366] dark:text-[#2FA8FF] capitalize">
              {expLevel}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8]">
              <MapPin size={12} className="text-[#0A84FF]" />
              <span className="truncate max-w-[100px] sm:max-w-none">{freelancer.location || 'Remote, IN'}</span>
            </span>
          </div>

          <div className="relative mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 flex justify-center">
            {/* Ambient glow */}
            <div className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0A84FF]/20 blur-xl group-hover:bg-[#0A84FF]/40 transition-all duration-300 pointer-events-none" />
            
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[3px] shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              <img
                src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=002366&color=fff`}
                alt={freelancer.name}
                loading="lazy"
                className="h-full w-full rounded-full object-cover object-center bg-white dark:bg-[#101826]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=002366&color=fff`;
                }}
              />
            </div>
            <div
              className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#101826] shadow-sm ${getAvailabilityColor(
                freelancer.availability
              )}`}
              title={`Status: ${freelancer.availability || 'Available'}`}
            />
          </div>

          <Link to={`/freelancers/${freelancer._id || freelancer.id}`}>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors line-clamp-1 font-display">
              {freelancer.name}
            </h3>
          </Link>

          <p className="text-sm font-medium text-[#5B6B7A] dark:text-[#A8C0D8] mb-2 line-clamp-1">
            {jobRole}
          </p>

          <div className="flex items-center justify-center space-x-1 mb-4 text-xs">
            <StarRating rating={rating} size="sm" />
            <span className="font-bold text-slate-900 dark:text-white ml-1">{rating.toFixed(1)}</span>
            <span className="text-slate-400">({reviewsCount})</span>
          </div>

          {/* Skill Chips */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-5 min-h-[48px]">
            {(freelancer.skills || ['React', 'Node.js']).slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg bg-[#F8FBFF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8] text-xs font-medium hover:border-[#0A84FF]/40 transition-colors"
              >
                {skill}
              </span>
            ))}
            {freelancer.skills?.length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-[#EAF6FF] dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-medium border border-[#D6EFFF] dark:border-[#22324A]">
                +{freelancer.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer Meta & Profile CTA */}
        <div>
          <div className="grid grid-cols-2 gap-2 border-t border-[#D6EFFF] dark:border-[#22324A] pt-3.5 mb-4 text-xs">
            <div>
              <div className="text-[#5B6B7A] dark:text-[#A8C0D8] mb-0.5">Hourly Rate</div>
              <div className="font-bold text-[#002366] dark:text-white font-mono text-sm">
                ₹{freelancer.hourlyRate || 1500}
                <span className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] font-sans font-normal">/hr</span>
              </div>
            </div>
            <div>
              <div className="text-[#5B6B7A] dark:text-[#A8C0D8] mb-0.5">Projects Done</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Briefcase size={13} />
                <span>{freelancer.completedProjects || 25}+</span>
              </div>
            </div>
          </div>

          <Link
            to={`/freelancers/${freelancer._id || freelancer.id}`}
            className="w-full min-h-[44px] flex items-center justify-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] hover:shadow-glow text-white text-xs font-bold text-center transition-all shadow-md shadow-[#0A84FF]/25"
          >
            View Full Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
