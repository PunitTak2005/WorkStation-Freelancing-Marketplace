export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async ({ 
  orderId, 
  amount, 
  currency = 'INR', 
  name = 'Workstation', 
  description, 
  onSuccess, 
  onFailure,
  prefill = {} 
}) => {
  const res = await loadRazorpayScript();

  if (!res) {
    console.error('Razorpay SDK failed to load');
    if (onFailure) onFailure(new Error('SDK failed to load'));
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use environment variable
    amount: amount,
    currency: currency,
    name: name,
    description: description,
    order_id: orderId,
    handler: function (response) {
      if (onSuccess) onSuccess(response);
    },
    prefill: {
      name: prefill.name || '',
      email: prefill.email || '',
      contact: prefill.contact || ''
    },
    theme: {
      color: '#4F46E5' // Indigo-600
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', function (response) {
    if (onFailure) onFailure(response.error);
  });
  
  paymentObject.open();
};
