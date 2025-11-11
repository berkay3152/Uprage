const axios = require('axios');

const SUPABASE_URL = 'https://ftvfrivqwedvaptmxiqw.supabase.co/rest/v1/Gallery';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dmZyaXZxd2VkdmFwdG14aXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNzEzMzMsImV4cCI6MjA3Nzk0NzMzM30.k6e4_PJCB2RPYmuKYqgzdrxQF-shXftcrP4kLhLtt1s';

async function checkUpgrades() {
  const now = Math.floor(Date.now() / 1000);

  const { data } = await axios.get(SUPABASE_URL, {
    params: {
      upgradeendtimestamp: `lt.${now}`,
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
