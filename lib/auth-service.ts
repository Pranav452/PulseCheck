// Mock authentication service
import type { User } from "./types"
import { supabase } from "./supabase"

// Mock user data
const MOCK_USER: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
}

// Mock storage key
const AUTH_STORAGE_KEY = "pulsecheck_auth"

// Define type for user data from database
interface DbUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  created_at?: string;
}

export const authService = {
  // Sign up a new user
  async signup(data: { name: string; email: string; password: string }): Promise<User> {
    console.log("AuthService: Signup attempt", data.email);
    
    try {
      // First check if the user already exists in Supabase Auth
      const { data: existingUserData, error: existingUserError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (!existingUserError && existingUserData?.user) {
        console.log("AuthService: User already exists, signing in instead", existingUserData.user.id);
        // User exists and password is correct, just sign them in
        
        // Get or create profile
        try {
          // Check if profile exists
          const { data: profileData, error: profileError } = await supabase
            .from("users")
            .select()
            .eq("id", existingUserData.user.id)
            .maybeSingle();
            
          if (profileError && profileError.code !== "PGRST116") {
            console.error("AuthService: Error checking existing profile", {
              code: profileError.code,
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint
            });
            throw profileError;
          }
          
          if (profileData) {
            console.log("AuthService: Existing profile found", profileData);
            return {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              avatarUrl: profileData.avatar_url || undefined,
            };
          }
          
          // Create profile if it doesn't exist
          console.log("AuthService: Creating profile for existing auth user");
          const { data: newProfile, error: createError } = await supabase
            .from("users")
            .insert({
              id: existingUserData.user.id,
              email: data.email,
              name: data.name,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();
            
          if (createError) {
            console.error("AuthService: Failed to create profile for existing user", {
              code: createError.code,
              message: createError.message,
              details: createError.details,
              hint: createError.hint
            });
            throw createError;
          }
          
          return {
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            avatarUrl: newProfile.avatar_url || undefined,
          };
        } catch (profileError) {
          console.error("AuthService: Error handling profile for existing user", profileError);
          throw profileError;
        }
      }
      
      // Existing user check failed (either doesn't exist or wrong password)
      if (existingUserError && existingUserError.message !== "Invalid login credentials") {
        // It's an error other than wrong credentials, log it but continue with signup
        console.log("AuthService: Error checking existing user", {
          code: existingUserError.code,
          message: existingUserError.message,
          status: existingUserError.status
        });
      }
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        // If error is "User already registered", try to sign in
        if (authError.message === "User already registered") {
          console.log("AuthService: User already registered, please login instead");
          throw new Error("This email is already registered. Please login instead.");
        }
        
        console.error("AuthService: Signup auth error", {
          code: authError.code,
          message: authError.message,
          status: authError.status
        });
        throw authError;
      }
      
      if (!authData.user) {
        console.error("AuthService: No user returned from signup");
        throw new Error("Failed to create user");
      }
      
      console.log("AuthService: Auth signup successful", authData.user.id);

      // Create user profile in the users table
      console.log("AuthService: Creating user profile");
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            created_at: new Date().toISOString(),
          })
          .select("*");

        if (userError) {
          console.error("AuthService: Error creating user profile", {
            code: userError.code,
            message: userError.message,
            details: userError.details,
            hint: userError.hint
          });
          // If the insert failed because the profile already exists (e.g., duplicate key),
          // try to fetch the existing profile
          const { data: existingProfile, error: fetchError } = await supabase
            .from("users")
            .select()
            .eq("id", authData.user.id)
            .single();
            
          if (fetchError) {
            console.error("AuthService: Could not fetch existing profile", {
              code: fetchError.code,
              message: fetchError.message,
              details: fetchError.details
            });
            throw userError;
          }
          
          console.log("AuthService: Using existing profile", existingProfile);
          return {
            id: existingProfile.id,
            name: existingProfile.name,
            email: existingProfile.email,
            avatarUrl: existingProfile.avatar_url || undefined,
          };
        }

        console.log("AuthService: User profile created", userData);
        if (Array.isArray(userData) && userData.length > 0) {
          const firstUser = userData[0] as DbUser;
          return {
            id: firstUser.id,
            name: firstUser.name,
            email: firstUser.email,
            avatarUrl: firstUser.avatar_url || undefined,
          };
        } else if (userData) {
          const user = userData as unknown as DbUser;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar_url || undefined,
          };
        }
      } catch (insertError) {
        console.error("AuthService: Exception during user profile creation", insertError);
        throw new Error("Failed to create user profile after successful signup: " + 
          (insertError instanceof Error ? insertError.message : String(insertError)));
      }
      
      throw new Error("Unknown error creating user profile");
    } catch (error) {
      console.error("AuthService: Signup error", error);
      throw error;
    }
  },

  // Log in a user
  async login(data: { email: string; password: string }): Promise<User> {
    console.log("AuthService: Login attempt", data.email);
    
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      console.error("AuthService: Login auth error", {
        code: authError.code,
        message: authError.message,
        status: authError.status
      });
      throw authError;
    }
    
    if (!authData.user) {
      console.error("AuthService: No user returned from login");
      throw new Error("Failed to login");
    }
    
    console.log("AuthService: Auth login successful", authData.user.id);

    try {
      // Get user profile from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) {
        console.error("AuthService: Error fetching user profile", {
          code: userError.code,
          message: userError.message,
          details: userError.details,
          hint: userError.hint
        });
        
        // If the user doesn't exist in our users table but has a valid auth account,
        // let's create the user record automatically
        if (userError.code === 'PGRST116') {
          console.log("AuthService: User record not found, creating one");
          
          try {
            const { data: newUserData, error: createError } = await supabase
              .from("users")
              .insert({
                id: authData.user.id,
                email: authData.user.email || data.email,
                name: authData.user.user_metadata?.name || data.email.split('@')[0],
                created_at: new Date().toISOString(),
              })
              .select("*")
              .single();
              
            if (createError) {
              console.error("AuthService: Error creating missing user profile", {
                code: createError.code,
                message: createError.message,
                details: createError.details,
                hint: createError.hint
              });
              throw createError;
            }
            
            console.log("AuthService: Created missing user profile", newUserData);
            return {
              id: newUserData.id,
              name: newUserData.name,
              email: newUserData.email,
              avatarUrl: newUserData.avatar_url || undefined,
            };
          } catch (insertError) {
            console.error("AuthService: Exception during user creation", insertError);
            throw new Error("Failed to create user profile after successful login: " + 
              (insertError instanceof Error ? insertError.message : String(insertError)));
          }
        }
        
        throw userError;
      }

      console.log("AuthService: User profile retrieved", userData);
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatar_url || undefined,
      };
    } catch (error) {
      console.error("AuthService: Error in login process", error);
      throw error;
    }
  },

  // Log out the current user
  async logout(): Promise<void> {
    console.log("AuthService: Logout attempt");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("AuthService: Logout error", error);
      throw error;
    }
    console.log("AuthService: Logout successful");
  },

  // Get the current user
  async getCurrentUser(): Promise<User | null> {
    console.log("AuthService: Getting current user");
    
    try {
      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("AuthService: Session error", sessionError);
        throw sessionError;
      }
      
      if (!sessionData.session) {
        console.log("AuthService: No session found");
        return null;
      }
      
      console.log("AuthService: Session found", sessionData.session.user.id);

      // Get user profile from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      if (userError) {
        console.error("AuthService: Error fetching user profile", {
          code: userError.code,
          message: userError.message,
          details: userError.details,
          hint: userError.hint
        });
        
        // If the user doesn't exist in our users table but has a valid auth account,
        // let's create the user record automatically
        if (userError.code === 'PGRST116') {
          console.log("AuthService: User record not found, creating one");
          const authUser = sessionData.session.user;
          
          try {
            const { data: newUserData, error: createError } = await supabase
              .from("users")
              .insert({
                id: authUser.id,
                email: authUser.email || '',
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                created_at: new Date().toISOString(),
              })
              .select("*")
              .single();
              
            if (createError) {
              console.error("AuthService: Error creating missing user profile", {
                code: createError.code,
                message: createError.message,
                details: createError.details,
                hint: createError.hint
              });
              // Don't throw, return null instead to avoid blocking the auth flow
              return null;
            }
            
            console.log("AuthService: Created missing user profile", newUserData);
            return {
              id: newUserData.id,
              name: newUserData.name,
              email: newUserData.email,
              avatarUrl: newUserData.avatar_url || undefined,
            };
          } catch (insertError) {
            console.error("AuthService: Exception during user creation", insertError);
            return null;
          }
        }
        
        return null;
      }

      console.log("AuthService: User profile retrieved", userData);
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatar_url || undefined,
      };
    } catch (error) {
      console.error("AuthService: Unexpected error in getCurrentUser", error);
      return null;
    }
  },

  // Check if a user is authenticated
  async isAuthenticated(): Promise<boolean> {
    console.log("AuthService: Checking authentication");
    try {
      const user = await this.getCurrentUser();
      const result = !!user;
      console.log("AuthService: Authentication result", result);
      return result;
    } catch (error) {
      console.error("AuthService: Error checking authentication", error);
      return false;
    }
  },
}
