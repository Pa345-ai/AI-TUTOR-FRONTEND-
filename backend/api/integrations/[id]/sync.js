import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: integrationId } = req.query;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('user_id', userId)
      .single();

    if (integrationError || !integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    if (!integration.is_connected) {
      return res.status(400).json({ error: 'Integration not connected' });
    }

    // Perform sync based on integration type
    const syncResult = await performSync(integration);

    // Update integration with sync results
    await supabase
      .from('integrations')
      .update({
        last_sync_at: new Date().toISOString(),
        sync_status: syncResult.success ? 'success' : 'error',
        data: {
          ...integration.data,
          lastSyncItems: syncResult.itemsProcessed,
          errorCount: syncResult.errorCount,
          successRate: syncResult.successRate
        }
      })
      .eq('id', integrationId);

    res.status(200).json({
      success: true,
      syncResult,
      message: 'Sync completed successfully'
    });

  } catch (error) {
    console.error('Sync integration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function performSync(integration) {
  try {
    const { integration_type, settings } = integration;
    
    switch (integration_type) {
      case 'google_docs':
        return await syncGoogleDocs(settings);
      case 'quizlet':
        return await syncQuizlet(settings);
      case 'notion':
        return await syncNotion(settings);
      case 'youtube':
        return await syncYouTube(settings);
      default:
        return {
          success: false,
          error: 'Unsupported integration type',
          itemsProcessed: 0,
          errorCount: 1,
          successRate: 0
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      itemsProcessed: 0,
      errorCount: 1,
      successRate: 0
    };
  }
}

async function syncGoogleDocs(settings) {
  // Mock Google Docs sync - in production, use Google Docs API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    itemsProcessed: Math.floor(Math.random() * 20) + 5,
    errorCount: 0,
    successRate: 100,
    details: 'Successfully synced documents from Google Docs'
  };
}

async function syncQuizlet(settings) {
  // Mock Quizlet sync - in production, use Quizlet API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    itemsProcessed: Math.floor(Math.random() * 15) + 3,
    errorCount: 0,
    successRate: 100,
    details: 'Successfully synced flashcards from Quizlet'
  };
}

async function syncNotion(settings) {
  // Mock Notion sync - in production, use Notion API
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    success: true,
    itemsProcessed: Math.floor(Math.random() * 25) + 8,
    errorCount: 0,
    successRate: 100,
    details: 'Successfully synced pages from Notion'
  };
}

async function syncYouTube(settings) {
  // Mock YouTube sync - in production, use YouTube API
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    success: true,
    itemsProcessed: Math.floor(Math.random() * 10) + 2,
    errorCount: 0,
    successRate: 100,
    details: 'Successfully synced videos from YouTube'
  };
}