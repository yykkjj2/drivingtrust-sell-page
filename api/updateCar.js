import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,   // 用 anon 即可，因为 RLS 负责权限验证
    {
      global: {
        headers: {
          "edit-token": req.headers['edit-token'] || ""
        }
      }
    }
  );

  const { id, data } = req.body;

  const { error } = await supabase
    .from("cars")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
}
