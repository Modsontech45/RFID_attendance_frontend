// Paystack payment utility functions
export interface PaymentData {
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  plan: string;
  schoolName?: string;
  customerName?: string;
}

export interface PaystackConfig {
  publicKey: string;
  currency: 'NGN' | 'USD' | 'GHS' | 'ZAR' | 'KES';
}

// Paystack configuration - Replace with your actual public key
const PAYSTACK_CONFIG: PaystackConfig = {
  publicKey: 'pk_test_your_paystack_public_key_here', // Replace with your actual public key
  currency: 'USD'
};

// Plan pricing in dollars (will be converted to kobo)
export const PLAN_PRICES = {
  'Starter': 29,
  'Professional': 79,
  'Enterprise': 199
};

export const initializePaystackPayment = async (paymentData: PaymentData): Promise<{ success: boolean; message: string; reference?: string }> => {
  try {
    // Check if Paystack is loaded
    if (typeof window === 'undefined' || !(window as any).PaystackPop) {
      throw new Error('Paystack library not loaded');
    }

    const PaystackPop = (window as any).PaystackPop;

    // Convert amount to kobo (Paystack uses kobo for NGN, cents for other currencies)
    const amountInKobo = paymentData.amount * 100;

    return new Promise((resolve) => {
      const handler = PaystackPop.setup({
        key: PAYSTACK_CONFIG.publicKey,
        email: paymentData.email,
        amount: amountInKobo,
        currency: PAYSTACK_CONFIG.currency,
        ref: generateReference(),
        metadata: {
          plan: paymentData.plan,
          school_name: paymentData.schoolName || '',
          customer_name: paymentData.customerName || '',
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: paymentData.plan
            },
            {
              display_name: "School Name",
              variable_name: "school_name", 
              value: paymentData.schoolName || ''
            }
          ]
        },
        callback: function(response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          resolve({
            success: true,
            message: 'Payment completed successfully!',
            reference: response.reference
          });
        },
        onClose: function() {
          // Payment cancelled
          resolve({
            success: false,
            message: 'Payment was cancelled'
          });
        }
      });

      handler.openIframe();
    });

  } catch (error) {
    console.error('Paystack initialization error:', error);
    return {
      success: false,
      message: 'Failed to initialize payment. Please try again.'
    };
  }
};

// Generate unique payment reference
const generateReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `synctuario_${timestamp}_${random}`;
};

// Verify payment on your backend (you'll need to implement this)
export const verifyPayment = async (reference: string): Promise<{ success: boolean; data?: any }> => {
  try {
    // This should call your backend to verify the payment with Paystack
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Payment verification error:', error);
    return { success: false };
  }
};

// Load Paystack script dynamically
export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if ((window as any).PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};