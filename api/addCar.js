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

  try {
    const body = req.body || {};
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
    } = body;

    // 写入 cars 表
    const { data, error } = await supabase
      .from("cars")
      .insert([
        {
          name,
          phone,
          city,
          car,
          mileage: mileage ?? null,
          accident,
          inspection,
          price,
          notes,
          status: "pending",      // 默认 pending，方便后台审核
          images: images || [],   // 这里对应 Supabase 里的 text[] 列
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("addCar supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    console.error("addCar handler error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
