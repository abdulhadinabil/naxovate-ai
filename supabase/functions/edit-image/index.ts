import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const style = formData.get("style") as string;
    const file = formData.get("image") as File;

    if (!prompt || !file) {
      return new Response(
        JSON.stringify({ error: "Prompt and image are required" }),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const clipdropResponse = await fetch("https://clipdrop-api.co/image-upscaling/v1", {
      method: "POST",
      headers: {
        "x-api-key": "your-clipdrop-api-key-here", // replace this
      },
      body: (() => {
        const form = new FormData();
        form.append("image_file", new Blob([buffer]), "image.png");
        form.append("prompt", prompt);
        form.append("style", style);
        return form;
      })(),
    });

    if (!clipdropResponse.ok) {
      return new Response(JSON.stringify({ error: "ClipDrop API call failed" }), {
        status: 500,
      });
    }

    const editedBlob = await clipdropResponse.blob();

    return new Response(editedBlob, {
      headers: { "Content-Type": "image/png" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: err.message }), {
      status: 500,
    });
  }
});
