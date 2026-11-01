export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, items, total } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_ID = process.env.ADMIN_ID;

  const itemsList = items.map(i => `• ${i.title} (${i.platform}) x${i.qty} — ${i.price * i.qty} ₽`).join('\n');
  const text = `🔥 *Новый заказ в магазине!*\n👤 Покупатель: ${user}\n\n${itemsList}\n\n💰 *Итого: ${total} ₽*`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!tgRes.ok) throw new Error('Telegram API error');
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
