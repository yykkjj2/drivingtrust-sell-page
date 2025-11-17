import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { base64, carId } = req.body;
    if (!base64 || !carId) {
      return res.status(400).json({ error: "Missing base64 or carId" });
    }

    // Convert base64 to buffer
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `car_${carId}_${Date.now()}.jpg`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(fileName, buffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("car-images")
      .getPublicUrl(fileName);

    // Save URL into database
    await supabase
      .from("cars")
      .update({
        images: supabase.rpc("append_image", {
          image_url: urlData.publicUrl,
          car_row_id: carId,
        }),
      })
      .eq("id", carId);

    res.status(200).json({ url: urlData.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
