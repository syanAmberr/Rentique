import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojdistgdrelfealmhcsz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZGlzdGdkcmVsZmVhbG1oY3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzY1NDksImV4cCI6MjA5MDk1MjU0OX0.VIPMTdXENvY453VS5PiIEfO0ss5dNCjshmy09m0_u7Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);