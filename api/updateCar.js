// api/updateCar.js
import { createClient } from "@supabase/supabase-js";

// 用 anon key + RLS 控制权限
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        // ⬅️ 把前端传来的 edit-token，转发给 Supabase
        "edit-token": ""
      }
    }
  }
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const editToken = req.headers["edit-token"] || req.headers["edit_token"] || "";
  const { id, data } = req.body; // data 里是要更新的字段对象

  // 把 token 塞进 supabase 客户端 headers
  supabase.options.global.headers["edit-token"] = editToken;

  const { error } = await supabase
    .from("cars")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
