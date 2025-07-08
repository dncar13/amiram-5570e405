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
      questions: {
        Row: {
          correct_answer: number
          created_at: string | null
          difficulty: string | null
          explanation: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          options: Json
          original_id: number | null
          passage_text: string | null
          passage_title: string | null
          tags: Json | null
          text: string
          topic_id: number | null
          type: string
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          options: Json
          original_id?: number | null
          passage_text?: string | null
          passage_title?: string | null
          tags?: Json | null
          text: string
          topic_id?: number | null
          type: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          options?: Json
          original_id?: number | null
          passage_text?: string | null
          passage_title?: string | null
          tags?: Json | null
          text?: string
          topic_id?: number | null
          type?: string
        }
        Relationships: []
      }
      simulation_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          difficulty: string | null
          id: string
          question_limit: number
          questions_attempted: number
          questions_correct: number
          session_type: string
          started_at: string | null
          status: string
          total_time_seconds: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          question_limit?: number
          questions_attempted?: number
          questions_correct?: number
          session_type: string
          started_at?: string | null
          status?: string
          total_time_seconds?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          question_limit?: number
          questions_attempted?: number
          questions_correct?: number
          session_type?: string
          started_at?: string | null
          status?: string
          total_time_seconds?: number
          user_id?: string
        }
        Relationships: []
      }
      simulations: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          id: string
          score: number | null
          status: string | null
          time_completed: string | null
          time_limit_minutes: number | null
          time_started: string | null
          total_questions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          score?: number | null
          status?: string | null
          time_completed?: string | null
          time_limit_minutes?: number | null
          time_started?: string | null
          total_questions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          score?: number | null
          status?: string | null
          time_completed?: string | null
          time_limit_minutes?: number | null
          time_started?: string | null
          total_questions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_active?: boolean | null
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
