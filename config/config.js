import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yzniefgixzvancbnfqbi.supabase.co'
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bmllZmdpeHp2YW5jYm5mcWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE4MjAxNTcsImV4cCI6MTk4NzM5NjE1N30.k8CCKaselSYxu2NRVVVBS0tl7Q2pfdcXjGOleeHeUEA'
export const supabase = createClient(supabaseUrl, supabaseKey)
