import { supabase } from './supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'premium';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  subscription_expires_at?: string;
  total_votes: number;
  accuracy_score?: number;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
}

class AuthService {
  private listeners: ((state: AuthState) => void)[] = [];
  private currentState: AuthState = {
    user: null,
    profile: null,
    session: null,
    loading: true
  };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        this.updateState({ loading: false });
        return;
      }

      if (session?.user) {
        const profile = await this.fetchUserProfile(session.user.id);
        this.updateState({
          user: session.user,
          profile,
          session,
          loading: false
        });
      } else {
        this.updateState({ loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await this.fetchUserProfile(session.user.id);
          this.updateState({
            user: session.user,
            profile,
            session,
            loading: false
          });
        } else if (event === 'SIGNED_OUT') {
          this.updateState({
            user: null,
            profile: null,
            session: null,
            loading: false
          });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.updateState({ loading: false });
    }
  }

  private updateState(updates: Partial<AuthState>) {
    this.currentState = { ...this.currentState, ...updates };
    this.listeners.forEach(listener => listener(this.currentState));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.currentState);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState() {
    return this.currentState;
  }

  async signUp(email: string, password: string, username?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user.id, {
          email,
          username: username || email.split('@')[0]
        });
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  private async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  private async createUserProfile(userId: string, userData: { email: string; username?: string }) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: userData.email,
          username: userData.username,
          subscription_tier: 'free',
          subscription_status: 'active',
          total_votes: 0
        });

      if (error) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  async updateProfile(updates: Partial<UserProfile>) {
    if (!this.currentState.user) {
      throw new Error('No authenticated user');
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', this.currentState.user.id)
        .select()
        .single();

      if (error) throw error;

      this.updateState({
        profile: data
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async upgradeSubscription(tier: 'pro' | 'premium') {
    if (!this.currentState.user) {
      throw new Error('No authenticated user');
    }

    try {
      // In a real app, this would integrate with Stripe or another payment processor
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          subscription_tier: tier,
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString()
        })
        .eq('id', this.currentState.user.id)
        .select()
        .single();

      if (error) throw error;

      this.updateState({
        profile: data
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  async cancelSubscription() {
    if (!this.currentState.user) {
      throw new Error('No authenticated user');
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'cancelled'
        })
        .eq('id', this.currentState.user.id)
        .select()
        .single();

      if (error) throw error;

      this.updateState({
        profile: data
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  hasFeatureAccess(feature: string): boolean {
    const profile = this.currentState.profile;
    if (!profile) return false;

    const tier = profile.subscription_tier;
    const status = profile.subscription_status;

    if (status !== 'active') return false;

    switch (feature) {
      case 'unlimited_votes':
        return tier === 'pro' || tier === 'premium';
      case 'advanced_analytics':
        return tier === 'premium';
      case 'export_data':
        return tier === 'pro' || tier === 'premium';
      case 'priority_support':
        return tier === 'premium';
      case 'custom_themes':
        return tier === 'pro' || tier === 'premium';
      default:
        return true; // Free features
    }
  }
}

export const authService = new AuthService();