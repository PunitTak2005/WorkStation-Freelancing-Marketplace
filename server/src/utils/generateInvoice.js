export const generateInvoice = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `WS-INV-${timestamp}${randomStr}`;
};

export default generateInvoice;
