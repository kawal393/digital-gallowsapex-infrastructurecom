export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assessment_leads: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          id: string
          industry: string | null
          score: number | null
          share_id: string | null
          status: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          score?: number | null
          share_id?: string | null
          status?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          score?: number | null
          share_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          lead_company: string | null
          lead_email: string | null
          lead_name: string | null
          message_count: number
          updated_at: string
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          message_count?: number
          updated_at?: string
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_company?: string | null
          lead_email?: string | null
          lead_name?: string | null
          message_count?: number
          updated_at?: string
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      chat_feedback: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          message_content: string | null
          message_id: string | null
          rating: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_content?: string | null
          message_id?: string | null
          rating: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_content?: string | null
          message_id?: string | null
          rating?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_feedback_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_knowledge_gaps: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          question: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          question: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_knowledge_gaps_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_results: {
        Row: {
          company_name: string
          created_at: string
          id: string
          next_audit_date: string | null
          overall_score: number
          referral_code: string | null
          referral_count: number
          status: string
          trio_mode: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string
          created_at?: string
          id?: string
          next_audit_date?: string | null
          overall_score?: number
          referral_code?: string | null
          referral_count?: number
          status?: string
          trio_mode?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          next_audit_date?: string | null
          overall_score?: number
          referral_code?: string | null
          referral_count?: number
          status?: string
          trio_mode?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          role: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          role?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      drip_queue: {
        Row: {
          conversation_id: string | null
          created_at: string
          drip_index: number
          id: string
          lead_company: string | null
          lead_email: string
          lead_name: string | null
          send_at: string
          sent_at: string | null
          status: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          drip_index?: number
          id?: string
          lead_company?: string | null
          lead_email: string
          lead_name?: string | null
          send_at: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          drip_index?: number
          id?: string
          lead_company?: string | null
          lead_email?: string
          lead_name?: string | null
          send_at?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "drip_queue_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      gallows_ledger: {
        Row: {
          action: string
          challenge_hash: string | null
          challenged_at: string | null
          commit_hash: string
          commit_id: string
          created_at: string
          id: string
          merkle_leaf_hash: string
          merkle_proof: Json | null
          merkle_root: string | null
          phase: string
          predicate_id: string
          proof_hash: string | null
          proven_at: string | null
          status: string | null
          user_id: string | null
          verification_time_ms: number | null
          violation_found: string | null
        }
        Insert: {
          action: string
          challenge_hash?: string | null
          challenged_at?: string | null
          commit_hash: string
          commit_id: string
          created_at?: string
          id?: string
          merkle_leaf_hash: string
          merkle_proof?: Json | null
          merkle_root?: string | null
          phase?: string
          predicate_id: string
          proof_hash?: string | null
          proven_at?: string | null
          status?: string | null
          user_id?: string | null
          verification_time_ms?: number | null
          violation_found?: string | null
        }
        Update: {
          action?: string
          challenge_hash?: string | null
          challenged_at?: string | null
          commit_hash?: string
          commit_id?: string
          created_at?: string
          id?: string
          merkle_leaf_hash?: string
          merkle_proof?: Json | null
          merkle_root?: string | null
          phase?: string
          predicate_id?: string
          proof_hash?: string | null
          proven_at?: string | null
          status?: string | null
          user_id?: string | null
          verification_time_ms?: number | null
          violation_found?: string | null
        }
        Relationships: []
      }
      lattice_config: {
        Row: {
          created_at: string
          id: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      partner_referrals: {
        Row: {
          commission_amount: number
          created_at: string
          id: string
          partner_id: string
          referred_email: string
          referred_user_id: string | null
          status: string
        }
        Insert: {
          commission_amount?: number
          created_at?: string
          id?: string
          partner_id: string
          referred_email: string
          referred_user_id?: string | null
          status?: string
        }
        Update: {
          commission_amount?: number
          created_at?: string
          id?: string
          partner_id?: string
          referred_email?: string
          referred_user_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          id: string
          partner_code: string
          payout_email: string | null
          status: string
          total_earnings: number
          total_referrals: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_code: string
          payout_email?: string | null
          status?: string
          total_earnings?: number
          total_referrals?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_code?: string
          payout_email?: string | null
          status?: string
          total_earnings?: number
          total_referrals?: number
          user_id?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          ai_content_labeled: string
          ai_profiling: string
          ai_providers: string[]
          ai_system_count: number
          automated_decisions: string
          company_name: string
          company_size: string
          completed: boolean
          compliance_officer: string
          created_at: string
          eu_presence: string
          governance_policy: string
          high_risk_uses: string[]
          id: string
          industry: string
          personal_data: string
          right_to_explanation: string
          risk_assessments: string
          special_category_data: string[]
          updated_at: string
          user_id: string
          users_informed: string
        }
        Insert: {
          ai_content_labeled?: string
          ai_profiling?: string
          ai_providers?: string[]
          ai_system_count?: number
          automated_decisions?: string
          company_name?: string
          company_size?: string
          completed?: boolean
          compliance_officer?: string
          created_at?: string
          eu_presence?: string
          governance_policy?: string
          high_risk_uses?: string[]
          id?: string
          industry?: string
          personal_data?: string
          right_to_explanation?: string
          risk_assessments?: string
          special_category_data?: string[]
          updated_at?: string
          user_id: string
          users_informed?: string
        }
        Update: {
          ai_content_labeled?: string
          ai_profiling?: string
          ai_providers?: string[]
          ai_system_count?: number
          automated_decisions?: string
          company_name?: string
          company_size?: string
          completed?: boolean
          compliance_officer?: string
          created_at?: string
          eu_presence?: string
          governance_policy?: string
          high_risk_uses?: string[]
          id?: string
          industry?: string
          personal_data?: string
          right_to_explanation?: string
          risk_assessments?: string
          special_category_data?: string[]
          updated_at?: string
          user_id?: string
          users_informed?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          tier: string
          user_id: string
          verifications_limit: number
          verifications_used: number
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          tier?: string
          user_id: string
          verifications_limit?: number
          verifications_used?: number
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          tier?: string
          user_id?: string
          verifications_limit?: number
          verifications_used?: number
        }
        Relationships: []
      }
      translation_cache: {
        Row: {
          created_at: string
          id: string
          lang: string
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lang: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lang?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      verification_history: {
        Row: {
          article_number: string
          article_title: string
          compliance_result_id: string | null
          created_at: string
          id: string
          merkle_proof_hash: string | null
          status: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          article_number: string
          article_title: string
          compliance_result_id?: string | null
          created_at?: string
          id?: string
          merkle_proof_hash?: string | null
          status?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          article_number?: string
          article_title?: string
          compliance_result_id?: string | null
          created_at?: string
          id?: string
          merkle_proof_hash?: string | null
          status?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_history_compliance_result_id_fkey"
            columns: ["compliance_result_id"]
            isOneToOne: false
            referencedRelation: "compliance_pulse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_history_compliance_result_id_fkey"
            columns: ["compliance_result_id"]
            isOneToOne: false
            referencedRelation: "compliance_results"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      compliance_pulse: {
        Row: {
          company_name: string | null
          id: string | null
          overall_score: number | null
          status: string | null
          trio_mode: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          id?: string | null
          overall_score?: number | null
          status?: string | null
          trio_mode?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          id?: string | null
          overall_score?: number | null
          status?: string | null
          trio_mode?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gallows_public_ledger: {
        Row: {
          action: string | null
          challenge_hash: string | null
          challenged_at: string | null
          commit_hash: string | null
          commit_id: string | null
          created_at: string | null
          id: string | null
          merkle_leaf_hash: string | null
          merkle_proof: Json | null
          merkle_root: string | null
          phase: string | null
          predicate_id: string | null
          proof_hash: string | null
          proven_at: string | null
          status: string | null
          verification_time_ms: number | null
          violation_found: string | null
        }
        Insert: {
          action?: string | null
          challenge_hash?: string | null
          challenged_at?: string | null
          commit_hash?: string | null
          commit_id?: string | null
          created_at?: string | null
          id?: string | null
          merkle_leaf_hash?: string | null
          merkle_proof?: Json | null
          merkle_root?: string | null
          phase?: string | null
          predicate_id?: string | null
          proof_hash?: string | null
          proven_at?: string | null
          status?: string | null
          verification_time_ms?: number | null
          violation_found?: string | null
        }
        Update: {
          action?: string | null
          challenge_hash?: string | null
          challenged_at?: string | null
          commit_hash?: string | null
          commit_id?: string | null
          created_at?: string | null
          id?: string | null
          merkle_leaf_hash?: string | null
          merkle_proof?: Json | null
          merkle_root?: string | null
          phase?: string | null
          predicate_id?: string | null
          proof_hash?: string | null
          proven_at?: string | null
          status?: string | null
          verification_time_ms?: number | null
          violation_found?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_assessment_by_share_id: {
        Args: { p_share_id: string }
        Returns: {
          company_name: string
          industry: string
          score: number
          status: string
        }[]
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
