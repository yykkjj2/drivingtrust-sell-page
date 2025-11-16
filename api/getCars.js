import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return res.status(400).json({ error });
  }

  res.json(data);
}
