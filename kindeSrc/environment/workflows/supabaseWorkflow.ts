import {
  onUserTokenGeneratedEvent,
  accessTokenCustomClaims,
  WorkflowSettings,
  WorkflowTrigger,
  fetch,
  getEnvironmentVariable,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "addAccessTokenClaim",
  name: "Add access token claim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.accessToken": {},
    "kinde.localization": {},
    "kinde.fetch": {},
    "kinde.env": {},
    url: {},
  },
};

export default async function SupabaseWorkflow(
  event: onUserTokenGeneratedEvent
) {
  const SUPABASE_ANON_KEY = getEnvironmentVariable("SUPABASE_ANON_KEY")?.value;
  const SUPABASE_URL = getEnvironmentVariable("SUPABASE_URL")?.value;

  const accessToken = accessTokenCustomClaims<{
    lifetime_subscriber: boolean;
  }>();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?kinde_id=eq.${event.context.user.id}`,
    {
      method: "GET",
      headers: {
        apiKey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.length > 0) {
    const profile = response.data[0];
    accessToken.lifetime_subscriber = profile?.lifetime_subscriber;
  }
}
