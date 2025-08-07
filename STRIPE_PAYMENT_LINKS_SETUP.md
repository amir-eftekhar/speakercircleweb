# 🔗 Stripe Payment Links Setup Guide

This guide shows you how to set up Stripe Payment Links for your SpeakersCircle classes.

## 🎯 **What This Does:**

✅ **Simple Integration** - No complex webhooks or Edge Functions needed
✅ **Secure Payments** - All payments processed by Stripe
✅ **Easy Management** - Manage payments through Stripe Dashboard
✅ **Student Tracking** - Continue using Supabase for admin functions

## 🚀 **Setup Steps:**

### **1. Create Products in Stripe Dashboard**

1. Go to **Stripe Dashboard → Products**
2. Click **"Add product"**
3. Create a product for each class:

   **Youth Leadership Circle (YLC)**
   - Name: "Youth Leadership Circle (YLC)"
   - Price: $150.00
   - Description: "YLC flat fee: $150 for up to 6 weeks"

   **Children's Interpersonal Communication Circle (CICC)**
   - Name: "Children's Interpersonal Communication Circle"
   - Price: $75.00
   - Description: "Communication skills for younger students"

   **Intermediate Groups**
   - Name: "Intermediate Groups"
   - Price: $75.00
   - Description: "For Grades 5–12. Developing intermediate communication skills"

   **Advanced Groups**
   - Name: "Advanced Groups"
   - Price: $75.00
   - Description: "Advanced communication and leadership development"

### **2. Create Payment Links**

For each product:

1. Click **"Create payment link"**
2. **Configure settings:**
   - ✅ Collect customer information (email required)
   - ✅ Allow promotion codes (optional)
   - Success URL: `https://your-domain.com/confirmation`
   - Cancel URL: `https://your-domain.com/register`

3. **Copy the payment link** (looks like: `https://buy.stripe.com/abc123...`)

### **3. Update Your Code**

Open `src/lib/stripe-payment-links.ts` and replace the placeholder URLs:

```typescript
export const STRIPE_PAYMENT_LINKS: PaymentLinkConfig = {
  // Replace these with your actual Stripe Payment Links
  'youth-leadership-circle-150': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_1',
  'children-communication-75': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_2',
  'intermediate-groups-75': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_3',
  'advanced-groups-75': 'https://buy.stripe.com/YOUR_ACTUAL_LINK_4',
  'default': 'https://buy.stripe.com/YOUR_DEFAULT_LINK'
};
```

## 🔄 **How It Works:**

1. **Student registers** → Form saved to Supabase
2. **Clicks "Pay with Stripe"** → Opens Stripe Payment Link in new tab
3. **Completes payment** → Stripe processes payment and sends confirmation
4. **Admin tracks manually** → View payments in Stripe Dashboard
5. **Update student status** → Mark as paid in admin panel

## 📊 **Managing Payments:**

### **In Stripe Dashboard:**
- View all payments and customer details
- Export payment data
- Handle refunds and disputes
- Send receipts to customers

### **In Your Admin Panel:**
- Track student registrations
- Manage class enrollments
- Move students between classes
- Update payment status manually

## 🎯 **Benefits:**

✅ **No Complex Setup** - No webhooks or Edge Functions needed
✅ **Stripe Handles Everything** - PCI compliance, security, receipts
✅ **Easy Updates** - Just update links when you change prices
✅ **Full Control** - Manage everything through Stripe Dashboard
✅ **Student Tracking** - Keep using Supabase for admin functions

## 🔧 **Testing:**

1. Use Stripe's test mode payment links
2. Test with card: `4242 4242 4242 4242`
3. Verify payment appears in Stripe Dashboard
4. Update student status in admin panel

## 🚀 **Going Live:**

1. Switch Stripe account to live mode
2. Create live payment links
3. Update the URLs in your code
4. Test with real payment methods

That's it! Your payment system is now live and secure. 🎉