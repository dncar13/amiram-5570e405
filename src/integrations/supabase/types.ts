export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      coupon_usage: {
        Row: {
          coupon_id: string
          discount_amount: number
          final_amount: number
          id: string
          original_amount: number
          plan_type: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          discount_amount: number
          final_amount: number
          id?: string
          original_amount: number
          plan_type: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          discount_amount?: number
          final_amount?: number
          id?: string
          original_amount?: number
          plan_type?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          allowed_plans: string[] | null
          assigned_user_email: string | null
          assigned_user_id: string | null
          code: string
          created_at: string | null
          created_by: string | null
          discount_type: string
          discount_value: number
          expire_at: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
        }
        Insert: {
          allowed_plans?: string[] | null
          assigned_user_email?: string | null
          assigned_user_id?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          discount_type: string
          discount_value: number
          expire_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Update: {
          allowed_plans?: string[] | null
          assigned_user_email?: string | null
          assigned_user_id?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          discount_type?: string
          discount_value?: number
          expire_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      migration_logs: {
        Row: {
          batch_id: string
          created_at: string | null
          errors: Json | null
          file_path: string | null
          id: string
          records_processed: number | null
          status: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          errors?: Json | null
          file_path?: string | null
          id?: string
          records_processed?: number | null
          status?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          errors?: Json | null
          file_path?: string | null
          id?: string
          records_processed?: number | null
          status?: string | null
        }
        Relationships: []
      }
      passages: {
        Row: {
          content: string
          created_at: string | null
          difficulty: string | null
          estimated_reading_time: number | null
          general_subject: string | null
          id: string
          line_count: number | null
          metadata: Json | null
          original_id: number | null
          title: string
          topic: string | null
          word_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          difficulty?: string | null
          estimated_reading_time?: number | null
          general_subject?: string | null
          id?: string
          line_count?: number | null
          metadata?: Json | null
          original_id?: number | null
          title: string
          topic?: string | null
          word_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          difficulty?: string | null
          estimated_reading_time?: number | null
          general_subject?: string | null
          id?: string
          line_count?: number | null
          metadata?: Json | null
          original_id?: number | null
          title?: string
          topic?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      question_sets: {
        Row: {
          created_at: string | null
          difficulty: string | null
          id: string
          metadata: Json | null
          name: string
          passage_id: string | null
          question_count: number | null
          type: string
        }
        Insert: {
          created_at?: string | null
          difficulty?: string | null
          id?: string
          metadata?: Json | null
          name: string
          passage_id?: string | null
          question_count?: number | null
          type: string
        }
        Update: {
          created_at?: string | null
          difficulty?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          passage_id?: string | null
          question_count?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_sets_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          ai_generated: boolean | null
          answer_options: Json
          batch_id: string | null
          correct_answer: string
          created_at: string
          difficulty: string
          explanation: string | null
          generation_model: string | null
          id: string
          image_url: string | null
          is_premium: boolean | null
          line_numbers: boolean | null
          metadata: Json | null
          original_id: number | null
          passage_content: string | null
          passage_id: string | null
          passage_line_range: Json | null
          passage_title: string | null
          quality_score: number | null
          question_subtype: string | null
          question_text: string
          set_id: string | null
          set_order: number | null
          subtopic_id: number | null
          topic_id: number | null
          type: string
          updated_at: string
          version: number | null
        }
        Insert: {
          ai_generated?: boolean | null
          answer_options: Json
          batch_id?: string | null
          correct_answer: string
          created_at?: string
          difficulty: string
          explanation?: string | null
          generation_model?: string | null
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          line_numbers?: boolean | null
          metadata?: Json | null
          original_id?: number | null
          passage_content?: string | null
          passage_id?: string | null
          passage_line_range?: Json | null
          passage_title?: string | null
          quality_score?: number | null
          question_subtype?: string | null
          question_text: string
          set_id?: string | null
          set_order?: number | null
          subtopic_id?: number | null
          topic_id?: number | null
          type: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          ai_generated?: boolean | null
          answer_options?: Json
          batch_id?: string | null
          correct_answer?: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          generation_model?: string | null
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          line_numbers?: boolean | null
          metadata?: Json | null
          original_id?: number | null
          passage_content?: string | null
          passage_id?: string | null
          passage_line_range?: Json | null
          passage_title?: string | null
          quality_score?: number | null
          question_subtype?: string | null
          question_text?: string
          set_id?: string | null
          set_order?: number | null
          subtopic_id?: number | null
          topic_id?: number | null
          type?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "question_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_questions: {
        Row: {
          id: string
          question_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          question_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          question_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_sessions: {
        Row: {
          answers: Json | null
          completed_at: string | null
          correct_answers: number
          created_at: string
          current_question_index: number | null
          difficulty: string | null
          id: string
          is_completed: boolean | null
          metadata: Json | null
          progress_percentage: number | null
          questions_answered: number
          session_type: string
          status: string | null
          time_spent: number
          topic_id: number | null
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          current_question_index?: number | null
          difficulty?: string | null
          id?: string
          is_completed?: boolean | null
          metadata?: Json | null
          progress_percentage?: number | null
          questions_answered?: number
          session_type: string
          status?: string | null
          time_spent?: number
          topic_id?: number | null
          total_questions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          current_question_index?: number | null
          difficulty?: string | null
          id?: string
          is_completed?: boolean | null
          metadata?: Json | null
          progress_percentage?: number | null
          questions_answered?: number
          session_type?: string
          status?: string | null
          time_spent?: number
          topic_id?: number | null
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          plan_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          plan_type: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          plan_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          achievement_notifications: boolean | null
          adaptive_difficulty: boolean | null
          allow_analytics: boolean | null
          auto_advance_time: number | null
          created_at: string | null
          daily_reminder_enabled: boolean | null
          daily_reminder_time: string | null
          delivery_strategy: string | null
          enable_smart_delivery: boolean | null
          enable_sound: boolean | null
          font_size: string | null
          id: string
          preferred_difficulty: string | null
          questions_per_session: number | null
          reduce_animations: boolean | null
          share_anonymous_data: boolean | null
          show_explanations: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
          weekly_progress_email: boolean | null
        }
        Insert: {
          achievement_notifications?: boolean | null
          adaptive_difficulty?: boolean | null
          allow_analytics?: boolean | null
          auto_advance_time?: number | null
          created_at?: string | null
          daily_reminder_enabled?: boolean | null
          daily_reminder_time?: string | null
          delivery_strategy?: string | null
          enable_smart_delivery?: boolean | null
          enable_sound?: boolean | null
          font_size?: string | null
          id?: string
          preferred_difficulty?: string | null
          questions_per_session?: number | null
          reduce_animations?: boolean | null
          share_anonymous_data?: boolean | null
          show_explanations?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
          weekly_progress_email?: boolean | null
        }
        Update: {
          achievement_notifications?: boolean | null
          adaptive_difficulty?: boolean | null
          allow_analytics?: boolean | null
          auto_advance_time?: number | null
          created_at?: string | null
          daily_reminder_enabled?: boolean | null
          daily_reminder_time?: string | null
          delivery_strategy?: string | null
          enable_smart_delivery?: boolean | null
          enable_sound?: boolean | null
          font_size?: string | null
          id?: string
          preferred_difficulty?: string | null
          questions_per_session?: number | null
          reduce_animations?: boolean | null
          share_anonymous_data?: boolean | null
          show_explanations?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
          weekly_progress_email?: boolean | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          answered_at: string
          answered_correctly: boolean
          id: string
          question_id: string
          time_spent: number | null
          user_id: string
        }
        Insert: {
          answered_at?: string
          answered_correctly: boolean
          id?: string
          question_id: string
          time_spent?: number | null
          user_id: string
        }
        Update: {
          answered_at?: string
          answered_correctly?: boolean
          id?: string
          question_id?: string
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress_summary: {
        Row: {
          average_accuracy: number | null
          average_time_per_question: number | null
          created_at: string | null
          current_streak_days: number | null
          difficulty: string
          id: string
          last_practice_date: string | null
          longest_streak_days: number | null
          questions_correct: number
          questions_flagged: number
          questions_incorrect: number
          questions_seen: number
          total_practice_time: number | null
          total_questions_available: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_accuracy?: number | null
          average_time_per_question?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          difficulty: string
          id?: string
          last_practice_date?: string | null
          longest_streak_days?: number | null
          questions_correct?: number
          questions_flagged?: number
          questions_incorrect?: number
          questions_seen?: number
          total_practice_time?: number | null
          total_questions_available?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_accuracy?: number | null
          average_time_per_question?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          difficulty?: string
          id?: string
          last_practice_date?: string | null
          longest_streak_days?: number | null
          questions_correct?: number
          questions_flagged?: number
          questions_incorrect?: number
          questions_seen?: number
          total_practice_time?: number | null
          total_questions_available?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_question_history: {
        Row: {
          answer_selected: number | null
          created_at: string | null
          difficulty: string
          flagged: boolean | null
          id: string
          is_correct: boolean
          last_seen_at: string | null
          notes: string | null
          question_id: number
          simulation_session_id: string | null
          simulation_type: string | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          answer_selected?: number | null
          created_at?: string | null
          difficulty: string
          flagged?: boolean | null
          id?: string
          is_correct: boolean
          last_seen_at?: string | null
          notes?: string | null
          question_id: number
          simulation_session_id?: string | null
          simulation_type?: string | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          answer_selected?: number | null
          created_at?: string | null
          difficulty?: string
          flagged?: boolean | null
          id?: string
          is_correct?: boolean
          last_seen_at?: string | null
          notes?: string | null
          question_id?: number
          simulation_session_id?: string | null
          simulation_type?: string | null
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      set_progress_debug: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          current_question_index: number | null
          difficulty: string | null
          full_metadata: Json | null
          id: string | null
          is_set_based: string | null
          questions_answered: number | null
          questions_in_set: string | null
          session_type: string | null
          set_difficulty: string | null
          set_id: string | null
          set_number: string | null
          set_type: string | null
          status: string | null
          total_questions: number | null
          update_status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string | null
          current_question_index?: number | null
          difficulty?: string | null
          full_metadata?: Json | null
          id?: string | null
          is_set_based?: never
          questions_answered?: number | null
          questions_in_set?: never
          session_type?: string | null
          set_difficulty?: never
          set_id?: never
          set_number?: never
          set_type?: never
          status?: string | null
          total_questions?: number | null
          update_status?: never
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          correct_answers?: number | null
          created_at?: string | null
          current_question_index?: number | null
          difficulty?: string | null
          full_metadata?: Json | null
          id?: string | null
          is_set_based?: never
          questions_answered?: number | null
          questions_in_set?: never
          session_type?: string | null
          set_difficulty?: never
          set_id?: never
          set_number?: never
          set_type?: never
          status?: string | null
          total_questions?: number | null
          update_status?: never
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cancel_user_subscription: {
        Args: { p_user_id: string }
        Returns: {
          success: boolean
          updated_count: number
          message: string
        }[]
      }
      clean_duplicate_set_sessions: {
        Args: Record<PropertyKey, never>
        Returns: {
          deleted_count: number
        }[]
      }
      get_user_set_progress_summary: {
        Args: { p_user_id: string }
        Returns: {
          set_type: string
          set_difficulty: string
          total_sets: number
          completed_sets: number
          in_progress_sets: number
          average_score: number
        }[]
      }
      has_active_premium: {
        Args: { user_id: string }
        Returns: boolean
      }
      process_free_coupon_subscription: {
        Args: {
          p_user_id: string
          p_coupon_id: string
          p_plan_type: string
          p_original_amount: number
          p_discount_amount: number
          p_final_amount: number
        }
        Returns: {
          success: boolean
          subscription_id: string
          message: string
        }[]
      }
      validate_set_metadata: {
        Args: { metadata: Json }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
