type PublicSupabaseConfig = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

function requirePublicEnvironmentVariable(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and provide the Supabase public configuration.`,
    );
  }

  return value;
}

/**
 * The legacy ANON_KEY fallback keeps existing local installations working while
 * the project moves to Supabase's current publishable-key naming.
 */
export function getPublicSupabaseConfig(): PublicSupabaseConfig {
  return {
    supabaseUrl: requirePublicEnvironmentVariable(
      'NEXT_PUBLIC_SUPABASE_URL',
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    supabasePublishableKey: requirePublicEnvironmentVariable(
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}
