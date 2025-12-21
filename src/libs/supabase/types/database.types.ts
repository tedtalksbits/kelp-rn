export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      kelp_exercise_logs: {
        Row: {
          completed: boolean | null;
          created_at: string | null;
          duration_seconds: number | null;
          exercise_id: string;
          id: string;
          notes: string | null;
          order_index: number;
          reps_completed: number | null;
          reps_planned: number | null;
          session_id: string;
          sets_completed: number | null;
          sets_planned: number | null;
          skipped: boolean | null;
          weight_kg: number | null;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string | null;
          duration_seconds?: number | null;
          exercise_id: string;
          id?: string;
          notes?: string | null;
          order_index: number;
          reps_completed?: number | null;
          reps_planned?: number | null;
          session_id: string;
          sets_completed?: number | null;
          sets_planned?: number | null;
          skipped?: boolean | null;
          weight_kg?: number | null;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string | null;
          duration_seconds?: number | null;
          exercise_id?: string;
          id?: string;
          notes?: string | null;
          order_index?: number;
          reps_completed?: number | null;
          reps_planned?: number | null;
          session_id?: string;
          sets_completed?: number | null;
          sets_planned?: number | null;
          skipped?: boolean | null;
          weight_kg?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'kelp_exercise_logs_exercise_id_fkey';
            columns: ['exercise_id'];
            referencedRelation: 'kelp_exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_exercise_logs_session_id_fkey';
            columns: ['session_id'];
            referencedRelation: 'kelp_workout_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      kelp_exercises: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          demo_gif_url: string | null;
          description: string | null;
          difficulty_level:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          equipment_required: string[] | null;
          id: string;
          instructions: string | null;
          is_system_exercise: boolean | null;
          name: string;
          target_muscle: Database['public']['Enums']['kelp_body_part'];
          updated_at: string | null;
          video_url: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          demo_gif_url?: string | null;
          description?: string | null;
          difficulty_level?:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          equipment_required?: string[] | null;
          id?: string;
          instructions?: string | null;
          is_system_exercise?: boolean | null;
          name: string;
          target_muscle: Database['public']['Enums']['kelp_body_part'];
          updated_at?: string | null;
          video_url?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          demo_gif_url?: string | null;
          description?: string | null;
          difficulty_level?:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          equipment_required?: string[] | null;
          id?: string;
          instructions?: string | null;
          is_system_exercise?: boolean | null;
          name?: string;
          target_muscle?: Database['public']['Enums']['kelp_body_part'];
          updated_at?: string | null;
          video_url?: string | null;
        };
        Relationships: [];
      };
      kelp_system_template_exercises: {
        Row: {
          created_at: string;
          exercise_id: string;
          id: string;
          notes: string | null;
          order_index: number;
          rest_seconds: number | null;
          target_reps: number;
          target_sets: number;
          template_id: string;
        };
        Insert: {
          created_at?: string;
          exercise_id: string;
          id?: string;
          notes?: string | null;
          order_index: number;
          rest_seconds?: number | null;
          target_reps: number;
          target_sets: number;
          template_id: string;
        };
        Update: {
          created_at?: string;
          exercise_id?: string;
          id?: string;
          notes?: string | null;
          order_index?: number;
          rest_seconds?: number | null;
          target_reps?: number;
          target_sets?: number;
          template_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'kelp_system_template_exercises_exercise_id_fkey';
            columns: ['exercise_id'];
            referencedRelation: 'kelp_exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_system_template_exercises_template_id_fkey';
            columns: ['template_id'];
            referencedRelation: 'kelp_system_templates_with_equipment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_system_template_exercises_template_id_fkey';
            columns: ['template_id'];
            referencedRelation: 'kelp_system_workout_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      kelp_system_workout_templates: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          difficulty_level:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          estimated_calories: number | null;
          estimated_duration_minutes: number | null;
          focus_area: Database['public']['Enums']['kelp_body_part'] | null;
          id: string;
          intensity:
            | Database['public']['Enums']['kelp_workout_intensity']
            | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty_level?:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          estimated_calories?: number | null;
          estimated_duration_minutes?: number | null;
          focus_area?: Database['public']['Enums']['kelp_body_part'] | null;
          id?: string;
          intensity?:
            | Database['public']['Enums']['kelp_workout_intensity']
            | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty_level?:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          estimated_calories?: number | null;
          estimated_duration_minutes?: number | null;
          focus_area?: Database['public']['Enums']['kelp_body_part'] | null;
          id?: string;
          intensity?:
            | Database['public']['Enums']['kelp_workout_intensity']
            | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      kelp_user_profiles: {
        Row: {
          age: number | null;
          available_equipment: string[] | null;
          avatar_url: string | null;
          created_at: string | null;
          current_streak: number | null;
          fitness_level: Database['public']['Enums']['kelp_fitness_level'];
          goals: string[];
          height_cm: number | null;
          id: string;
          longest_streak: number | null;
          name: string;
          physical_limitations: string[] | null;
          preferred_voice_id: string | null;
          preferred_workout_time: string | null;
          target_areas: string[];
          timezone: string;
          total_workouts_completed: number | null;
          updated_at: string | null;
          user_id: string;
          weight_kg: number | null;
          workout_days: string[];
        };
        Insert: {
          age?: number | null;
          available_equipment?: string[] | null;
          avatar_url?: string | null;
          created_at?: string | null;
          current_streak?: number | null;
          fitness_level?: Database['public']['Enums']['kelp_fitness_level'];
          goals?: string[];
          height_cm?: number | null;
          id?: string;
          longest_streak?: number | null;
          name: string;
          physical_limitations?: string[] | null;
          preferred_voice_id?: string | null;
          preferred_workout_time?: string | null;
          target_areas?: string[];
          timezone?: string;
          total_workouts_completed?: number | null;
          updated_at?: string | null;
          user_id: string;
          weight_kg?: number | null;
          workout_days?: string[];
        };
        Update: {
          age?: number | null;
          available_equipment?: string[] | null;
          avatar_url?: string | null;
          created_at?: string | null;
          current_streak?: number | null;
          fitness_level?: Database['public']['Enums']['kelp_fitness_level'];
          goals?: string[];
          height_cm?: number | null;
          id?: string;
          longest_streak?: number | null;
          name?: string;
          physical_limitations?: string[] | null;
          preferred_voice_id?: string | null;
          preferred_workout_time?: string | null;
          target_areas?: string[];
          timezone?: string;
          total_workouts_completed?: number | null;
          updated_at?: string | null;
          user_id?: string;
          weight_kg?: number | null;
          workout_days?: string[];
        };
        Relationships: [];
      };
      kelp_user_template_exercises: {
        Row: {
          created_at: string;
          exercise_id: string;
          id: string;
          notes: string | null;
          order_index: number;
          rest_seconds: number | null;
          target_reps: number;
          target_sets: number;
          template_id: string;
        };
        Insert: {
          created_at?: string;
          exercise_id: string;
          id?: string;
          notes?: string | null;
          order_index: number;
          rest_seconds?: number | null;
          target_reps: number;
          target_sets: number;
          template_id: string;
        };
        Update: {
          created_at?: string;
          exercise_id?: string;
          id?: string;
          notes?: string | null;
          order_index?: number;
          rest_seconds?: number | null;
          target_reps?: number;
          target_sets?: number;
          template_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'kelp_user_template_exercises_exercise_id_fkey';
            columns: ['exercise_id'];
            referencedRelation: 'kelp_exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_user_template_exercises_template_id_fkey';
            columns: ['template_id'];
            referencedRelation: 'kelp_user_templates_with_equipment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_user_template_exercises_template_id_fkey';
            columns: ['template_id'];
            referencedRelation: 'kelp_user_workout_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      kelp_user_workout_templates: {
        Row: {
          ai_generation_context: string | null;
          cloned_from_system_template_id: string | null;
          color: string | null;
          created_at: string;
          description: string | null;
          estimated_calories: number | null;
          estimated_duration_minutes: number | null;
          focus_area: Database['public']['Enums']['kelp_body_part'] | null;
          id: string;
          intensity:
            | Database['public']['Enums']['kelp_workout_intensity']
            | null;
          is_ai_generated: boolean | null;
          is_favorite: boolean | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_generation_context?: string | null;
          cloned_from_system_template_id?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          estimated_calories?: number | null;
          estimated_duration_minutes: number | null;
          focus_area?: Database['public']['Enums']['kelp_body_part'] | null;
          id?: string;
          intensity?:
            | Database['public']['Enums']['kelp_workout_intensity']
            | null;
          is_ai_generated?: boolean | null;
          is_favorite?: boolean | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_generation_context?: string | null;
          cloned_from_system_template_id?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          estimated_calories?: number | null;
          estimated_duration_minutes?: number | null;
          focus_area?: Database['public']['Enums']['kelp_body_part'] | null;
          id?: string;
          intensity?:
            | Database['public']['Enums']['kelp_workout_intensity']
            | null;
          is_ai_generated?: boolean | null;
          is_favorite?: boolean | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'kelp_user_workout_templates_cloned_from_system_template_id_fkey';
            columns: ['cloned_from_system_template_id'];
            referencedRelation: 'kelp_system_templates_with_equipment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_user_workout_templates_cloned_from_system_template_id_fkey';
            columns: ['cloned_from_system_template_id'];
            referencedRelation: 'kelp_system_workout_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      kelp_workout_sessions: {
        Row: {
          ai_generation_context: string | null;
          ai_post_workout_analysis: string | null;
          ai_pre_workout_note: string | null;
          completed_at: string | null;
          created_at: string | null;
          description: string | null;
          duration_minutes: number | null;
          elevenlabs_audio_url: string | null;
          focus_area: Database['public']['Enums']['kelp_body_part'] | null;
          id: string;
          perceived_difficulty: number | null;
          scheduled_for: string | null;
          started_at: string | null;
          status: Database['public']['Enums']['kelp_workout_status'] | null;
          template_id: string | null;
          title: string;
          updated_at: string | null;
          user_id: string;
          user_notes: string | null;
        };
        Insert: {
          ai_generation_context?: string | null;
          ai_post_workout_analysis?: string | null;
          ai_pre_workout_note?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          elevenlabs_audio_url?: string | null;
          focus_area?: Database['public']['Enums']['kelp_body_part'] | null;
          id?: string;
          perceived_difficulty?: number | null;
          scheduled_for?: string | null;
          started_at?: string | null;
          status?: Database['public']['Enums']['kelp_workout_status'] | null;
          template_id?: string | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
          user_notes?: string | null;
        };
        Update: {
          ai_generation_context?: string | null;
          ai_post_workout_analysis?: string | null;
          ai_pre_workout_note?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          elevenlabs_audio_url?: string | null;
          focus_area?: Database['public']['Enums']['kelp_body_part'] | null;
          id?: string;
          perceived_difficulty?: number | null;
          scheduled_for?: string | null;
          started_at?: string | null;
          status?: Database['public']['Enums']['kelp_workout_status'] | null;
          template_id?: string | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
          user_notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'kelp_workout_sessions_template_id_fkey';
            columns: ['template_id'];
            referencedRelation: 'kelp_user_templates_with_equipment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_workout_sessions_template_id_fkey';
            columns: ['template_id'];
            referencedRelation: 'kelp_user_workout_templates';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      user_stats: {
        Row: {
          completed_projects: number | null;
          followers_count: number | null;
          following_count: number | null;
          total_hours: number | null;
          total_likes: number | null;
          total_projects: number | null;
          total_spent: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      kelp_all_available_templates: {
        Row: {
          ai_generation_context: string | null;
          cloned_from_system_template_id: string | null;
          created_at: string | null;
          description: string | null;
          difficulty_level:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          equipment_required: string[] | null;
          focus_area: Database['public']['Enums']['kelp_body_part'] | null;
          id: string | null;
          is_ai_generated: boolean | null;
          is_favorite: boolean | null;
          template_type: string | null;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      kelp_system_templates_with_equipment: {
        Row: {
          created_at: string | null;
          description: string | null;
          difficulty_level:
            | Database['public']['Enums']['kelp_fitness_level']
            | null;
          equipment_required: string[] | null;
          focus_area: Database['public']['Enums']['kelp_body_part'] | null;
          id: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
      kelp_user_templates_with_equipment: {
        Row: {
          ai_generation_context: string | null;
          cloned_from_system_template_id: string | null;
          created_at: string | null;
          description: string | null;
          equipment_required: string[] | null;
          focus_area: Database['public']['Enums']['kelp_body_part'] | null;
          id: string | null;
          is_ai_generated: boolean | null;
          is_favorite: boolean | null;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'kelp_user_workout_templates_cloned_from_system_template_id_fkey';
            columns: ['cloned_from_system_template_id'];
            referencedRelation: 'kelp_system_templates_with_equipment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kelp_user_workout_templates_cloned_from_system_template_id_fkey';
            columns: ['cloned_from_system_template_id'];
            referencedRelation: 'kelp_system_workout_templates';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      kelp_clone_system_template_to_user: {
        Args: {
          p_system_template_id: string;
          p_user_id: string;
          p_custom_title?: string;
        };
        Returns: string;
      };
      kelp_complete_workout: {
        Args: {
          p_workout_id: string;
          p_duration_minutes: number;
          p_perceived_difficulty?: number;
          p_user_notes?: string;
          p_ai_analysis?: string;
          p_audio_url?: string;
        };
        Returns: undefined;
      };
      kelp_create_session_from_user_template: {
        Args: {
          p_user_template_id: string;
          p_user_id: string;
          p_scheduled_for?: string;
        };
        Returns: string;
      };
      kelp_duplicate_user_template: {
        Args: {
          p_user_template_id: string;
          p_user_id: string;
          p_new_title?: string;
        };
        Returns: string;
      };
      kelp_get_exercise_history: {
        Args:
          | { p_user_id: string; p_exercise_id: string; p_limit?: number }
          | { p_user_id: string; p_exercise_name: string; p_limit?: number };
        Returns: {
          workout_date: string;
          sets_completed: number;
          reps_completed: number;
          weight_used: number;
          difficulty_rating: number;
          notes: string;
        }[];
      };
      kelp_get_user_stats: {
        Args: { p_user_id: string };
        Returns: {
          current_streak: number;
          longest_streak: number;
          total_workouts: number;
          workouts_this_week: number;
          workouts_this_month: number;
          next_scheduled_date: string;
        }[];
      };
      kelp_get_user_template_stats: {
        Args: { p_user_template_id: string; p_user_id: string };
        Returns: {
          times_used: number;
          last_used_at: string;
          avg_difficulty: number;
          avg_duration_minutes: number;
          total_sessions_completed: number;
        }[];
      };
      kelp_get_user_workout_stats: {
        Args: { p_user_id: string };
        Returns: {
          total_workouts: number;
          completed_workouts: number;
          current_streak: number;
          total_duration: number;
        }[];
      };
      kelp_get_weekly_activity: {
        Args: { p_user_id: string };
        Returns: {
          day_of_week: string;
          workout_count: number;
          total_minutes: number;
        }[];
      };
    };
    Enums: {
      kelp_body_part:
        | 'chest'
        | 'back'
        | 'legs'
        | 'shoulders'
        | 'arms'
        | 'core'
        | 'cardio'
        | 'full_body';
      kelp_fitness_level:
        | 'sedentary'
        | 'beginner'
        | 'intermediate'
        | 'advanced';
      kelp_workout_intensity: 'low' | 'medium' | 'high';
      kelp_workout_status:
        | 'scheduled'
        | 'in_progress'
        | 'completed'
        | 'skipped';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          type: Database['storage']['Enums']['buckettype'];
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      buckets_analytics: {
        Row: {
          created_at: string;
          format: string;
          id: string;
          type: Database['storage']['Enums']['buckettype'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          format?: string;
          id: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          format?: string;
          id?: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Relationships: [];
      };
      iceberg_namespaces: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'iceberg_namespaces_bucket_id_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets_analytics';
            referencedColumns: ['id'];
          },
        ];
      };
      iceberg_tables: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          location: string;
          name: string;
          namespace_id: string;
          updated_at: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id?: string;
          location: string;
          name: string;
          namespace_id: string;
          updated_at?: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          location?: string;
          name?: string;
          namespace_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'iceberg_tables_bucket_id_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets_analytics';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'iceberg_tables_namespace_id_fkey';
            columns: ['namespace_id'];
            referencedRelation: 'iceberg_namespaces';
            referencedColumns: ['id'];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          level: number | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          level?: number | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          level?: number | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      prefixes: {
        Row: {
          bucket_id: string;
          created_at: string | null;
          level: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          bucket_id: string;
          created_at?: string | null;
          level?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string;
          created_at?: string | null;
          level?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'prefixes_bucketId_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string };
        Returns: undefined;
      };
      can_insert_object: {
        Args: { bucketid: string; name: string; owner: string; metadata: Json };
        Returns: undefined;
      };
      delete_prefix: {
        Args: { _bucket_id: string; _name: string };
        Returns: boolean;
      };
      extension: {
        Args: { name: string };
        Returns: string;
      };
      filename: {
        Args: { name: string };
        Returns: string;
      };
      foldername: {
        Args: { name: string };
        Returns: string[];
      };
      get_level: {
        Args: { name: string };
        Returns: number;
      };
      get_prefix: {
        Args: { name: string };
        Returns: string;
      };
      get_prefixes: {
        Args: { name: string };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
      search_legacy_v1: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
      search_v1_optimised: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
      search_v2: {
        Args: {
          prefix: string;
          bucket_name: string;
          limits?: number;
          levels?: number;
          start_after?: string;
        };
        Returns: {
          key: string;
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      buckettype: 'STANDARD' | 'ANALYTICS';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  cronos: {
    Enums: {
      audit_action: ['create', 'update', 'delete', 'execute'],
      job_status: ['pending', 'running', 'succeeded', 'failed'],
      job_type: [
        'sql_snippet',
        'database_function',
        'http_request',
        'edge_function',
      ],
      notification_type: ['email', 'webhook', 'slack'],
    },
  },
  graphql_public: {
    Enums: {},
  },
  homefin: {
    Enums: {
      account_type: ['cash', 'investment', 'debt'],
    },
  },
  invite: {
    Enums: {},
  },
  keepup: {
    Enums: {},
  },
  motion: {
    Enums: {},
  },
  pgbouncer: {
    Enums: {},
  },
  public: {
    Enums: {
      kelp_body_part: [
        'chest',
        'back',
        'legs',
        'shoulders',
        'arms',
        'core',
        'cardio',
        'full_body',
      ],
      kelp_fitness_level: ['sedentary', 'beginner', 'intermediate', 'advanced'],
      kelp_workout_status: ['scheduled', 'in_progress', 'completed', 'skipped'],
    },
  },
  quack: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ['STANDARD', 'ANALYTICS'],
    },
  },
  vault_app: {
    Enums: {},
  },
} as const;

// ============================================================================
// TABLE TYPE EXPORTS
// ============================================================================

// Exercises
export type Exercise = Database['public']['Tables']['kelp_exercises']['Row'];
export type ExerciseInsert =
  Database['public']['Tables']['kelp_exercises']['Insert'];
export type ExerciseUpdate =
  Database['public']['Tables']['kelp_exercises']['Update'];

// System Template Exercises
export type SystemTemplateExercise =
  Database['public']['Tables']['kelp_system_template_exercises']['Row'];
export type SystemTemplateExerciseInsert =
  Database['public']['Tables']['kelp_system_template_exercises']['Insert'];
export type SystemTemplateExerciseUpdate =
  Database['public']['Tables']['kelp_system_template_exercises']['Update'];

// System Workout Templates
export type SystemWorkoutTemplate =
  Database['public']['Tables']['kelp_system_workout_templates']['Row'];
export type SystemWorkoutTemplateInsert =
  Database['public']['Tables']['kelp_system_workout_templates']['Insert'];
export type SystemWorkoutTemplateUpdate =
  Database['public']['Tables']['kelp_system_workout_templates']['Update'];

// User Profiles
export type UserProfile =
  Database['public']['Tables']['kelp_user_profiles']['Row'];
export type UserProfileInsert =
  Database['public']['Tables']['kelp_user_profiles']['Insert'];
export type UserProfileUpdate =
  Database['public']['Tables']['kelp_user_profiles']['Update'];

// User Template Exercises
export type UserTemplateExercise =
  Database['public']['Tables']['kelp_user_template_exercises']['Row'];
export type UserTemplateExerciseInsert =
  Database['public']['Tables']['kelp_user_template_exercises']['Insert'];
export type UserTemplateExerciseUpdate =
  Database['public']['Tables']['kelp_user_template_exercises']['Update'];

// User Workout Templates
export type UserWorkoutTemplate =
  Database['public']['Tables']['kelp_user_workout_templates']['Row'];
export type UserWorkoutTemplateInsert =
  Database['public']['Tables']['kelp_user_workout_templates']['Insert'];
export type UserWorkoutTemplateUpdate =
  Database['public']['Tables']['kelp_user_workout_templates']['Update'];

// Workout Sessions (formerly kelp_workouts)
export type WorkoutSession =
  Database['public']['Tables']['kelp_workout_sessions']['Row'];
export type WorkoutSessionInsert =
  Database['public']['Tables']['kelp_workout_sessions']['Insert'];
export type WorkoutSessionUpdate =
  Database['public']['Tables']['kelp_workout_sessions']['Update'];

// Exercise Logs
export type ExerciseLog =
  Database['public']['Tables']['kelp_exercise_logs']['Row'];
export type ExerciseLogInsert =
  Database['public']['Tables']['kelp_exercise_logs']['Insert'];
export type ExerciseLogUpdate =
  Database['public']['Tables']['kelp_exercise_logs']['Update'];

// ============================================================================
// VIEW TYPE EXPORTS
// ============================================================================

// All Available Templates View
export type AllAvailableTemplate =
  Database['public']['Views']['kelp_all_available_templates']['Row'];

// System Templates with Equipment View
export type SystemTemplateWithEquipment =
  Database['public']['Views']['kelp_system_templates_with_equipment']['Row'];

// User Templates with Equipment View
export type UserTemplateWithEquipment =
  Database['public']['Views']['kelp_user_templates_with_equipment']['Row'];

// User Stats View
export type UserStats = Database['public']['Views']['user_stats']['Row'];

// ============================================================================
// FUNCTION RETURN TYPE EXPORTS
// ============================================================================

// Clone System Template to User
export type CloneSystemTemplateToUserResult =
  Database['public']['Functions']['kelp_clone_system_template_to_user']['Returns'];

// Complete Workout
export type CompleteWorkoutResult =
  Database['public']['Functions']['kelp_complete_workout']['Returns'];

// Create Session from User Template
export type CreateSessionFromUserTemplateResult =
  Database['public']['Functions']['kelp_create_session_from_user_template']['Returns'];

// Duplicate User Template
export type DuplicateUserTemplateResult =
  Database['public']['Functions']['kelp_duplicate_user_template']['Returns'];

// Get Exercise History
export type ExerciseHistoryResult =
  Database['public']['Functions']['kelp_get_exercise_history']['Returns'];

// Get User Stats
export type UserStatsResult =
  Database['public']['Functions']['kelp_get_user_stats']['Returns'];

// Get User Template Stats
export type UserTemplateStatsResult =
  Database['public']['Functions']['kelp_get_user_template_stats']['Returns'];

// Get User Workout Stats
export type UserWorkoutStatsResult =
  Database['public']['Functions']['kelp_get_user_workout_stats']['Returns'];

// Get Weekly Activity
export type WeeklyActivityResult =
  Database['public']['Functions']['kelp_get_weekly_activity']['Returns'];

// ============================================================================
// ENUM EXPORTS
// ============================================================================

export type KelpBodyPart = Database['public']['Enums']['kelp_body_part'];
export type KelpFitnessLevel =
  Database['public']['Enums']['kelp_fitness_level'];
export type KelpWorkoutIntensity =
  Database['public']['Enums']['kelp_workout_intensity'];
export type KelpWorkoutStatus =
  Database['public']['Enums']['kelp_workout_status'];

// ============================================================================
// DEPRECATED TYPES (for backward compatibility)
// ============================================================================

/** @deprecated Use WorkoutSession instead */
export type Workout = WorkoutSession;
/** @deprecated Use WorkoutSessionInsert instead */
export type WorkoutInsert = WorkoutSessionInsert;
/** @deprecated Use WorkoutSessionUpdate instead */
export type WorkoutUpdate = WorkoutSessionUpdate;
