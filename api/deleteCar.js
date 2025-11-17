// /api/deleteCar.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 用 service_role key（你环境变量已经配置好了）
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing car ID" });
    }

    // 确保按数字 id 查（如果是字符串也强制转一次）
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return res.status(400).json({ error: "Invalid car ID" });
    }

    // 这里用 select() 把删掉的行返回，方便确认有没有实际删除
    const { data, error } = await supabase
      .from("cars")
      .delete()
      .eq("id", numericId)
      .select(); // 返回被删的记录

    if (error) {
      console.error("Supabase delete error:", error);
      return res.status(500).json({ error: error.message || "Supabase delete error" });
    }

    if (!data || data.length === 0) {
      // 说明数据库里压根没有对应 id
      return res.status(404).json({ error: `Car not found for id=${numericId}` });
    }

    // 真正删除成功
    return res.status(200).json({ success: true, deletedId: numericId });
  } catch (err) {
    console.error("deleteCar handler error:", err);
    return res.status(500).json({ error: "Unexpected server error in deleteCar" });
  }
}
