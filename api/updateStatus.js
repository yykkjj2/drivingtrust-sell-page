// api/updateStatus.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id, status } = req.body;

  const { error } = await supabase
    .from("cars")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating status:", error);
    return res.status(400).json({ error });
  }

  return res.status(200).json({ message: "Status updated" });
}
