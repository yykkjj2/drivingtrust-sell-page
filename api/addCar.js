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
    const { name, phone, city, car, mileage, accident, inspection, price, notes } = req.body;

    const { data, error } = await supabase
      .from("cars")
      .insert([{ name, phone, city, car, mileage, accident, inspection, price, notes }])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ message: "Success", data });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server Error" });
  }
}
