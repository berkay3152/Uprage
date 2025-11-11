const axios = require('axios');

const SUPABASE_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_API_KEY;

async function checkUpgrades() {
  const now = Math.floor(Date.now() / 1000);

  const { data } = await axios.get(SUPABASE_URL, {
    params: {
      upgrade_end_timestamp: `lt.${now}`,
      level: `not.is.null`
    },
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`
    }
  });

  for (const car of data) {
    const updated = {
      level: car.level + 1,
      upgrade_end_timestamp: 0
    };

    await axios.patch(`${SUPABASE_URL}?id=eq.${car.id}`, updated, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Güncellendi: ${car.display_name} → Level ${updated.level}`);
  }
}

checkUpgrades();
