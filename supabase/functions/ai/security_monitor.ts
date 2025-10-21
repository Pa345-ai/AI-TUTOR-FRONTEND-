import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityMonitorRequest {
  user_id: string
  action_type: string
  resource_type: string
  resource_id?: string
  metadata?: any
}

interface SecurityMonitorResponse {
  security_assessment: {
    risk_level: 'low' | 'medium' | 'high' | 'critical'
    threat_indicators: string[]
    recommended_actions: string[]
    confidence_score: number
  }
  monitoring_alerts: Array<{
    alert_type: string
    severity: string
    description: string
    timestamp: string
  }>
  compliance_status: {
    gdpr_compliant: boolean
    data_retention_compliant: boolean
    access_control_compliant: boolean
    audit_trail_complete: boolean
  }
  user_behavior_analysis: {
    session_patterns: any
    access_patterns: any
    anomaly_detection: any
    risk_factors: string[]
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { user_id, action_type, resource_type, resource_id, metadata = {} }: SecurityMonitorRequest = await req.json()

    // Get comprehensive security context
    const securityContext = await getSecurityContext(supabaseClient, user_id)
    
    // Analyze current action for security risks
    const securityAssessment = analyzeSecurityRisk(action_type, resource_type, securityContext, metadata)
    
    // Check for behavioral anomalies
    const behaviorAnalysis = analyzeUserBehavior(supabaseClient, user_id, action_type, securityContext)
    
    // Generate monitoring alerts
    const monitoringAlerts = generateMonitoringAlerts(securityAssessment, behaviorAnalysis)
    
    // Check compliance status
    const complianceStatus = checkComplianceStatus(supabaseClient, user_id, action_type)
    
    // Log security event
    await supabaseClient.rpc('log_security_event', {
      p_event_type: 'security_monitoring',
      p_description: `Security monitoring for ${action_type} on ${resource_type}`,
      p_severity: securityAssessment.risk_level === 'critical' ? 'critical' : 
                  securityAssessment.risk_level === 'high' ? 'error' : 'info',
      p_metadata: {
        action_type,
        resource_type,
        risk_level: securityAssessment.risk_level,
        threat_indicators: securityAssessment.threat_indicators,
        compliance_status: complianceStatus
      }
    })

    // Update user risk profile if needed
    if (securityAssessment.risk_level === 'high' || securityAssessment.risk_level === 'critical') {
      await updateUserRiskProfile(supabaseClient, user_id, securityAssessment, behaviorAnalysis)
    }

    const response: SecurityMonitorResponse = {
      security_assessment: securityAssessment,
      monitoring_alerts: monitoringAlerts,
      compliance_status: complianceStatus,
      user_behavior_analysis: behaviorAnalysis
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function getSecurityContext(supabaseClient: any, userId: string): Promise<any> {
  // Get user profile and security settings
  const { data: user } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  // Get recent security events
  const { data: securityEvents } = await supabaseClient
    .from('security_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get recent audit logs
  const { data: auditLogs } = await supabaseClient
    .from('audit_logs_enhanced')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  // Get user's access patterns
  const { data: accessPatterns } = await supabaseClient
    .from('ai_sessions')
    .select('created_at, session_type, subject, ip_address')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200)

  return {
    user,
    securityEvents,
    auditLogs,
    accessPatterns
  }
}

function analyzeSecurityRisk(actionType: string, resourceType: string, securityContext: any, metadata: any): any {
  const { user, securityEvents, auditLogs } = securityContext
  
  let riskLevel = 'low'
  const threatIndicators: string[] = []
  const recommendedActions: string[] = []
  let confidenceScore = 85

  // Check for suspicious action patterns
  if (actionType === 'delete' && resourceType === 'user_data') {
    riskLevel = 'high'
    threatIndicators.push('Attempting to delete user data')
    recommendedActions.push('Require additional authentication for data deletion')
  }

  // Check for rapid successive operations
  const recentOperations = auditLogs.filter(log => 
    new Date(log.created_at) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
  )
  
  if (recentOperations.length > 20) {
    riskLevel = 'high'
    threatIndicators.push('Rapid successive operations detected')
    recommendedActions.push('Implement rate limiting')
  }

  // Check for unusual access patterns
  const uniqueIPs = new Set(securityContext.accessPatterns.map(ap => ap.ip_address))
  if (uniqueIPs.size > 5) {
    riskLevel = 'medium'
    threatIndicators.push('Multiple IP addresses detected')
    recommendedActions.push('Monitor for account sharing or compromise')
  }

  // Check for access to sensitive resources
  const sensitiveResources = ['audit_logs', 'security_events', 'user_data', 'admin_functions']
  if (sensitiveResources.includes(resourceType)) {
    riskLevel = 'medium'
    threatIndicators.push('Access to sensitive resource')
    recommendedActions.push('Log and monitor access to sensitive resources')
  }

  // Check for unusual time patterns
  const currentHour = new Date().getHours()
  const userAccessHours = securityContext.accessPatterns.map(ap => new Date(ap.created_at).getHours())
  const typicalHours = userAccessHours.filter(h => h >= 8 && h <= 22)
  
  if (currentHour < 6 || currentHour > 23) {
    riskLevel = 'medium'
    threatIndicators.push('Access during unusual hours')
    recommendedActions.push('Verify user identity for off-hours access')
  }

  // Check for failed authentication attempts
  const failedAuthEvents = securityEvents.filter(event => 
    event.event_type === 'login_failed' && 
    new Date(event.created_at) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
  )
  
  if (failedAuthEvents.length > 5) {
    riskLevel = 'high'
    threatIndicators.push('Multiple failed authentication attempts')
    recommendedActions.push('Implement account lockout mechanism')
  }

  // Check for data exfiltration patterns
  if (actionType === 'read' && metadata.record_count > 1000) {
    riskLevel = 'high'
    threatIndicators.push('Large data access request')
    recommendedActions.push('Review data access permissions and implement data loss prevention')
  }

  // Adjust confidence based on available data
  if (auditLogs.length < 10) {
    confidenceScore -= 10
  }
  if (securityEvents.length < 5) {
    confidenceScore -= 5
  }

  return {
    risk_level: riskLevel,
    threat_indicators: threatIndicators,
    recommended_actions: recommendedActions,
    confidence_score: Math.max(0, Math.min(100, confidenceScore))
  }
}

async function analyzeUserBehavior(supabaseClient: any, userId: string, actionType: string, securityContext: any): Promise<any> {
  const { accessPatterns, auditLogs } = securityContext

  // Analyze session patterns
  const sessionPatterns = analyzeSessionPatterns(accessPatterns)
  
  // Analyze access patterns
  const accessPatternAnalysis = analyzeAccessPatterns(auditLogs)
  
  // Detect anomalies
  const anomalies = detectAnomalies(accessPatterns, auditLogs, actionType)
  
  // Identify risk factors
  const riskFactors = identifyRiskFactors(sessionPatterns, accessPatternAnalysis, anomalies)

  return {
    session_patterns: sessionPatterns,
    access_patterns: accessPatternAnalysis,
    anomaly_detection: anomalies,
    risk_factors: riskFactors
  }
}

function analyzeSessionPatterns(accessPatterns: any[]): any {
  const sessionsByDay = accessPatterns.reduce((acc, pattern) => {
    const day = new Date(pattern.created_at).toDateString()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})

  const avgSessionsPerDay = Object.values(sessionsByDay).reduce((sum, count) => sum + count, 0) / Object.keys(sessionsByDay).length

  return {
    total_sessions: accessPatterns.length,
    avg_sessions_per_day: avgSessionsPerDay,
    session_frequency: Object.keys(sessionsByDay).length > 7 ? 'regular' : 'irregular',
    peak_usage_hours: getPeakUsageHours(accessPatterns)
  }
}

function analyzeAccessPatterns(auditLogs: any[]): any {
  const operationsByType = auditLogs.reduce((acc, log) => {
    acc[log.operation] = (acc[log.operation] || 0) + 1
    return acc
  }, {})

  const tablesAccessed = [...new Set(auditLogs.map(log => log.table_name))]

  return {
    total_operations: auditLogs.length,
    operations_by_type: operationsByType,
    tables_accessed: tablesAccessed,
    most_accessed_table: getMostAccessedTable(auditLogs),
    operation_frequency: auditLogs.length > 100 ? 'high' : 'normal'
  }
}

function detectAnomalies(accessPatterns: any[], auditLogs: any[], currentAction: string): any {
  const anomalies: string[] = []

  // Check for unusual session duration
  const sessionDurations = accessPatterns.map(ap => {
    // Calculate session duration based on consecutive access patterns
    return 30 // Mock duration in minutes
  })
  
  const avgSessionDuration = sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
  
  if (avgSessionDuration > 120) { // More than 2 hours
    anomalies.push('Unusually long session duration')
  }

  // Check for unusual operation frequency
  const recentOperations = auditLogs.filter(log => 
    new Date(log.created_at) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
  )
  
  if (recentOperations.length > 50) {
    anomalies.push('Unusually high operation frequency')
  }

  // Check for unusual resource access patterns
  const resourceAccessCount = auditLogs.reduce((acc, log) => {
    acc[log.table_name] = (acc[log.table_name] || 0) + 1
    return acc
  }, {})
  
  const maxAccessCount = Math.max(...Object.values(resourceAccessCount) as number[])
  if (maxAccessCount > 100) {
    anomalies.push('Unusual resource access concentration')
  }

  return {
    detected_anomalies: anomalies,
    anomaly_count: anomalies.length,
    risk_level: anomalies.length > 2 ? 'high' : anomalies.length > 0 ? 'medium' : 'low'
  }
}

function identifyRiskFactors(sessionPatterns: any, accessPatterns: any, anomalies: any): string[] {
  const riskFactors: string[] = []

  if (sessionPatterns.session_frequency === 'irregular') {
    riskFactors.push('Irregular session patterns')
  }

  if (accessPatterns.operation_frequency === 'high') {
    riskFactors.push('High operation frequency')
  }

  if (anomalies.risk_level === 'high') {
    riskFactors.push('Multiple behavioral anomalies detected')
  }

  if (sessionPatterns.avg_sessions_per_day > 20) {
    riskFactors.push('Excessive daily session count')
  }

  return riskFactors
}

async function checkComplianceStatus(supabaseClient: any, userId: string, actionType: string): Promise<any> {
  // Check GDPR compliance
  const gdprCompliant = await checkGDPRCompliance(supabaseClient, userId)
  
  // Check data retention compliance
  const dataRetentionCompliant = await checkDataRetentionCompliance(supabaseClient, userId)
  
  // Check access control compliance
  const accessControlCompliant = await checkAccessControlCompliance(supabaseClient, userId, actionType)
  
  // Check audit trail completeness
  const auditTrailComplete = await checkAuditTrailCompleteness(supabaseClient, userId)

  return {
    gdpr_compliant: gdprCompliant,
    data_retention_compliant: dataRetentionCompliant,
    access_control_compliant: accessControlCompliant,
    audit_trail_complete: auditTrailComplete
  }
}

async function checkGDPRCompliance(supabaseClient: any, userId: string): Promise<boolean> {
  // Check if user has given consent for data processing
  const { data: user } = await supabaseClient
    .from('users')
    .select('privacy_settings')
    .eq('id', userId)
    .single()

  if (!user?.privacy_settings) return false

  const privacySettings = user.privacy_settings
  return privacySettings.data_sharing === true || privacySettings.analytics === true
}

async function checkDataRetentionCompliance(supabaseClient: any, userId: string): Promise<boolean> {
  // Check if data older than retention period exists
  const retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000 // 7 years in milliseconds
  const cutoffDate = new Date(Date.now() - retentionPeriod)

  const { data: oldData } = await supabaseClient
    .from('audit_logs_enhanced')
    .select('id')
    .eq('user_id', userId)
    .lt('created_at', cutoffDate.toISOString())
    .limit(1)

  return oldData.length === 0
}

async function checkAccessControlCompliance(supabaseClient: any, userId: string, actionType: string): Promise<boolean> {
  // Check if user has appropriate permissions for the action
  const { data: user } = await supabaseClient
    .from('users')
    .select('subscription_tier')
    .eq('id', userId)
    .single()

  if (!user) return false

  // Check permissions based on subscription tier
  const hasPermission = await supabaseClient.rpc('check_user_permission', {
    p_user_id: userId,
    p_resource_type: 'general',
    p_action: actionType
  })

  return hasPermission.data
}

async function checkAuditTrailCompleteness(supabaseClient: any, userId: string): Promise<boolean> {
  // Check if all user actions are properly logged
  const { data: recentActions } = await supabaseClient
    .from('audit_logs_enhanced')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

  const { data: userSessions } = await supabaseClient
    .from('ai_sessions')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

  // If there are user sessions but no corresponding audit logs, compliance is incomplete
  return userSessions.length === 0 || recentActions.length >= userSessions.length
}

function generateMonitoringAlerts(securityAssessment: any, behaviorAnalysis: any): any[] {
  const alerts: any[] = []

  if (securityAssessment.risk_level === 'critical') {
    alerts.push({
      alert_type: 'critical_security_risk',
      severity: 'critical',
      description: 'Critical security risk detected. Immediate attention required.',
      timestamp: new Date().toISOString()
    })
  }

  if (securityAssessment.risk_level === 'high') {
    alerts.push({
      alert_type: 'high_security_risk',
      severity: 'error',
      description: 'High security risk detected. Review and take appropriate action.',
      timestamp: new Date().toISOString()
    })
  }

  if (behaviorAnalysis.anomaly_detection.risk_level === 'high') {
    alerts.push({
      alert_type: 'behavioral_anomaly',
      severity: 'warning',
      description: 'Unusual user behavior patterns detected.',
      timestamp: new Date().toISOString()
    })
  }

  if (behaviorAnalysis.risk_factors.length > 0) {
    alerts.push({
      alert_type: 'risk_factors_detected',
      severity: 'info',
      description: `Risk factors identified: ${behaviorAnalysis.risk_factors.join(', ')}`,
      timestamp: new Date().toISOString()
    })
  }

  return alerts
}

async function updateUserRiskProfile(supabaseClient: any, userId: string, securityAssessment: any, behaviorAnalysis: any): Promise<void> {
  // Update user's risk profile in the database
  const riskProfile = {
    risk_level: securityAssessment.risk_level,
    threat_indicators: securityAssessment.threat_indicators,
    last_assessment: new Date().toISOString(),
    anomaly_count: behaviorAnalysis.anomaly_detection.anomaly_count,
    risk_factors: behaviorAnalysis.risk_factors
  }

  await supabaseClient
    .from('users')
    .update({
      metadata: {
        risk_profile: riskProfile,
        last_security_assessment: new Date().toISOString()
      }
    })
    .eq('id', userId)
}

function getPeakUsageHours(accessPatterns: any[]): number[] {
  const hourCounts = accessPatterns.reduce((acc, pattern) => {
    const hour = new Date(pattern.created_at).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {})

  const sortedHours = Object.entries(hourCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([hour]) => parseInt(hour))

  return sortedHours
}

function getMostAccessedTable(auditLogs: any[]): string {
  const tableCounts = auditLogs.reduce((acc, log) => {
    acc[log.table_name] = (acc[log.table_name] || 0) + 1
    return acc
  }, {})

  const mostAccessed = Object.entries(tableCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]

  return mostAccessed ? mostAccessed[0] : 'unknown'
}
