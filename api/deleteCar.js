import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY   // 用 service_key
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.body;

  const { error } = await supabase
    .from("cars")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true });
}
