// Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'https://fwftlctnvqfahaxqvgyj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZnRsY3RudnFmYWhheHF2Z3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDQxNjMsImV4cCI6MjA5NTE4MDE2M30.43lVkbijYMalI2zrq7x0ncNtmrYkeTwEhqr_JAVAZJM';

// Initialize Supabase Client
// We use the UMD build loaded via CDN in index.html
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = client;
