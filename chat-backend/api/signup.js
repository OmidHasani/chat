import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'فقط متد POST مجاز است' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'ایمیل و رمز عبور لازم است' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'ثبت‌نام موفق! لطفا ایمیل را تایید کنید.', user: data.user });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'خطای سرور' });
  }
}
