// api/uploadImage.js
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
    const { fileName, fileBase64 } = req.body || {};

    if (!fileName || !fileBase64) {
      return res
        .status(400)
        .json({ error: "Missing fileName or fileBase64 in body" });
    }

    // 把 base64 转成二进制
    const buffer = Buffer.from(fileBase64, "base64");

    const ext = fileName.split(".").pop() || "jpg";
    const path = `cars/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    // 上传到你创建的 bucket，比如 car-images
    const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(path, buffer, {
        contentType: `image/${ext}`,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return res.status(500).json({ error: uploadError.message });
    }

    // 获取公开 URL（supabase-js v2 写法）
    const { data: publicData } = supabase.storage
      .from("car-images")
      .getPublicUrl(path);

    const publicUrl = publicData.publicUrl;

    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    console.error("uploadImage handler error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
