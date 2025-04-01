import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project URL and public API key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common Supabase operations
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  
  if (!error && data?.user) {
    // Create a record in users table with additional details
    await supabase
      .from('users')
      .insert([{ id: data.user.id, name, email, role: 'worker' }]);
  }
  
  return { data, error };
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Box related operations
export const addBox = async (boxData) => {
  return await supabase.from('boxes').insert([boxData]);
};

export const getBoxes = async () => {
  return await supabase
    .from('boxes')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getBoxById = async (id) => {
  return await supabase
    .from('boxes')
    .select('*')
    .eq('id', id)
    .single();
};

export const exportBoxesData = async (fileUrl, workerId) => {
  return await supabase
    .from('exports')
    .insert([{ worker_id: workerId, file_url: fileUrl, export_date: new Date() }]);
};

export const getExports = async () => {
  return await supabase
    .from('exports')
    .select('*')
    .order('export_date', { ascending: false });
}; 