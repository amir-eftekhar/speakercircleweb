// Enhanced Stripe Payment Links Integration
export interface PaymentLinkConfig {
  [key: string]: string;
}

// Your actual Stripe Payment Links
export const STRIPE_PAYMENT_LINKS: PaymentLinkConfig = {
  // Advanced Gavel Club Membership - $95/month
  'advanced-gavel-club-95': 'https://buy.stripe.com/9B628s2esa3qfNM3WOeAg00',
  
  // Intermediate Gavel Club Membership - $75/month  
  'intermediate-gavel-club-75': 'https://buy.stripe.com/6oU8wQ4mAejG1WW0KCeAg02',
  
  // Youth Leadership Circle (YLC) - $150 one-time
  'youth-leadership-circle-150': 'https://buy.stripe.com/fZu6oI2es6Rebxw0KCeAg03',
  
  // Gavel Club Induction Fee - $150 one-time
  'gavel-club-induction-150': 'https://buy.stripe.com/bJe6oI4mAb7u598alceAg01',
};

export const getPaymentLinkForClass = (classInfo: any): string => {
  // If class has a custom payment link, use it
  if (classInfo.payment_link) {
    return classInfo.payment_link;
  }
  
  // Otherwise, try to match based on class name and price
  const className = classInfo.name.toLowerCase();
  const price = Math.round(classInfo.price);
  
  // Match based on class name and price
  if (className.includes('advanced') && price === 95) {
    return STRIPE_PAYMENT_LINKS['advanced-gavel-club-95'];
  }
  if (className.includes('intermediate') && price === 75) {
    return STRIPE_PAYMENT_LINKS['intermediate-gavel-club-75'];
  }
  if (className.includes('ylc') || className.includes('youth leadership')) {
    return STRIPE_PAYMENT_LINKS['youth-leadership-circle-150'];
  }
  if (className.includes('induction') && price === 150) {
    return STRIPE_PAYMENT_LINKS['gavel-club-induction-150'];
  }
  
  // Default fallback
  return '';
};

export const openStripePayment = (classInfo: any, studentInfo: any) => {
  const paymentLink = getPaymentLinkForClass(classInfo);
  
  if (!paymentLink) {
    alert(`Payment link not configured for this class.
    
Class: ${classInfo.name}
Price: $${classInfo.price}
Student: ${studentInfo.name}

Please contact the administrator.`);
    return;
  }
  
  // Open Stripe payment link in new tab
  const newWindow = window.open(paymentLink, '_blank', 'noopener,noreferrer');
  
  if (!newWindow) {
    // Popup blocked, show manual link
    const userConfirmed = confirm(`Popup blocked! Click OK to copy the payment link.
    
Class: ${classInfo.name}
Amount: $${classInfo.price}
Student: ${studentInfo.name}`);
    
    if (userConfirmed) {
      navigator.clipboard.writeText(paymentLink).then(() => {
        alert('Payment link copied! Paste it in a new tab to complete payment.');
      }).catch(() => {
        prompt('Copy this payment link:', paymentLink);
      });
    }
  } else {
    // Show success message
    alert(`Payment page opened in new tab.
    
Class: ${classInfo.name}
Amount: $${classInfo.price}
Student: ${studentInfo.name}

Complete your payment in the new tab. You'll receive confirmation from Stripe.`);
  }
};

// Function to validate payment link URL
export const isValidPaymentLink = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'buy.stripe.com' || urlObj.hostname === 'checkout.stripe.com';
  } catch {
    return false;
  }
};