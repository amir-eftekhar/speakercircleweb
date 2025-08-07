// WebContainer-compatible Stripe integration
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createPaymentSession = async (classInfo: any, studentInfo: any) => {
  try {
    // Create registration record first
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .insert([{
        student_id: studentInfo.id,
        parent_email: studentInfo.parent_email,
        class_id: classInfo.id,
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (regError) throw regError;

    // For WebContainer demo, we'll simulate the payment process
    // In production, this would redirect to Stripe Checkout
    
    // Simulate successful payment after 2 seconds
    setTimeout(async () => {
      // Create payment record
      await supabase
        .from('payments')
        .insert([{
          user_email: studentInfo.parent_email,
          amount: classInfo.price,
          stripe_payment_id: `pi_demo_${Date.now()}`,
          status: 'paid',
          student_id: studentInfo.id,
          class_id: classInfo.id,
          receipt_url: `https://dashboard.stripe.com/test/payments/pi_demo_${Date.now()}`
        }]);

      // Update registration status
      await supabase
        .from('registrations')
        .update({ payment_status: 'paid' })
        .eq('id', registration.id);

      // Update class enrollment
      await supabase
        .from('classes')
        .update({ 
          current_enrolled: classInfo.current_enrolled + 1 
        })
        .eq('id', classInfo.id);

      // Redirect to confirmation
      window.location.href = `/confirmation?payment=pi_demo_${Date.now()}&student=${studentInfo.id}`;
    }, 2000);

    return { success: true, registration };
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
};

// Function for admin to manually process payments
export const processManualPayment = async (registrationId: string, paymentDetails: any) => {
  try {
    // Update registration status
    const { error: regError } = await supabase
      .from('registrations')
      .update({ payment_status: 'paid' })
      .eq('id', registrationId);

    if (regError) throw regError;

    // Create payment record
    const { error: payError } = await supabase
      .from('payments')
      .insert([{
        user_email: paymentDetails.email,
        amount: paymentDetails.amount,
        status: 'paid',
        student_id: paymentDetails.student_id,
        class_id: paymentDetails.class_id,
        stripe_payment_id: paymentDetails.stripe_payment_id || `manual_${Date.now()}`
      }]);

    if (payError) throw payError;

    return { success: true };
  } catch (error) {
    console.error('Error processing manual payment:', error);
    throw error;
  }
};

export { stripePromise };