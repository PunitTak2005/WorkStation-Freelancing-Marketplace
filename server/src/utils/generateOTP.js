export const generateOTP = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expiration time: 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { code, expiresAt };
};

export default generateOTP;
