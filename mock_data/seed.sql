-- OmniMind Super-Intelligent AI Backend Mock Data
-- Comprehensive seed data for testing all features

-- Insert Tutor Personas
INSERT INTO tutor_personas (name, personality_type, description, voice_characteristics, teaching_style, response_templates, is_active) VALUES
('Socrates', 'socratic', 'Uses the Socratic method to guide students through questioning and discovery', 
 '{"tone": "inquisitive", "pace": "deliberate", "emphasis": "questioning"}',
 '{"method": "questioning", "approach": "guided_discovery", "interaction": "dialogue"}',
 '{"greeting": "What do you think about...", "question": "How does this relate to...", "encouragement": "That''s an interesting perspective..."}',
 true),

('Alex', 'friendly', 'Warm and encouraging tutor who makes learning fun and engaging',
 '{"tone": "warm", "pace": "conversational", "emphasis": "encouragement"}',
 '{"method": "conversational", "approach": "supportive", "interaction": "friendly"}',
 '{"greeting": "Hi there! I''m excited to help you learn!", "question": "What would you like to explore?", "encouragement": "You''re doing great!"}',
 true),

('Professor', 'exam', 'Focused on academic excellence and test preparation',
 '{"tone": "authoritative", "pace": "structured", "emphasis": "accuracy"}',
 '{"method": "assessment_driven", "approach": "systematic", "interaction": "formal"}',
 '{"greeting": "Let''s focus on the key concepts", "question": "What''s the correct approach?", "encouragement": "Good work, now let''s move to the next level"}',
 true),

('Coach', 'motivational', 'Inspiring and energetic tutor who builds confidence and motivation',
 '{"tone": "enthusiastic", "pace": "energetic", "emphasis": "motivation"}',
 '{"method": "encouraging", "approach": "inspiring", "interaction": "uplifting"}',
 '{"greeting": "You''ve got this! Let''s make learning amazing!", "question": "What''s your next goal?", "encouragement": "You''re absolutely crushing it!"}',
 true);

-- Insert VR Environments
INSERT INTO mock_vr_environments (name, environment_type, description, vr_data, ai_avatars, interactive_objects, physics_settings, is_active) VALUES
('Quantum Physics Lab', 'lab', 'Immersive laboratory for exploring quantum mechanics concepts',
 '{"scene": "laboratory", "lighting": "scientific", "atmosphere": "futuristic", "scale": "realistic"}',
 '{"professor_avatar": {"name": "Dr. Quantum", "specialty": "quantum_mechanics", "personality": "enthusiastic"}}',
 '{"particle_accelerator": {"interactive": true, "function": "demonstrate_particle_behavior"}, "holographic_display": {"interactive": true, "function": "show_quantum_states"}}',
 '{"gravity": 1.0, "collision": true, "realistic_physics": true}',
 true),

('Ancient Rome Classroom', 'historical', 'Step back in time to learn about ancient Roman civilization',
 '{"scene": "roman_forum", "lighting": "natural", "atmosphere": "historical", "scale": "monumental"}',
 '{"senator_avatar": {"name": "Marcus", "specialty": "roman_history", "personality": "wise"}}',
 '{"gladiator_arena": {"interactive": true, "function": "demonstrate_combat_techniques"}, "roman_bath": {"interactive": true, "function": "explore_social_culture"}}',
 '{"gravity": 1.0, "collision": true, "historical_accuracy": true}',
 true),

('Space Station Math Lab', 'space', 'Zero-gravity environment for learning advanced mathematics',
 '{"scene": "space_station", "lighting": "artificial", "atmosphere": "cosmic", "scale": "vast"}',
 '{"astronaut_avatar": {"name": "Commander Math", "specialty": "astrophysics", "personality": "logical"}}',
 '{"floating_numbers": {"interactive": true, "function": "visualize_equations"}, "planet_simulator": {"interactive": true, "function": "calculate_orbital_mechanics"}}',
 '{"gravity": 0.0, "collision": false, "zero_gravity": true}',
 true);

-- Insert sample users
INSERT INTO users (id, email, username, full_name, learning_goals, preferred_languages, learning_style, difficulty_preference, ai_personality_preference, subscription_tier) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alice@example.com', 'alice_learner', 'Alice Johnson', 
 ARRAY['Master Python programming', 'Learn machine learning', 'Build web applications'], 
 ARRAY['en', 'es'], 'visual', 'adaptive', 'friendly', 'premium'),

('550e8400-e29b-41d4-a716-446655440002', 'bob@example.com', 'bob_student', 'Bob Smith', 
 ARRAY['Understand calculus', 'Learn physics', 'Prepare for engineering'], 
 ARRAY['en'], 'kinesthetic', 'hard', 'socratic', 'free'),

