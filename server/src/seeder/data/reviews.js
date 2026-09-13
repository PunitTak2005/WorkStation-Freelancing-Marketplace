export const generateReviews = (completedContracts) => {
  const reviews = [];
  
  const sampleComments = [
    "Excellent work! Delivered on time and exceeded expectations.",
    "Good communication and quality output. Will hire again.",
    "Very professional approach and great attention to detail.",
    "Completed the project successfully, highly recommended.",
    "Solid performance, minor delays but great final product."
  ];

  completedContracts.slice(0, 30).forEach(contract => {
    const score = Math.floor(Math.random() * 2) + 4;
    reviews.push({
      contract: contract._id,
      reviewer: contract.client,
      reviewee: contract.freelancer,
      job: contract.job,
      rating: {
        communication: score,
        quality: score,
        deadline: score,
        overall: score,
      },
      comment: sampleComments[Math.floor(Math.random() * sampleComments.length)]
    });
  });

  return reviews;
};
