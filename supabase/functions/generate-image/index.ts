// supabase/functions/generate-image/index.ts

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  const { prompt, style } = await req.json();

  // Call your ClipDrop API here
  const result = await fetch("https://clipdrop-api.co/text-to-image/v1", {
    method: "POST",
    headers: {
      "x-api-key": "8b0c72727c796b8d5f863c9f5d6208bf33b9364f7a9763d5d74fdc83df5b1c32e2563f862d6cff763970af8d70106cf2",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      style,
    }),
  });

  if (!result.ok) {
    return new Response(JSON.stringify({ error: "API call failed" }), {
      status: 500,
    });
  }

  const blob = await result.blob();
  return new Response(blob, {
    headers: { "Content-Type": "image/png" },
  });
});
