const url = 'https://fwftlctnvqfahaxqvgyj.supabase.co/rest/v1/subscribers';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZnRsY3RudnFmYWhheHF2Z3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDQxNjMsImV4cCI6MjA5NTE4MDE2M30.43lVkbijYMalI2zrq7x0ncNtmrYkeTwEhqr_JAVAZJM';

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({ email: 'test@example.com' })
})
.then(res => res.json().then(data => ({status: res.status, data})))
.then(res => console.log('Insert Result:', res))
.catch(err => console.error(err));
