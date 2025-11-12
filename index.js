const axios = require('axios');

const SUPABASE_URL = 'https://ftvfrivqwedvaptmxiqw.supabase.co/rest/v1/Gallery';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dmZyaXZxd2VkdmFwdG14aXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNzEzMzMsImV4cCI6MjA3Nzk0NzMzM30.k6e4_PJCB2RPYmuKYqgzdrxQF-shXftcrP4kLhLtt1s'; // kısaltıldı

async function checkUpgrades() {
  const now = Math.floor(Date.now() / 1000);

  try {
    const { data } = await axios.get(SUPABASE_URL, {
      params: {
        upgradeEndTimestamp: `lt.${now}`,
        level: `not.is.null`
      },
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      }
    });

    for (const car of data) {
      if (car.upgradeEndTimestamp > 0) {
        const updated = {
          level: car.level + 1,
          upgradeEndTimestamp: 0,
          motor_gucu: car.motor_gucu + 30,       // ✅ motor gücü artışı
          maksimum_hiz: car.maksimum_hiz + 5     // ✅ hız artışı (isteğe bağlı)
        };

        await axios.patch(`${SUPABASE_URL}?id=eq.${car.id}`, updated, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ Güncellendi: ${car.display_name} → Level ${updated.level}, Motor Gücü ${updated.motor_gucu}`);
      }
    }
  } catch (err) {
    console.error("❌ Supabase isteği başarısız:", err.message);
  }
}

// İlk çalıştırma
checkUpgrades();

// Her 10 saniyede bir tekrar çalıştır
setInterval(checkUpgrades, 10 * 1000);

// Bot sunucusu
require('http').createServer((req, res) => {
  res.end("Bot aktif");
}).listen(process.env.PORT || 3000);
