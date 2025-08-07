# 🔗 Simple Stripe Payment Links Setup

This is the **simplest possible** Stripe integration - just payment links that open in new tabs!

## 🎯 **How It Works:**

1. **Student registers** → Registration saved to Supabase
2. **Clicks "Pay with Stripe"** → Opens Stripe Payment Link in new tab  
3. **Completes payment** → Stripe handles everything
4. **Admin manages manually** → Update student status in admin panel

## 🚀 **Setup Steps:**

### **1. Create Stripe Payment Links**

Go to **Stripe Dashboard → Payment Links** and create these 4 links:

#### **Advanced Gavel Club Membership**
- **Product Name**: Advanced Gavel Club Membership
- **Price**: $95.00 USD, Recurring monthly
- **Description**: Monthly fee: $95 (paid every month, even during breaks)

#### **Intermediate Gavel Club Membership**  
- **Product Name**: Intermediate Gavel Club Membership
- **Price**: $75.00 USD, Recurring monthly
- **Description**: Monthly fee: $75 (paid every month, even during breaks)

#### **Youth Leadership Circle (YLC)**
- **Product Name**: Youth Leadership Circle (YLC)
- **Price**: $150.00 USD, One-time
- **Description**: Flat fee; Duration: up to 6 weeks (intro program before you join the Gavel Club)

#### **Gavel Club Induction Fee**
- **Product Name**: Gavel Club Induction Fee  
- **Price**: $150.00 USD, One-time
- **Description**: One time; Post YLC Completion; $150

### **2. Copy Payment Link URLs**

After creating each payment link, copy the URL (looks like: `https://buy.stripe.com/abc123...`)

### **3. Update Your Code**

In `src/lib/stripe-payment-links.ts`, replace the empty strings with your actual payment links:

```typescript
export const STRIPE_PAYMENT_LINKS: PaymentLinkConfig = {
  'advanced-gavel-club-95': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_1',
  'intermediate-gavel-club-75': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_2', 
  'youth-leadership-circle-150': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_3',
  'gavel-club-induction-150': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_4',
};
```

## ✅ **That's It!**

Your payment system is now working:

- ✅ Students can register and pay through Stripe
- ✅ All payments managed in Stripe Dashboard  
- ✅ Admin panel continues working for student tracking
- ✅ No complex webhooks or Edge Functions needed
- ✅ Super simple and reliable

## 📊 **Managing Payments:**

### **In Stripe Dashboard:**
- View all payments and customer details
- Export payment data  
- Handle refunds
- Send receipts

### **In Your Admin Panel:**
- Track student registrations
- Manage class enrollments
- Update payment status manually when needed

This approach is perfect for your needs - simple, secure, and easy to maintain!