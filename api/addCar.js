// api/addCar.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    name,
    phone,
    city,
    car,
    mileage,
    accident,
    inspection,
    price,
    notes,
    images,
  } = req.body;

  const { data, error } = await supabase
    .from("cars")
    .insert([
      {
        name,
        phone,
        city,
        car,
        mileage: mileage ? parseInt(mileage, 10) : null,
        accident,
        inspection,
        price,
        notes,
        status: "pending", // 默认挂上就是待审核
        images: images || null, // text[] 列
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error inserting car:", error);
    return res.status(400).json({ error });
  }

  return res.status(200).json({ success: true, car: data });
}
