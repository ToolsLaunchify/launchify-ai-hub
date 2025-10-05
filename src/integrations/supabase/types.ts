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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ats_scores: {
        Row: {
          analysis_data: Json
          created_at: string
          id: string
          resume_id: string
          score: number
        }
        Insert: {
          analysis_data?: Json
          created_at?: string
          id?: string
          resume_id: string
          score: number
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          id?: string
          resume_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ats_scores_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "user_resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          canonical_url: string | null
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          structured_data: Json | null
          tags: string[] | null
          title: string
          twitter_image_url: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          structured_data?: Json | null
          tags?: string[] | null
          title: string
          twitter_image_url?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          structured_data?: Json | null
          tags?: string[] | null
          title?: string
          twitter_image_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      click_tracking: {
        Row: {
          click_type: string
          created_at: string
          id: string
          ip_address: string | null
          product_id: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          click_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          product_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          click_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          product_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "click_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      conversions: {
        Row: {
          click_tracking_id: string | null
          conversion_type: string
          created_at: string
          currency: string | null
          id: string
          lead_id: string | null
          product_id: string | null
          revenue_amount: number | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          click_tracking_id?: string | null
          conversion_type: string
          created_at?: string
          currency?: string | null
          id?: string
          lead_id?: string | null
          product_id?: string | null
          revenue_amount?: number | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          click_tracking_id?: string | null
          conversion_type?: string
          created_at?: string
          currency?: string | null
          id?: string
          lead_id?: string | null
          product_id?: string | null
          revenue_amount?: number | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversions_click_tracking_id_fkey"
            columns: ["click_tracking_id"]
            isOneToOne: false
            referencedRelation: "click_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      discovered_tools: {
        Row: {
          affiliate_info: Json | null
          category: string | null
          created_at: string
          description: string | null
          external_url: string | null
          has_affiliate_program: boolean | null
          id: string
          launch_date: string | null
          name: string
          pricing_info: Json | null
          priority_score: number | null
          source_id: string | null
          source_platform: string
          status: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          affiliate_info?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          has_affiliate_program?: boolean | null
          id?: string
          launch_date?: string | null
          name: string
          pricing_info?: Json | null
          priority_score?: number | null
          source_id?: string | null
          source_platform: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          affiliate_info?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          has_affiliate_program?: boolean | null
          id?: string
          launch_date?: string | null
          name?: string
          pricing_info?: Json | null
          priority_score?: number | null
          source_id?: string | null
          source_platform?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          name: string
          phone: string | null
          product_id: string | null
          referrer: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          name: string
          phone?: string | null
          product_id?: string | null
          referrer?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          phone?: string | null
          product_id?: string | null
          referrer?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          source: string | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          payment_status: string | null
          product_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_status?: string | null
          product_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_status?: string | null
          product_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_ratings: {
        Row: {
          created_at: string
          id: string
          product_id: string
          rating: number
          review: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          rating: number
          review?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          review?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          adsense_config: Json | null
          affiliate_link: string | null
          alt_text: string | null
          canonical_url: string | null
          category_id: string | null
          collect_email: boolean | null
          content_score: number | null
          created_at: string
          cta_button_text: string | null
          currency: string | null
          custom_code: string | null
          custom_permalink: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          discounted_price: number | null
          faq_data: Json | null
          file_attachments: Json | null
          focus_keyword: string | null
          howto_data: Json | null
          id: string
          image_url: string | null
          is_deleted: boolean | null
          is_editors_choice: boolean | null
          is_embedded_tool: boolean | null
          is_featured: boolean | null
          is_free: boolean | null
          is_newly_launched: boolean | null
          is_popular: boolean | null
          is_trending: boolean | null
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image_url: string | null
          original_price: number | null
          payment_link: string | null
          product_tags: string[] | null
          product_type: string | null
          purchase_price: number | null
          razorpay_plan_id: string | null
          related_keywords: string[] | null
          revenue_type: Database["public"]["Enums"]["revenue_type"] | null
          rich_description: string | null
          saves_count: number | null
          schema_markup: Json | null
          seo_title: string | null
          slug: string
          social_description: string | null
          social_title: string | null
          structured_data_type: string | null
          sub_category_id: string | null
          tool_config: Json | null
          tool_type: string | null
          tool_url: string | null
          twitter_image_url: string | null
          updated_at: string
          video_courses: Json | null
          views_count: number | null
        }
        Insert: {
          adsense_config?: Json | null
          affiliate_link?: string | null
          alt_text?: string | null
          canonical_url?: string | null
          category_id?: string | null
          collect_email?: boolean | null
          content_score?: number | null
          created_at?: string
          cta_button_text?: string | null
          currency?: string | null
          custom_code?: string | null
          custom_permalink?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          discounted_price?: number | null
          faq_data?: Json | null
          file_attachments?: Json | null
          focus_keyword?: string | null
          howto_data?: Json | null
          id?: string
          image_url?: string | null
          is_deleted?: boolean | null
          is_editors_choice?: boolean | null
          is_embedded_tool?: boolean | null
          is_featured?: boolean | null
          is_free?: boolean | null
          is_newly_launched?: boolean | null
          is_popular?: boolean | null
          is_trending?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image_url?: string | null
          original_price?: number | null
          payment_link?: string | null
          product_tags?: string[] | null
          product_type?: string | null
          purchase_price?: number | null
          razorpay_plan_id?: string | null
          related_keywords?: string[] | null
          revenue_type?: Database["public"]["Enums"]["revenue_type"] | null
          rich_description?: string | null
          saves_count?: number | null
          schema_markup?: Json | null
          seo_title?: string | null
          slug: string
          social_description?: string | null
          social_title?: string | null
          structured_data_type?: string | null
          sub_category_id?: string | null
          tool_config?: Json | null
          tool_type?: string | null
          tool_url?: string | null
          twitter_image_url?: string | null
          updated_at?: string
          video_courses?: Json | null
          views_count?: number | null
        }
        Update: {
          adsense_config?: Json | null
          affiliate_link?: string | null
          alt_text?: string | null
          canonical_url?: string | null
          category_id?: string | null
          collect_email?: boolean | null
          content_score?: number | null
          created_at?: string
          cta_button_text?: string | null
          currency?: string | null
          custom_code?: string | null
          custom_permalink?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          discounted_price?: number | null
          faq_data?: Json | null
          file_attachments?: Json | null
          focus_keyword?: string | null
          howto_data?: Json | null
          id?: string
          image_url?: string | null
          is_deleted?: boolean | null
          is_editors_choice?: boolean | null
          is_embedded_tool?: boolean | null
          is_featured?: boolean | null
          is_free?: boolean | null
          is_newly_launched?: boolean | null
          is_popular?: boolean | null
          is_trending?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image_url?: string | null
          original_price?: number | null
          payment_link?: string | null
          product_tags?: string[] | null
          product_type?: string | null
          purchase_price?: number | null
          razorpay_plan_id?: string | null
          related_keywords?: string[] | null
          revenue_type?: Database["public"]["Enums"]["revenue_type"] | null
          rich_description?: string | null
          saves_count?: number | null
          schema_markup?: Json | null
          seo_title?: string | null
          slug?: string
          social_description?: string | null
          social_title?: string | null
          structured_data_type?: string | null
          sub_category_id?: string | null
          tool_config?: Json | null
          tool_type?: string | null
          tool_url?: string | null
          twitter_image_url?: string | null
          updated_at?: string
          video_courses?: Json | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_collaborations: {
        Row: {
          collaborator_id: string
          created_at: string
          id: string
          permission_level: string
          resume_id: string
        }
        Insert: {
          collaborator_id: string
          created_at?: string
          id?: string
          permission_level?: string
          resume_id: string
        }
        Update: {
          collaborator_id?: string
          created_at?: string
          id?: string
          permission_level?: string
          resume_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_collaborations_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "user_resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_premium: boolean
          name: string
          preview_image_url: string | null
          template_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_premium?: boolean
          name: string
          preview_image_url?: string | null
          template_data?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_premium?: boolean
          name?: string
          preview_image_url?: string | null
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_category_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_insights: {
        Row: {
          action_required: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          insight_type: string
          is_dismissed: boolean | null
          is_read: boolean | null
          priority: string | null
          related_tool_data: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          action_required?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: string | null
          related_tool_data?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          action_required?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: string | null
          related_tool_data?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tool_payment_configs: {
        Row: {
          collect_company: boolean | null
          collect_email: boolean | null
          collect_phone: boolean | null
          created_at: string
          currency: string | null
          custom_fields: Json | null
          id: string
          is_active: boolean | null
          is_payment_enabled: boolean | null
          payment_page_url: string | null
          payment_type: string | null
          price: number | null
          product_id: string
          razorpay_plan_id: string | null
          refund_policy_url: string | null
          setup_fee: number | null
          stripe_price_id: string | null
          terms_url: string | null
          trial_period_days: number | null
          updated_at: string
        }
        Insert: {
          collect_company?: boolean | null
          collect_email?: boolean | null
          collect_phone?: boolean | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          id?: string
          is_active?: boolean | null
          is_payment_enabled?: boolean | null
          payment_page_url?: string | null
          payment_type?: string | null
          price?: number | null
          product_id: string
          razorpay_plan_id?: string | null
          refund_policy_url?: string | null
          setup_fee?: number | null
          stripe_price_id?: string | null
          terms_url?: string | null
          trial_period_days?: number | null
          updated_at?: string
        }
        Update: {
          collect_company?: boolean | null
          collect_email?: boolean | null
          collect_phone?: boolean | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          id?: string
          is_active?: boolean | null
          is_payment_enabled?: boolean | null
          payment_page_url?: string | null
          payment_type?: string | null
          price?: number | null
          product_id?: string
          razorpay_plan_id?: string | null
          refund_policy_url?: string | null
          setup_fee?: number | null
          stripe_price_id?: string | null
          terms_url?: string | null
          trial_period_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_payment_configs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_purchases: {
        Row: {
          amount_paid: number | null
          created_at: string
          currency: string | null
          custom_data: Json | null
          customer_company: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          next_billing_date: string | null
          payment_date: string | null
          payment_gateway: string | null
          payment_status: string | null
          payment_type: string | null
          product_id: string
          subscription_id: string | null
          subscription_status: string | null
          transaction_id: string | null
          trial_end_date: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          custom_data?: Json | null
          customer_company?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          next_billing_date?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_status?: string | null
          payment_type?: string | null
          product_id: string
          subscription_id?: string | null
          subscription_status?: string | null
          transaction_id?: string | null
          trial_end_date?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          custom_data?: Json | null
          customer_company?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          next_billing_date?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_status?: string | null
          payment_type?: string | null
          product_id?: string
          subscription_id?: string | null
          subscription_status?: string | null
          transaction_id?: string | null
          trial_end_date?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_resumes: {
        Row: {
          created_at: string
          id: string
          is_public: boolean
          sections: Json
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean
          sections?: Json
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean
          sections?: Json
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_resumes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "resume_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_saved_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      product_stats: {
        Row: {
          count: number | null
          product_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_category_orders: {
        Args: { category_updates: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      revenue_type: "affiliate" | "payment" | "free" | "paid"
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
    Enums: {
      app_role: ["admin", "user"],
      revenue_type: ["affiliate", "payment", "free", "paid"],
    },
  },
} as const
