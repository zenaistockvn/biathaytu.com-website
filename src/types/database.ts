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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          tenant_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          tenant_id?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          tenant_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ad_angles: {
        Row: {
          created_at: string | null
          examples: Json | null
          icon: string
          id: string
          name: string
          sort_order: number | null
          template: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          examples?: Json | null
          icon: string
          id?: string
          name: string
          sort_order?: number | null
          template: string
          tenant_id?: string
        }
        Update: {
          created_at?: string | null
          examples?: Json | null
          icon?: string
          id?: string
          name?: string
          sort_order?: number | null
          template?: string
          tenant_id?: string
        }
        Relationships: []
      }
      ad_platform_specs: {
        Row: {
          char_limit: string
          created_at: string | null
          element_name: string
          id: string
          note: string | null
          platform_color: string
          platform_icon: string
          platform_name: string
          sort_order: number | null
          tenant_id: string
        }
        Insert: {
          char_limit: string
          created_at?: string | null
          element_name: string
          id?: string
          note?: string | null
          platform_color: string
          platform_icon: string
          platform_name: string
          sort_order?: number | null
          tenant_id?: string
        }
        Update: {
          char_limit?: string
          created_at?: string | null
          element_name?: string
          id?: string
          note?: string | null
          platform_color?: string
          platform_icon?: string
          platform_name?: string
          sort_order?: number | null
          tenant_id?: string
        }
        Relationships: []
      }
      brand_dna: {
        Row: {
          brand_key: string
          colors: string | null
          created_at: string | null
          heritage: string | null
          id: string
          mood: string | null
          name: string
          tagline: string | null
          tenant_id: string
          visual_code: string | null
        }
        Insert: {
          brand_key: string
          colors?: string | null
          created_at?: string | null
          heritage?: string | null
          id?: string
          mood?: string | null
          name: string
          tagline?: string | null
          tenant_id?: string
          visual_code?: string | null
        }
        Update: {
          brand_key?: string
          colors?: string | null
          created_at?: string | null
          heritage?: string | null
          id?: string
          mood?: string | null
          name?: string
          tagline?: string | null
          tenant_id?: string
          visual_code?: string | null
        }
        Relationships: []
      }
      brand_settings: {
        Row: {
          brand_name: string
          brand_voice: string
          colors: Json | null
          hashtags: Json | null
          id: string
          logo_url: string | null
          tenant_id: string
        }
        Insert: {
          brand_name: string
          brand_voice: string
          colors?: Json | null
          hashtags?: Json | null
          id?: string
          logo_url?: string | null
          tenant_id: string
        }
        Update: {
          brand_name?: string
          brand_voice?: string
          colors?: Json | null
          hashtags?: Json | null
          id?: string
          logo_url?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      content_calendar: {
        Row: {
          ai_workflow: string | null
          content_id: string | null
          created_at: string | null
          cta: string | null
          day_number: number
          deliverables: string | null
          hook: string | null
          id: string
          scheduled_date: string
          status: string | null
          storytelling_goal: string
          tenant_id: string
          theme: string
          updated_at: string | null
          visual_brief: string | null
          week_number: number
        }
        Insert: {
          ai_workflow?: string | null
          content_id?: string | null
          created_at?: string | null
          cta?: string | null
          day_number: number
          deliverables?: string | null
          hook?: string | null
          id?: string
          scheduled_date: string
          status?: string | null
          storytelling_goal: string
          tenant_id?: string
          theme: string
          updated_at?: string | null
          visual_brief?: string | null
          week_number: number
        }
        Update: {
          ai_workflow?: string | null
          content_id?: string | null
          created_at?: string | null
          cta?: string | null
          day_number?: number
          deliverables?: string | null
          hook?: string | null
          id?: string
          scheduled_date?: string
          status?: string | null
          storytelling_goal?: string
          tenant_id?: string
          theme?: string
          updated_at?: string | null
          visual_brief?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_calendar_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "generated_contents"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          best_time_slots: Json | null
          created_at: string | null
          id: string
          name: string
          platforms: Json | null
          prompt_template: string
          tenant_id: string
        }
        Insert: {
          best_time_slots?: Json | null
          created_at?: string | null
          id?: string
          name: string
          platforms?: Json | null
          prompt_template: string
          tenant_id: string
        }
        Update: {
          best_time_slots?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          platforms?: Json | null
          prompt_template?: string
          tenant_id?: string
        }
        Relationships: []
      }
      content_tips: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          id: string
          section: string
          sort_order: number | null
          tenant_id: string
          title: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          description?: string | null
          id?: string
          section: string
          sort_order?: number | null
          tenant_id?: string
          title: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          section?: string
          sort_order?: number | null
          tenant_id?: string
          title?: string
        }
        Relationships: []
      }
      generated_contents: {
        Row: {
          ai_score: number | null
          caption: string
          content_format: string | null
          created_at: string | null
          hashtags: string | null
          id: string
          image_prompt: string | null
          image_urls: Json | null
          notes: string | null
          parent_id: string | null
          platform: string
          product_id: string | null
          source_article_id: string | null
          status: string | null
          target_page_id: string | null
          tenant_id: string
          video_prompt: string | null
          video_url: string | null
        }
        Insert: {
          ai_score?: number | null
          caption: string
          content_format?: string | null
          created_at?: string | null
          hashtags?: string | null
          id?: string
          image_prompt?: string | null
          image_urls?: Json | null
          notes?: string | null
          parent_id?: string | null
          platform: string
          product_id?: string | null
          source_article_id?: string | null
          status?: string | null
          target_page_id?: string | null
          tenant_id: string
          video_prompt?: string | null
          video_url?: string | null
        }
        Update: {
          ai_score?: number | null
          caption?: string
          content_format?: string | null
          created_at?: string | null
          hashtags?: string | null
          id?: string
          image_prompt?: string | null
          image_urls?: Json | null
          notes?: string | null
          parent_id?: string | null
          platform?: string
          product_id?: string | null
          source_article_id?: string | null
          status?: string | null
          target_page_id?: string | null
          tenant_id?: string
          video_prompt?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_contents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_contents_target_page_id_fkey"
            columns: ["target_page_id"]
            isOneToOne: false
            referencedRelation: "satellite_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      image_prompts: {
        Row: {
          created_at: string | null
          id: string
          prompt: string
          purpose: string | null
          ratio: string | null
          sort_order: number | null
          style_description: string
          style_icon: string
          style_id: string
          style_name: string
          tenant_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt: string
          purpose?: string | null
          ratio?: string | null
          sort_order?: number | null
          style_description: string
          style_icon: string
          style_id: string
          style_name: string
          tenant_id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt?: string
          purpose?: string | null
          ratio?: string | null
          sort_order?: number | null
          style_description?: string
          style_icon?: string
          style_id?: string
          style_name?: string
          tenant_id?: string
          title?: string
        }
        Relationships: []
      }
      post_analytics: {
        Row: {
          comments: number | null
          engagement: number | null
          fetched_at: string | null
          id: string
          likes: number | null
          post_id: string
          reach: number | null
          shares: number | null
        }
        Insert: {
          comments?: number | null
          engagement?: number | null
          fetched_at?: string | null
          id?: string
          likes?: number | null
          post_id: string
          reach?: number | null
          shares?: number | null
        }
        Update: {
          comments?: number | null
          engagement?: number | null
          fetched_at?: string | null
          id?: string
          likes?: number | null
          post_id?: string
          reach?: number | null
          shares?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string
          created_at: string | null
          error_log: string | null
          external_id: string | null
          id: string
          image_urls: Json | null
          is_approved: boolean | null
          platform: string
          product_id: string | null
          published_at: string | null
          scheduled_at: string
          status: string | null
          target_page_id: string | null
          tenant_id: string
        }
        Insert: {
          caption: string
          created_at?: string | null
          error_log?: string | null
          external_id?: string | null
          id?: string
          image_urls?: Json | null
          is_approved?: boolean | null
          platform: string
          product_id?: string | null
          published_at?: string | null
          scheduled_at: string
          status?: string | null
          target_page_id?: string | null
          tenant_id: string
        }
        Update: {
          caption?: string
          created_at?: string | null
          error_log?: string | null
          external_id?: string | null
          id?: string
          image_urls?: Json | null
          is_approved?: boolean | null
          platform?: string
          product_id?: string | null
          published_at?: string | null
          scheduled_at?: string
          status?: string | null
          target_page_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_target_page_id_fkey"
            columns: ["target_page_id"]
            isOneToOne: false
            referencedRelation: "satellite_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          abv: number | null
          ai_analysis: Json | null
          brewing_method: string | null
          category: string | null
          created_at: string | null
          description: string | null
          haravan_url: string | null
          ibu: number | null
          id: string
          images: Json | null
          is_featured: boolean | null
          last_posted_at: string | null
          name: string
          origin: string | null
          price: number | null
          slug: string | null
          sort_order: number | null
          tenant_id: string
          updated_at: string | null
          usp: string | null
          volume: string | null
        }
        Insert: {
          abv?: number | null
          ai_analysis?: Json | null
          brewing_method?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          haravan_url?: string | null
          ibu?: number | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          last_posted_at?: string | null
          name: string
          origin?: string | null
          price?: number | null
          slug?: string | null
          sort_order?: number | null
          tenant_id: string
          updated_at?: string | null
          usp?: string | null
          volume?: string | null
        }
        Update: {
          abv?: number | null
          ai_analysis?: Json | null
          brewing_method?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          haravan_url?: string | null
          ibu?: number | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          last_posted_at?: string | null
          name?: string
          origin?: string | null
          price?: number | null
          slug?: string | null
          sort_order?: number | null
          tenant_id?: string
          updated_at?: string | null
          usp?: string | null
          volume?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_assets: {
        Row: {
          asset_type: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_transparent_bg: boolean | null
          product_id: string | null
          tenant_id: string | null
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_transparent_bg?: boolean | null
          product_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_transparent_bg?: boolean | null
          product_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_assets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_assets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      satellite_pages: {
        Row: {
          content_mix: Json | null
          content_pillars: Json | null
          created_at: string | null
          default_cta: string | null
          default_hashtags: Json | null
          id: string
          is_active: boolean | null
          page_icon: string | null
          page_name: string
          page_role: string
          page_slug: string
          social_account_id: string | null
          sort_order: number | null
          tagline: string | null
          tenant_id: string
          tone_voice: string | null
        }
        Insert: {
          content_mix?: Json | null
          content_pillars?: Json | null
          created_at?: string | null
          default_cta?: string | null
          default_hashtags?: Json | null
          id?: string
          is_active?: boolean | null
          page_icon?: string | null
          page_name: string
          page_role?: string
          page_slug: string
          social_account_id?: string | null
          sort_order?: number | null
          tagline?: string | null
          tenant_id: string
          tone_voice?: string | null
        }
        Update: {
          content_mix?: Json | null
          content_pillars?: Json | null
          created_at?: string | null
          default_cta?: string | null
          default_hashtags?: Json | null
          id?: string
          is_active?: boolean | null
          page_icon?: string | null
          page_name?: string
          page_role?: string
          page_slug?: string
          social_account_id?: string | null
          sort_order?: number | null
          tagline?: string | null
          tenant_id?: string
          tone_voice?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "satellite_pages_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "satellite_pages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_rules: {
        Row: {
          content_type: string
          created_at: string | null
          days_of_week: Json | null
          id: string
          is_active: boolean | null
          name: string
          platform: string
          rotation: string | null
          target_page_id: string | null
          tenant_id: string
          time: string
        }
        Insert: {
          content_type: string
          created_at?: string | null
          days_of_week?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          platform: string
          rotation?: string | null
          target_page_id?: string | null
          tenant_id: string
          time: string
        }
        Update: {
          content_type?: string
          created_at?: string | null
          days_of_week?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          platform?: string
          rotation?: string | null
          target_page_id?: string | null
          tenant_id?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_rules_target_page_id_fkey"
            columns: ["target_page_id"]
            isOneToOne: false
            referencedRelation: "satellite_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_articles: {
        Row: {
          content: string
          created_at: string | null
          id: string
          keywords: Json | null
          meta_description: string | null
          micro_content_count: number | null
          product_id: string | null
          slug: string | null
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          keywords?: Json | null
          meta_description?: string | null
          micro_content_count?: number | null
          product_id?: string | null
          slug?: string | null
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          keywords?: Json | null
          meta_description?: string | null
          micro_content_count?: number | null
          product_id?: string | null
          slug?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_articles_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          access_token: string
          account_id: string
          account_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          refresh_token: string | null
          tenant_id: string
          token_expiry: string | null
        }
        Insert: {
          access_token: string
          account_id: string
          account_name: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          refresh_token?: string | null
          tenant_id: string
          token_expiry?: string | null
        }
        Update: {
          access_token?: string
          account_id?: string
          account_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          refresh_token?: string | null
          tenant_id?: string
          token_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
