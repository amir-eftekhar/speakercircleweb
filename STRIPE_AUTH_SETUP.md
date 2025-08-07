# Speakers Circle - Authentication & Payment Setup

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Development Configuration
VITE_APP_URL=http://localhost:5173
```

## Database Setup

1. Run the new migration for parent profiles:
```sql
-- This migration creates the parent_profiles table and updates RLS policies
-- File: supabase/migrations/20250101000000_create_parent_profiles.sql
```

2. Enable RLS (Row Level Security) on all tables
3. Ensure Supabase Auth is properly configured

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your publishable and secret keys from the Stripe dashboard
3. Configure webhook endpoints for payment processing
4. Set up your product catalog for class payments

## Features Implemented

### User Authentication System
- **Separate from Admin**: Parents have their own login system
- **Sign Up Process**: Parents register with student information
- **Login/Logout**: Full authentication flow
- **Protected Routes**: Payment page requires login

### Navigation Updates
- **Login/Sign Up buttons** in navigation
- **User dropdown** when logged in showing:
  - User name and email
  - "Make Payment" link
  - Sign out option
- **Admin link** moved to small text (separate from user auth)

### Payment System
- **Protected Payment Page**: Only accessible when logged in
- **Embedded Stripe Checkout**: Real Stripe payment elements
- **Student Selection**: Choose which student to pay for
- **Amount Input**: Custom payment amounts
- **Account Summary**: Shows parent and student info

### Database Structure
```sql
-- Parent profiles linked to Supabase Auth
parent_profiles (
  id UUID (references auth.users),
  email TEXT,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Students linked to parents
students (
  id UUID,
  name TEXT,
  age INTEGER,
  grade TEXT,
  parent_id UUID (references parent_profiles)
)
```

## Usage Flow

1. **New Parent Registration**:
   - Click "Sign Up" in navigation
   - Fill out parent information
   - Add one or more students
   - Account created and logged in

2. **Existing Parent Login**:
   - Click "Login" in navigation
   - Enter email/password
   - Redirected to previous page or home

3. **Making Payments**:
   - Must be logged in
   - Click "Payment" in navigation or user dropdown
   - Select student and amount
   - Complete Stripe checkout
   - Secure payment processing

4. **Admin Access**:
   - Small "Admin" link in navigation
   - Separate authentication (SCAdmin2025)
   - Full admin panel functionality

## Security Features

- Row Level Security (RLS) on all tables
- Parents can only see/edit their own data
- Protected routes with authentication checks
- Secure Stripe payment processing
- Separate admin authentication system

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```