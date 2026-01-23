// Vercel API Route for OmniMind AI Functions
// This route proxies requests to Supabase Edge Functions

import { NextApiRequest, NextApiResponse } from 'next'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query
  const functionPath = Array.isArray(path) ? path.join('/') : path

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ 
      error: 'Supabase configuration missing' 
    })
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai/${functionPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    })

    const data = await response.json()
    
    res.status(response.status).json(data)
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
