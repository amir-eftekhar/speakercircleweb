#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateSchema() {
  try {
    console.log('🔄 Updating database schema...');
    
    // Add payment_script_url column
    console.log('📝 Adding payment_script_url column...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_script_url TEXT;'
    });
    
    if (error1 && !error1.message.includes('already exists')) {
      console.error('Error adding payment_script_url:', error1);
    } else {
      console.log('✅ payment_script_url column added/exists');
    }

    // Add admin_password_hash column
    console.log('📝 Adding admin_password_hash column...');
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admin_password_hash TEXT;'
    });
    
    if (error2 && !error2.message.includes('already exists')) {
      console.error('Error adding admin_password_hash:', error2);
    } else {
      console.log('✅ admin_password_hash column added/exists');
    }

    // Check if we have any site_settings records
    const { data: settings, error: selectError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('Error checking site_settings:', selectError);
      return;
    }

    if (!settings || settings.length === 0) {
      console.log('📝 Creating default site_settings record...');
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert([{
          slogan: 'Your Voice is your Superpower',
          hero_text: 'Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire.',
          footer_text: '© 2025 SpeakersCircle. All rights reserved.',
          contact_email: 'shalini@speakerscircle.com',
          payment_script_url: null,
          admin_password_hash: null
        }]);

      if (insertError) {
        console.error('Error creating default settings:', insertError);
      } else {
        console.log('✅ Default site_settings record created');
      }
    } else {
      console.log('✅ site_settings record already exists');
    }

    console.log('🎉 Database schema update complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Test the admin console and payment configuration');
    console.log('3. The temporary password (SCAdmin2025) will still work until you set a new one');

  } catch (error) {
    console.error('❌ Error updating schema:', error);
  }
}

// Alternative method using direct SQL execution
async function updateSchemaSQL() {
  try {
    console.log('🔄 Attempting to update schema using direct SQL...');
    
    // Try to add columns directly
    const { data, error } = await supabase
      .from('site_settings')
      .select('payment_script_url, admin_password_hash')
      .limit(1);

    if (error) {
      console.log('⚠️  New columns not found, they need to be added manually');
      console.log('');
      console.log('🔧 Manual steps required:');
      console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
      console.log('2. Navigate to your project');
      console.log('3. Go to Table Editor > site_settings');
      console.log('4. Add these columns:');
      console.log('   - Column name: payment_script_url, Type: text');
      console.log('   - Column name: admin_password_hash, Type: text');
      console.log('');
      console.log('OR run this SQL in the SQL Editor:');
      console.log('');
      console.log('ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_script_url TEXT;');
      console.log('ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admin_password_hash TEXT;');
      return;
    }

    console.log('✅ Columns already exist or were added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the schema update
console.log('🚀 Starting database schema update for SpeakersCircle...');
updateSchemaSQL();
