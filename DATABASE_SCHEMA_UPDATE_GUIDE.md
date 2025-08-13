# 🗃️ Database Schema Update Guide

## Overview
Your SpeakersCircle website now supports advanced features like secure admin authentication and dynamic payment configuration. To enable these features, you need to update your Supabase database schema by adding two new columns to the `site_settings` table.

## 🔄 Current Status
- ✅ **Website is fully functional** with temporary password system
- ✅ **Admin console accessible** using password: `SCAdmin2025`
- ✅ **All existing features working** without any database changes
- 🔧 **Advanced features ready** but require database schema update

## 📋 Required Database Changes

### Columns to Add:
1. **`payment_script_url`** (TEXT) - Stores the payment processor script URL
2. **`admin_password_hash`** (TEXT) - Stores secure admin password hash

## 🚀 Step-by-Step Update Instructions

### Option 1: Supabase Dashboard (Recommended)

1. **Access Supabase Dashboard:**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Navigate to your SpeakersCircle project

2. **Update site_settings Table:**
   - Go to **Table Editor** → **site_settings**
   - Click **"+ Add Column"** and add:
     ```
     Column name: payment_script_url
     Type: text
     Default value: (leave empty)
     Allow nullable: ✅ Yes
     ```
   - Click **"+ Add Column"** again and add:
     ```
     Column name: admin_password_hash
     Type: text
     Default value: (leave empty)
     Allow nullable: ✅ Yes
     ```

3. **Save Changes:**
   - Click **Save** for each column

### Option 2: SQL Editor

1. **Access SQL Editor:**
   - Go to **SQL Editor** in your Supabase dashboard

2. **Run This SQL:**
   ```sql
   ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_script_url TEXT;
   ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admin_password_hash TEXT;
   ```

3. **Execute:**
   - Click **Run** to execute the SQL

## ✅ After Database Update

### 1. Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Test Admin Console
- Visit: `http://localhost:5173/admin`
- Login with temporary password: `SCAdmin2025`
- Navigate to **Manage Settings**

### 3. Set Secure Admin Password
- In **Admin Settings** → **Admin Security** section
- Enter current password: `SCAdmin2025`
- Set your new secure password
- **The temporary password will be disabled after this**

### 4. Configure Payment Processing
- In **Admin Settings** → **Payment Configuration** section
- Add your payment processor script URL:
  - **Stripe:** `https://js.stripe.com/v3/`
  - **PayPal:** Your PayPal SDK URL
  - **Custom:** Your payment processor's JavaScript URL

## 🔒 Security Features

### Smart Authentication System:
- **Before database update:** Uses temporary password `SCAdmin2025`
- **After database update:** Tries database password first, falls back to temporary
- **After password change:** Only database password works, temporary disabled

### Password Transition:
1. ✅ **Current:** Temporary password works (`SCAdmin2025`)
2. 🔄 **After schema update:** Both temporary and database passwords work
3. 🔒 **After password change:** Only your custom password works

## 🎯 Feature Status After Update

| Feature | Before Update | After Update |
|---------|---------------|--------------|
| Admin Access | ✅ Temporary password | ✅ Secure database password |
| Content Management | ✅ Working | ✅ Working |
| Payment Configuration | ⚠️ Not available | ✅ Fully configurable |
| Dynamic Payment Scripts | ⚠️ Not available | ✅ Embedded scripts |
| Password Change | ⚠️ Not available | ✅ Secure updates |

## 🛠️ Troubleshooting

### If Schema Update Fails:
1. **Check permissions:** Ensure you have admin access to Supabase
2. **Manual approach:** Add columns one by one using the dashboard
3. **Contact support:** Reach out to Supabase support if needed

### If Features Don't Work After Update:
1. **Restart dev server:** `npm run dev`
2. **Clear browser cache:** Hard refresh the admin console
3. **Check console:** Look for any JavaScript errors

### If You Get Locked Out:
- The temporary password `SCAdmin2025` will always work until you set a custom one
- Clear localStorage: `localStorage.removeItem('sc_admin_auth')`

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the database columns were added correctly
3. Ensure the development server restarted after schema update
4. The temporary password system ensures you're never locked out

## 🎉 Benefits After Update

1. **🔐 Secure Authentication:** Database-stored password hashes
2. **💳 Flexible Payment Processing:** Support any payment provider
3. **⚙️ Admin Control:** Complete website control through admin console
4. **🔄 Seamless Transition:** No downtime or access issues
5. **🛡️ Backup Security:** Temporary password as fallback

---

**Remember:** Your website works perfectly right now with the temporary password. The database update only adds advanced features - it doesn't break anything existing!
