import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getAdminKey() {
  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");

  if (secretKeys) {
    try {
      const parsed = JSON.parse(secretKeys) as Record<string, string>;
      if (parsed.default) return parsed.default;
    } catch {
      // Fall back to the hosted legacy secret below.
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
}

Deno.serve(async (request: Request) => {
  // OPTIONS is accepted only for browser CORS preflight. The endpoint itself is POST-only.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  const authorization = request.headers.get("Authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const adminKey = getAdminKey();

  if (!accessToken) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  if (!supabaseUrl || !adminKey) {
    console.error("delete-account is missing required Supabase secrets");
    return jsonResponse({ error: "server_configuration_error" }, 500);
  }

  const admin = createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await admin.auth.getUser(accessToken);

  if (userError || !user) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const userId = user.id;

  try {
    // watering_history rows are removed by the verified
    // watering_history.plant_id -> plants.id ON DELETE CASCADE constraint.
    const { error: plantsError } = await admin
      .from("plants")
      .delete()
      .eq("user_id", userId);
    if (plantsError) throw plantsError;

    const { error: locationsError } = await admin
      .from("plant_locations")
      .delete()
      .eq("user_id", userId);
    if (locationsError) throw locationsError;

    const { error: profileError } = await admin
      .from("profiles")
      .delete()
      .eq("user_id", userId);
    if (profileError) throw profileError;

    const { error: authError } = await admin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    return jsonResponse({ deleted: true }, 200);
  } catch (error) {
    console.error("delete-account failed", {
      userId,
      message: error instanceof Error ? error.message : String(error),
    });
    return jsonResponse({ error: "account_deletion_failed" }, 500);
  }
});