('550e8400-e29b-41d4-a716-446655440003', 'carol@example.com', 'carol_math', 'Carol Davis', 
 ARRAY['Master linear algebra', 'Learn statistics', 'Data science career'], 
 ARRAY['en', 'fr'], 'auditory', 'medium', 'motivational', 'enterprise'),

('550e8400-e29b-41d4-a716-446655440004', 'david@example.com', 'david_coder', 'David Wilson', 
 ARRAY['Full-stack development', 'DevOps practices', 'System architecture'], 
 ARRAY['en'], 'reading', 'expert', 'exam', 'premium'),

('550e8400-e29b-41d4-a716-446655440005', 'eve@example.com', 'eve_scientist', 'Eve Brown', 
 ARRAY['Research methods', 'Scientific writing', 'Lab techniques'], 
 ARRAY['en', 'de'], 'visual', 'adaptive', 'friendly', 'premium');

-- Insert learning paths
INSERT INTO learning_paths (id, user_id, title, description, subject, difficulty_level, estimated_duration_hours, current_progress, status, ai_generated, learning_objectives) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 
 'Python Programming Mastery', 'Complete journey from beginner to advanced Python developer', 
 'programming', 'beginner', 80, 45.5, 'active', true, 
 ARRAY['Master Python syntax', 'Build real-world projects', 'Understand OOP concepts', 'Learn testing frameworks']),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 
 'Calculus and Physics Integration', 'Mathematical foundations for physics understanding', 
 'mathematics', 'hard', 120, 78.2, 'active', true,
 ARRAY['Master differential calculus', 'Understand physics applications', 'Solve complex problems', 'Prepare for advanced studies']),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 
 'Data Science Career Path', 'Comprehensive data science and machine learning curriculum', 
 'data_science', 'intermediate', 100, 62.8, 'active', true,
 ARRAY['Master statistical analysis', 'Learn machine learning', 'Build data pipelines', 'Create visualizations']);

-- Insert lessons
INSERT INTO lessons (id, learning_path_id, title, content, lesson_type, duration_minutes, difficulty_level, order_index, learning_objectives, ai_generated) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001',
 'Python Basics: Variables and Data Types', 
 'Learn about Python variables, data types, and basic operations. This lesson covers integers, floats, strings, booleans, and how to work with them.',
 'interactive', 45, 'beginner', 1, 
 ARRAY['Understand Python data types', 'Create and manipulate variables', 'Perform basic operations'], true),

('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001',
 'Control Flow: If Statements and Loops', 
 'Master conditional statements and loops in Python. Learn about if/elif/else, for loops, while loops, and how to control program flow.',
 'video', 60, 'beginner', 2,
 ARRAY['Write conditional statements', 'Implement loops', 'Control program flow'], true),

('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002',
 'Introduction to Derivatives', 
 'Learn the fundamental concept of derivatives in calculus. Understand limits, the definition of derivatives, and basic differentiation rules.',
 'interactive', 90, 'hard', 1,
 ARRAY['Understand the concept of limits', 'Learn derivative definition', 'Master basic differentiation rules'], true);

-- Insert AI Sessions
INSERT INTO ai_sessions (id, user_id, session_type, subject, ai_personality, user_input, ai_response, confidence_score, emotional_tone, learning_objective, session_duration_seconds) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001',
 'tutoring', 'programming', 'friendly', 
 'I''m confused about Python lists. How do I add items to them?',
 'Great question! Python lists are super useful. You can add items using several methods: append() for single items, extend() for multiple items, or insert() for specific positions. Let me show you examples!',
 92.5, 'helpful', 'Master Python data structures', 180),

('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002',
 'quiz', 'mathematics', 'socratic', 
 'What is the derivative of x²?',
 'That''s a fundamental question! Before I give you the answer, what do you think happens when we apply the power rule? What would be your reasoning?',
 88.0, 'inquisitive', 'Understand derivative rules', 120),

('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003',
 'feedback', 'data_science', 'motivational', 
 'I completed my first machine learning model!',
 'That''s absolutely fantastic! 🎉 You''re becoming a data science champion! Every model you build is a step toward mastery. What was the most exciting part of the process?',
 95.0, 'excited', 'Build machine learning models', 240);

-- Insert Progress Data
INSERT INTO progress (user_id, learning_path_id, lesson_id, progress_type, value, max_value, percentage, timestamp) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001',
 'lesson_completion', 100, 100, 100.0, '2024-01-15T10:30:00Z'),

('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002',
 'lesson_completion', 85, 100, 85.0, '2024-01-16T14:20:00Z'),

('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003',
 'quiz_score', 78, 100, 78.0, '2024-01-17T09:15:00Z'),

('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', null,
 'time_spent', 120, 0, null, '2024-01-18T16:45:00Z');

