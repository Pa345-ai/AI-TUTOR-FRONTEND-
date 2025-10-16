import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getIntegrations(req, res);
    case 'POST':
      return createIntegration(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getIntegrations(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const { data: integrations, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      integrations
    });

  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createIntegration(req, res) {
  try {
    const {
      userId,
      name,
      description,
      category,
      integrationType,
      settings = {},
      permissions = [],
      features = []
    } = req.body;

    if (!userId || !name || !integrationType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: integration, error } = await supabase
      .from('integrations')
      .insert({
        user_id: userId,
        name,
        description,
        category,
        integration_type: integrationType,
        settings,
        permissions,
        features,
        is_connected: false,
        is_active: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      integration
    });

  } catch (error) {
    console.error('Create integration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}