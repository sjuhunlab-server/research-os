const required = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY']
const missing = required.filter(k => !process.env[k])
if (missing.length) { console.error('Missing:', missing.join(', ')); process.exit(1) }
console.log('Environment variables look OK.')