-- Insert Knowledge Graphs
INSERT INTO knowledge_graphs (user_id, subject, topic, mastery_level, confidence_score, last_practiced, practice_count, strengths, weaknesses, related_topics, ai_insights) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'programming', 'python_basics', 85.5, 88.0, '2024-01-15T10:30:00Z', 12,
 ARRAY['Strong understanding of data types', 'Good with control flow', 'Excellent problem-solving approach'],
 ARRAY['Needs more practice with complex algorithms', 'Could improve debugging skills'],
 ARRAY['functions', 'classes', 'modules'],
 '{"learning_velocity": "fast", "preferred_method": "hands_on", "optimal_time": "morning"}'),

('550e8400-e29b-41d4-a716-446655440002', 'mathematics', 'calculus', 72.3, 75.0, '2024-01-17T09:15:00Z', 8,
 ARRAY['Good conceptual understanding', 'Strong analytical thinking'],
 ARRAY['Needs more practice with applications', 'Integration techniques need work'],
 ARRAY['limits', 'integration', 'applications'],
 '{"learning_velocity": "moderate", "preferred_method": "step_by_step", "optimal_time": "evening"}'),

('550e8400-e29b-41d4-a716-446655440003', 'data_science', 'machine_learning', 91.2, 94.0, '2024-01-18T16:45:00Z', 15,
 ARRAY['Excellent model building skills', 'Strong statistical foundation', 'Great at feature engineering'],
 ARRAY['Could improve model interpretation', 'Needs more practice with deep learning'],
 ARRAY['statistics', 'deep_learning', 'deployment'],
 '{"learning_velocity": "very_fast", "preferred_method": "project_based", "optimal_time": "afternoon"}');

-- Insert Gamification Data
INSERT INTO gamification (user_id, xp_points, level, badges, streaks, achievements, leaderboard_position, last_activity) VALUES
('550e8400-e29b-41d4-a716-446655440001', 2847, 12, 
 ARRAY['first_lesson', 'python_master', 'streak_7_days', 'quiz_ace'],
 '{"current_streak": 7, "longest_streak": 15, "last_activity": "2024-01-18T16:45:00Z"}',
 '{"total_lessons": 25, "perfect_quizzes": 8, "helpful_contributions": 12}',
 3, '2024-01-18T16:45:00Z'),

('550e8400-e29b-41d4-a716-446655440002', 1956, 9,
 ARRAY['math_warrior', 'calculus_champion', 'persistent_learner'],
 '{"current_streak": 5, "longest_streak": 12, "last_activity": "2024-01-17T09:15:00Z"}',
 '{"total_lessons": 18, "perfect_quizzes": 5, "helpful_contributions": 7}',
 7, '2024-01-17T09:15:00Z'),

('550e8400-e29b-41d4-a716-446655440003', 3421, 15,
 ARRAY['data_scientist', 'ml_expert', 'mentor', 'streak_30_days'],
 '{"current_streak": 12, "longest_streak": 30, "last_activity": "2024-01-18T16:45:00Z"}',
 '{"total_lessons": 42, "perfect_quizzes": 15, "helpful_contributions": 25}',
 1, '2024-01-18T16:45:00Z');

-- Insert Cognitive Twins
INSERT INTO cognitive_twins (user_id, learning_style_profile, learning_patterns, prediction_models, memory_retention_curve, optimal_learning_times, last_updated) VALUES
('550e8400-e29b-41d4-a716-446655440001',
 '{"primary": "visual", "secondary": "kinesthetic", "preferred_pace": "moderate", "engagement_triggers": ["interactive", "practical", "challenging"]}',
 '{"peak_performance_hours": [9, 14, 20], "preferred_session_length": 45, "break_frequency": 15, "difficulty_progression": "gradual"}',
 '{"next_topic_prediction": "python_functions", "success_probability": 0.87, "recommended_difficulty": "intermediate"}',
 '{"retention_1_day": 0.85, "retention_1_week": 0.72, "retention_1_month": 0.58}',
 '{"morning": 0.9, "afternoon": 0.7, "evening": 0.8}',
 '2024-01-18T16:45:00Z'),

('550e8400-e29b-41d4-a716-446655440002',
 '{"primary": "kinesthetic", "secondary": "visual", "preferred_pace": "slow", "engagement_triggers": ["step_by_step", "examples", "repetition"]}',
 '{"peak_performance_hours": [19, 20, 21], "preferred_session_length": 60, "break_frequency": 20, "difficulty_progression": "careful"}',
 '{"next_topic_prediction": "integration_techniques", "success_probability": 0.73, "recommended_difficulty": "medium"}',
 '{"retention_1_day": 0.78, "retention_1_week": 0.65, "retention_1_month": 0.52}',
 '{"morning": 0.6, "afternoon": 0.7, "evening": 0.9}',
 '2024-01-17T09:15:00Z');

