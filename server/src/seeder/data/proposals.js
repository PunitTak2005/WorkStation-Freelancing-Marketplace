export const generateProposals = (jobIds, freelancerIds) => {
  const proposals = [];
  const existingPairs = new Set();
  
  const statuses = Array(80).fill('pending')
    .concat(Array(15).fill('shortlisted'))
    .concat(Array(15).fill('accepted'))
    .concat(Array(10).fill('rejected'));

  for (let i = 0; i < 120; i++) {
    let jobId, freelancerId, pair;
    
    // Ensure no duplicates
    do {
      jobId = jobIds[Math.floor(Math.random() * jobIds.length)];
      freelancerId = freelancerIds[Math.floor(Math.random() * freelancerIds.length)];
      pair = `${jobId}_${freelancerId}`;
    } while (existingPairs.has(pair) && existingPairs.size < jobIds.length * freelancerIds.length);
    
    existingPairs.add(pair);

    proposals.push({
      freelancer: freelancerId,
      job: jobId,
      coverLetter: `Hi, I have reviewed your requirements and I am confident I can deliver high-quality results. I have extensive experience with the required tech stack and a proven track record. Looking forward to discussing this further.`,
      bidAmount: Math.floor(Math.random() * 45000) + 5000,
      deliveryTime: Math.floor(Math.random() * 54) + 7,
      status: statuses[i]
    });
  }

  return proposals;
};
