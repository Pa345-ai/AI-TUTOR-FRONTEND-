import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all achievements
    const { data: achievements, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    res.status(200).json({ achievements: achievements || [] });

  } catch (error) {
    console.error('Achievements API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}