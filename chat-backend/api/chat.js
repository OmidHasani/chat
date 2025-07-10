export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "فقط POST مجاز است" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "پیام ارسال نشده است" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      return res.status(response.status).json({ error: errorDetails });
    }

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "پاسخی دریافت نشد";

    res.status(200).json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ error: error.message || "خطای سرور" });
  }
}