-- Insert Tokens (Learn-to-Earn)
INSERT INTO tokens (user_id, token_type, amount, transaction_type, source, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'OMNI', 150.0, 'earn', 'lesson_completion', '2024-01-15T10:30:00Z'),
('550e8400-e29b-41d4-a716-446655440001', 'SKILL', 75.0, 'earn', 'quiz_perfect', '2024-01-16T14:20:00Z'),
('550e8400-e29b-41d4-a716-446655440002', 'OMNI', 200.0, 'earn', 'lesson_completion', '2024-01-17T09:15:00Z'),
('550e8400-e29b-41d4-a716-446655440003', 'OMNI', 300.0, 'earn', 'project_submission', '2024-01-18T16:45:00Z'),
('550e8400-e29b-41d4-a716-446655440003', 'ACHIEVEMENT', 100.0, 'earn', 'streak_bonus', '2024-01-18T16:45:00Z');

-- Insert Audit Logs (Ethical AI)
INSERT INTO audit_logs (user_id, action_type, ai_model, input_data, output_data, reasoning_steps, confidence_score, bias_detection, fairness_metrics, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'tutoring_session', 'omnimind-v1',
 '{"user_input": "I''m confused about Python lists", "subject": "programming", "difficulty": "beginner"}',
 '{"ai_response": "Great question! Python lists are super useful...", "teaching_approach": "friendly", "examples_provided": 3}',
 '["Identified user confusion", "Selected appropriate teaching method", "Provided concrete examples", "Encouraged further questions"]',
 92.5,
 '{"gender_bias": "none", "cultural_bias": "low", "language_bias": "none"}',
 '{"demographic_parity": 0.89, "equalized_odds": 0.92}',
 '2024-01-15T10:30:00Z'),

('550e8400-e29b-41d4-a716-446655440002', 'quiz_generation', 'omnimind-v1',
 '{"subject": "mathematics", "topic": "calculus", "difficulty": "hard", "question_count": 5}',
 '{"questions_generated": 5, "difficulty_distribution": "balanced", "learning_objectives_covered": 3}',
 '["Analyzed user proficiency level", "Selected appropriate difficulty", "Generated diverse question types", "Ensured learning objective coverage"]',
 88.0,
 '{"gender_bias": "none", "cultural_bias": "none", "language_bias": "none"}',
 '{"demographic_parity": 0.94, "equalized_odds": 0.91}',
 '2024-01-17T09:15:00Z');

-- Insert Meta Learning Data
INSERT INTO meta_learning (interaction_id, interaction_type, user_feedback, ai_performance_metrics, teaching_effectiveness_score, improvement_suggestions, global_learning_insights, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'tutoring',
 '{"rating": 5, "helpful": true, "confusing": false, "additional_comments": "Very clear explanation!"}',
 '{"response_time": 2.3, "user_engagement": 0.85, "concept_clarity": 0.92}',
 87.5,
 ARRAY['Continue using visual examples', 'Maintain friendly tone', 'Ask more follow-up questions'],
 '{"global_avg_effectiveness": 82.3, "most_effective_approach": "interactive_questioning", "common_improvement_areas": ["visual_aids", "step_by_step_breakdown"]}',
 '2024-01-15T10:30:00Z'),

('990e8400-e29b-41d4-a716-446655440002', 'quiz',
 '{"rating": 4, "helpful": true, "confusing": false, "difficulty_appropriate": true}',
 '{"completion_rate": 0.95, "average_score": 78.5, "time_to_complete": 12.3}',
 82.0,
 ARRAY['Add more intermediate difficulty questions', 'Include more real-world applications'],
 '{"global_quiz_effectiveness": 79.8, "optimal_question_count": 5, "best_difficulty_progression": "gradual"}',
 '2024-01-17T09:15:00Z');

-- Insert Cross-Domain Applications
INSERT INTO cross_domain_apps (user_id, app_domain, session_data, ai_insights, performance_metrics, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'code',
 '{"session_type": "code_review", "language": "python", "focus": "best_practices", "duration_minutes": 30}',
 '{"code_quality_score": 8.5, "improvement_areas": ["documentation", "error_handling"], "strengths": ["clean_syntax", "logical_structure"]}',
 '{"lines_reviewed": 150, "suggestions_provided": 8, "user_acceptance_rate": 0.75}',
 '2024-01-16T14:20:00Z'),

('550e8400-e29b-41d4-a716-446655440003', 'health',
 '{"session_type": "wellness_check", "focus": "stress_management", "duration_minutes": 20}',
 '{"stress_level": 6.5, "recommendations": ["meditation", "exercise", "break_scheduling"], "mood_trend": "improving"}',
 '{"engagement_score": 0.88, "recommendation_acceptance": 0.82, "follow_up_needed": false}',
 '2024-01-18T16:45:00Z');
