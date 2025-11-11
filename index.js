const axios = require('axios');

const SUPABASE_URL = 'https://ftvfrivqwedvaptmxiqw.supabase.co/rest/v1/Gallery';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Güvenlik için kısaltıldı

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
      // Sadece upgradeEndTimestamp > 0 olanları güncelle
      if (car.upgradeEndTimestamp > 0) {
        const updated = {
          level: car.level + 1,
          upgradeEndTimestamp: 0 // tekrar seviye almasını engelle
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
  } catch (err) {
    console.error("❌ Supabase isteği başarısız:", err.message);
  }
}

// İlk çalıştırma
checkUpgrades();

// Her 5 dakikada bir tekrar çalıştır
setInterval(checkUpgrades, 5 * 60 * 1000);

// Render'ın uygulamayı açık tutması için sahte port aç
require('http').createServer(() => {}).listen(3000);
