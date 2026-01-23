# Supabase Setup Guide

This guide will help you set up Supabase for the AI Tutoring App backend.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `ai-tutoring-app`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

## 2. Get Project Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

## 3. Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the entire contents of `supabase-schema-complete.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema
5. Verify all tables and functions are created successfully

## 4. Configure Row Level Security (RLS)

The schema includes RLS policies, but you may need to enable them:

1. Go to Authentication → Policies
2. Verify that RLS is enabled for all tables
3. Test the policies with different user roles

## 5. Set Up File Storage

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `avatars` (for user profile pictures)
   - `documents` (for uploaded files)
   - `media` (for images, videos, audio)
   - `exports` (for exported data)
   - `imports` (for imported data)

3. Set bucket policies:
   ```sql
   -- Allow authenticated users to upload to their own folders
   CREATE POLICY "Users can upload their own files" ON storage.objects
   FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow users to view their own files
   CREATE POLICY "Users can view their own files" ON storage.objects
   FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
   ```

## 6. Configure Real-time Subscriptions

1. Go to Database → Replication
2. Enable replication for the following tables:
   - `study_room_messages`
   - `study_room_participants`
   - `ai_interactions`
   - `notifications`

## 7. Set Up Authentication

1. Go to Authentication → Settings
2. Configure the following providers:
   - Email (enabled by default)
   - Google OAuth
   - GitHub OAuth
   - Facebook OAuth

3. For each OAuth provider:
   - Get client ID and secret from the provider
   - Add the credentials to Supabase
   - Add your domain to allowed redirect URLs

## 8. Configure Edge Functions (Optional)

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref your-project-ref`
4. Deploy functions: `supabase functions deploy`

## 9. Set Up Database Backups

1. Go to Settings → Database
2. Enable Point-in-Time Recovery (PITR)
3. Configure backup schedule (daily recommended)

## 10. Monitor and Optimize

1. Go to Reports to monitor:
   - Database performance
   - API usage
   - Storage usage
   - Authentication metrics

2. Set up alerts for:
   - High error rates
   - Storage limits
   - Database performance issues

## 11. Environment Variables

Add these to your Vercel environment variables:

```bash
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 12. Test the Setup

1. Test database connection
2. Test authentication flow
3. Test file uploads
4. Test real-time subscriptions
5. Test API endpoints

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Make sure policies are correctly configured
2. **File Upload Issues**: Check bucket policies and CORS settings
3. **Real-time Not Working**: Verify replication is enabled
4. **Authentication Issues**: Check OAuth provider configuration

### Performance Optimization

1. **Indexes**: The schema includes optimized indexes
2. **Connection Pooling**: Enable in Database settings
3. **Caching**: Use Redis for frequently accessed data
4. **CDN**: Enable for static assets

## Security Checklist

- [ ] RLS policies enabled and tested
- [ ] Service role key kept secret
- [ ] OAuth providers configured securely
- [ ] File storage policies restrictive
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Database backups enabled
- [ ] Monitoring and alerts set up

## Next Steps

1. Deploy your Vercel functions
2. Test all API endpoints
3. Set up monitoring
4. Configure CI/CD pipeline
5. Set up staging environment

For more help, check the [Supabase Documentation](https://supabase.com/docs).