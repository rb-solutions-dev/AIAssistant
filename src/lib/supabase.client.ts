"use client";

import { createClient } from "@supabase/supabase-js";
import { useOrganization, useSession } from "@clerk/nextjs";

const useSupabase = () => {
  const { session } = useSession();
  const { organization } = useOrganization();

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: "supabase",
          });

          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);
          headers.set("x-organization-id", organization?.id || "");

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );

  return client;
};

export default useSupabase;
