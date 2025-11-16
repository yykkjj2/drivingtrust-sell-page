import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { name, phone, city, car, mileage, accident, inspection, price, notes } = req.body;

  const { data, error } = await supabase
    .from("cars")
    .insert([ { name, phone, city, car, mileage, accident, inspection, price, notes } ]);

  if (error) {
    return res.status(400).json({ error });
  }

  res.json({ message: "Car submitted successfully!", data });
}
