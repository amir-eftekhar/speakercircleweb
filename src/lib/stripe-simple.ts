// Simplified Stripe integration without Edge Functions
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createSimpleCheckout = async (classInfo: any, studentInfo: any) => {
  try {
    // For now, we'll redirect to a Stripe Payment Link
    // You can create these manually in Stripe Dashboard
    
    // Store the registration in Supabase first
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert([{
        student_id: studentInfo.id,
        parent_email: studentInfo.parent_email,
        class_id: classInfo.id,
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    // For now, show payment instructions
    alert(`
      Payment Setup Required:
      
      Class: ${classInfo.name}
      Amount: $${classInfo.price}
      Student: ${studentInfo.name}
      
      Please contact shalini@speakerscircle.com to complete payment.
      Your registration has been saved.
    `);

    return { success: true, registration };
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
};

// Function to manually mark payment as completed (for admin use)
export const markPaymentCompleted = async (registrationId: string, paymentDetails: any) => {
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
        class_id: paymentDetails.class_id
      }]);

    if (payError) throw payError;

    return { success: true };
  } catch (error) {
    console.error('Error marking payment completed:', error);
    throw error;
  }
};