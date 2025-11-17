// api/getCars.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error);
    return res.status(400).json({ error });
  }

  return res.status(200).json(data);
}
