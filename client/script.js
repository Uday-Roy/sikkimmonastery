// ═════════════════════ COOKIE CONSENT SYSTEM ═════════════════════
const COOKIE_CONSENT_VERSION = "1.0";
const COOKIE_CONSENT_KEY = "m360_cookie_consent";

// Initialize cookie consent
function initCookieConsent() {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!consent) {
    showCookieConsentBanner();
  }
}

function ensureCookieConsentVisible() {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  const banner = document.getElementById("cookie-consent-banner");
  if (!consent && !banner) showCookieConsentBanner();
}

// Show cookie consent banner
function showCookieConsentBanner() {
  const banner = document.createElement("div");
  banner.id = "cookie-consent-banner";
  banner.className = "cookie-banner";
  banner.innerHTML = `
    <div class="cookie-content">
      <div class="cookie-text">
        <h4>🍪 Cookie Preferences</h4>
        <p>We use cookies to enhance your experience, analyze usage, and enable marketing features. Your data is saved securely in our database.</p>
      </div>
      <div class="cookie-buttons">
        <button onclick="acceptAllCookies()" class="cookie-btn accept">Accept All</button>
        <button onclick="showCookieSettings()" class="cookie-btn settings">Customize</button>
        <button onclick="rejectNonEssentialCookies()" class="cookie-btn reject">Reject</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
}

// Show cookie settings modal
function showCookieSettings() {
  const modal = document.createElement("div");
  modal.id = "cookie-settings-modal";
  modal.className = "modal open";
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h2>Cookie Settings</h2>
        <button onclick="document.getElementById('cookie-settings-modal').remove()" class="close-btn">✕</button>
      </div>
      <div class="modal-body">
        <div class="cookie-option">
          <div class="cookie-checkbox">
            <input type="checkbox" id="essential-cookie" checked disabled />
            <label for="essential-cookie">
              <strong>Essential Cookies</strong>
              <small>Required for site functionality</small>
            </label>
          </div>
        </div>
        <div class="cookie-option">
          <div class="cookie-checkbox">
            <input type="checkbox" id="analytics-cookie" />
            <label for="analytics-cookie">
              <strong>Analytics Cookies</strong>
              <small>Help us understand user behavior</small>
            </label>
          </div>
        </div>
        <div class="cookie-option">
          <div class="cookie-checkbox">
            <input type="checkbox" id="marketing-cookie" />
            <label for="marketing-cookie">
              <strong>Marketing Cookies</strong>
              <small>Enable personalized ads and promotions</small>
            </label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="saveCookiePreferences()" class="btn primary">Save Preferences</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// Accept all cookies
function acceptAllCookies() {
  const consent = {
    version: COOKIE_CONSENT_VERSION,
    analytics: true,
    marketing: true,
    essential: true,
    acceptedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  saveCookieConsentToDatabase(consent);
  document.getElementById("cookie-consent-banner")?.remove();
  showT("✓ Cookies accepted! Your data is saved.", "success");
}

// Reject non-essential cookies
function rejectNonEssentialCookies() {
  const consent = {
    version: COOKIE_CONSENT_VERSION,
    analytics: false,
    marketing: false,
    essential: true,
    acceptedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  saveCookieConsentToDatabase(consent);
  document.getElementById("cookie-consent-banner")?.remove();
  showT("✓ Only essential cookies enabled.", "success");
}

// Save custom preferences
function saveCookiePreferences() {
  const consent = {
    version: COOKIE_CONSENT_VERSION,
    essential: true,
    analytics: document.getElementById("analytics-cookie")?.checked || false,
    marketing: document.getElementById("marketing-cookie")?.checked || false,
    acceptedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  saveCookieConsentToDatabase(consent);
  document.getElementById("cookie-settings-modal")?.remove();
  document.getElementById("cookie-consent-banner")?.remove();
  showT("✓ Cookie preferences saved!", "success");
}

// Save consent to database
async function saveCookieConsentToDatabase(consent) {
  const token =
    localStorage.getItem("token") || localStorage.getItem("m360_token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/auth/save-consent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(consent),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      localStorage.setItem(
        "m360_sess",
        JSON.stringify({
          ...getU(),
          ...data.user,
        }),
      );
    }
  } catch (err) {
    console.error("Failed to save consent:", err);
  }
}

function syncStoredCookieConsent() {
  const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!saved) return;
  try {
    saveCookieConsentToDatabase(JSON.parse(saved));
  } catch (err) {
    console.error("Invalid saved cookie consent:", err);
  }
}

// ═══════════════════════════════════════════════════════════════════

// async function payNow() {
//   const res = await fetch("http://https://sikkimmonastery.onrender.com/api/payment/create-order", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ amount: 500 }),
//   });

//   const order = await res.json();

//   const options = {
//     key: "YOUR_KEY_ID",
//     amount: order.amount,
//     currency: "INR",
//     name: "Monastery360",
//     description: "Travel Booking",
//     order_id: order.id,

//     handler: async function (response) {
//       const verifyRes = await fetch(
//         "http://https://sikkimmonastery.onrender.com/api/payment/verify",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(response),
//         },
//       );

//       const data = await verifyRes.json();

//       if (data.success) {
//         alert("Payment Successful 🎉");
//       } else {
//         alert("Payment Failed ❌");
//       }
//     },

//     theme: {
//       color: "#b38b59",
//     },
//   };

//   const rzp = new Razorpay(options);
//   rzp.open();
// }

const MD = [
  {
    id: 1,
    name: "Rumtek Monastery",
    region: "East",
    location: "Rumtek, East Sikkim",
    yearBuilt: 1966,
    builtBy: "16th Karmapa Rangjung Rigpe Dorje",
    altitude: "1500m",
    sect: "Karma Kagyu",
    significance: "Largest monastery in Sikkim; seat of the Karmapa lineage",
    history:
      "Rumtek Monastery is one of Sikkim's most important Buddhist centers, rebuilt in the 1960s as the international seat of the Karma Kagyu lineage. Its golden stupa, vast prayer hall, and mountain setting make it a central stop for pilgrims and travellers exploring Sikkim's living Buddhist heritage.",
    visitors:
      "Open daily 9 AM-5 PM. Entry fee may apply. Photography restrictions inside the main shrine.",
    entry: "Paid",
    timings: "9 AM - 5 PM",
    image: "./img/rumtek_monastery.jpg",
    lat: 27.289,
    lng: 88.561,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Pemayangtse Monastery",
    region: "West",
    location: "Pelling, West Sikkim",
    yearBuilt: 1705,
    builtBy: "Lhatsun Chempo",
    altitude: "2085m",
    sect: "Nyingma",
    significance: "One of the oldest and most revered monasteries in Sikkim",
    history:
      "Pemayangtse Monastery stands above Pelling with sweeping views of Kanchenjunga. Founded in the early eighteenth century, it remains a major Nyingma monastery known for its sacred statues, paintings, and the extraordinary wooden Zangdok Palri model.",
    visitors:
      "Open daily 9 AM-5 PM. Best visited early morning for mountain views.",
    entry: "Paid",
    timings: "9 AM - 5 PM",
    image: "./img/pemayangtse-monastery1.jpg",
    lat: 27.305,
    lng: 88.251,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Tsuklakhang Monastery",
    region: "East",
    location: "Gangtok, East Sikkim",
    yearBuilt: 1898,
    builtBy: "Sikkim Royal Family",
    altitude: "1650m",
    sect: "Nyingma",
    significance: "Royal chapel of the former Chogyal rulers of Sikkim",
    history:
      "Tsuklakhang Monastery served as the royal chapel within the palace complex in Gangtok. It hosted important ceremonies connected with the Chogyal dynasty and preserves a quiet, intimate atmosphere in the heart of the capital.",
    visitors:
      "Open on most days during daylight hours. Respect prayer schedules and local guidance.",
    entry: "Free",
    timings: "Daylight hours",
    image: "./img/3228827Gangtok_Tsuk_La_Khang_Main3.jpg",
    lat: 27.3314,
    lng: 88.6138,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Enchey Monastery",
    region: "East",
    location: "Gangtok, East Sikkim",
    yearBuilt: 1909,
    builtBy: "Lama Drupthob Karpo",
    altitude: "2080m",
    sect: "Nyingma",
    significance: "Historic Gangtok monastery known for Pang Lhabsol dances",
    history:
      "Enchey Monastery sits above Gangtok and is associated with the tantric master Lama Drupthob Karpo. Its peaceful hilltop setting, prayer flags, murals, and annual masked dances make it one of the capital's most loved sacred sites.",
    visitors: "Open daily 6 AM-4 PM. Keep silence inside prayer spaces.",
    entry: "Free",
    timings: "6 AM - 4 PM",
    image: "./img/enchy_monastery2.jpeg",
    lat: 27.3389,
    lng: 88.6165,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Tashiding Monastery",
    region: "West",
    location: "Tashiding, West Sikkim",
    yearBuilt: 1717,
    builtBy: "Ngadak Sempa Chempo",
    altitude: "1465m",
    sect: "Nyingma",
    significance: "Sacred hilltop monastery famous for Bumchu festival",
    history:
      "Tashiding Monastery rises on a hill between the Rathong and Rangeet rivers. Revered for its sacred chortens and the annual Bumchu festival, it is considered one of the holiest places in Sikkim.",
    visitors: "Open daily 7 AM-5 PM. Festival dates vary by Tibetan calendar.",
    entry: "Free",
    timings: "7 AM - 5 PM",
    image: "./img/Tashiding Monastery44.jpg",
    lat: 27.3098,
    lng: 88.2983,
    rating: 4.7,
  },
  {
    id: 6,
    name: "Ralang Monastery",
    region: "South",
    location: "Ravangla, South Sikkim",
    yearBuilt: 1995,
    builtBy: "12th Gyaltsab Rinpoche",
    altitude: "2100m",
    sect: "Karma Kagyu",
    significance: "Major Karma Kagyu monastery near Ravangla",
    history:
      "New Ralang Monastery is known for its grand prayer hall, colourful murals, and lively festivals. Its setting near Ravangla makes it a natural companion to Buddha Park and the southern monastery circuit.",
    visitors:
      "Open daily 8 AM-5 PM. Photography usually allowed in outdoor areas.",
    entry: "Free",
    timings: "8 AM - 5 PM",
    image: "./img/Ralang Monastery55.jpg",
    lat: 27.3055,
    lng: 88.3636,
    rating: 4.6,
  },
  {
    id: 7,
    name: "Do-drul Chorten",
    region: "East",
    location: "Gangtok, East Sikkim",
    yearBuilt: 1945,
    builtBy: "Trulshik Rinpoche",
    altitude: "1700m",
    sect: "Nyingma",
    significance: "Iconic stupa surrounded by prayer wheels",
    history:
      "Do-drul Chorten is one of Gangtok's most recognizable Buddhist landmarks. Built by Trulshik Rinpoche, the stupa is encircled by prayer wheels and remains a busy place of devotion for local residents and visitors.",
    visitors:
      "Open daily during daylight hours. Combine with Namgyal Institute of Tibetology nearby.",
    entry: "Free",
    timings: "Daylight hours",
    image: "./img/Do-drul Chorten6.webp",
    lat: 27.3239,
    lng: 88.6063,
    rating: 4.7,
  },

  {
    id: 8,
    name: "Lingdum Monastery",
    region: "East",
    location: "Ranka, East Sikkim",
    yearBuilt: 1998,
    builtBy: "Gyalshab Rinpoche",
    altitude: "1800m",
    sect: "Karma Kagyu",
    significance: "Stunning modern architecture; renowned for colourful murals",
    history:
      "Lingdum Monastery, formally Ranka Monastery or Zangdog Palri (Copper-Coloured Mountain), is a relatively new monastery built in 1998. Though modern, it embodies the highest standards of classical Tibetan Buddhist architecture, with soaring gold-topped towers, ornate carved portals, and masterfully painted murals depicting the entire Kagyu lineage. The main shrine hall contains a colossal gilded Buddha of magnificent proportions. The surrounding hillside is covered in forest, and the approach is lined with colourful prayer flags. Lingdum has rapidly become one of the most visited and photographed monasteries in Sikkim, offering a perfect blend of visual grandeur and genuine religious life — monks can be seen studying, chanting, and performing rituals throughout the day.",
    visitors:
      "Open daily 9 AM–5 PM. Free entry. Photography permitted. 20 min drive from Gangtok. Excellent photography location.",
    entry: "Free",
    timings: "9 AM – 5 PM",
    image: "./img/lingdum-monastery7.jpg",
    lat: 27.2893,
    lng: 88.5412,
    rating: 4.6,
  },
  {
    id: 9,
    name: "Sanga Choeling Monastery",
    region: "West",
    location: "Pelling, West Sikkim",
    yearBuilt: 1697,
    builtBy: "Lhatsun Chhenpo Namkha Jigme",
    altitude: "2200m",
    sect: "Nyingma",
    significance:
      "Among oldest monasteries in Sikkim; 300-year-old original murals",
    history:
      "Sanga Choeling — meaning 'Island of the Teaching of Secret Mantra' — is one of the oldest monasteries in Sikkim, established in 1697 by the great Lhatsun Chhenpo just eight years before Pemayangtse. It sits on a forested ridge above Pelling with commanding views of Mount Kanchenjunga and the surrounding peaks. The monastery contains the original hand-painted murals commissioned by its founder — three-century-old paintings of Buddhist deities and narrative scenes still radiant with colour. The trail to Sanga Choeling winds through ancient oak and rhododendron forest that feels primordial and sacred. During spring, rhododendrons frame the monastery entrance in bursts of red and pink against the snow backdrop. This combination of great age, original artwork, and natural beauty makes it one of the most rewarding sites in West Sikkim.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. 30-min forest trek from Pelling. Best visited early morning in spring.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/sangacholing_monastery.jpeg",
    lat: 27.3601,
    lng: 88.2101,
    rating: 4.7,
  },
  {
    id: 10,
    name: "Yuksom Dubdi Monastery",
    region: "West",
    location: "Yuksom, West Sikkim",
    yearBuilt: 1701,
    builtBy: "Three Revered Lamas",
    altitude: "1780m",
    sect: "Nyingma",
    significance:
      "First monastery built in Sikkim (1701); birthplace of Sikkimese monarchy",
    history:
      "Dubdi Monastery — meaning 'retreat cell' — holds the extraordinary distinction of being the first monastery ever built in Sikkim, established in 1701. It was founded by the three revered lamas — Lhatsun Chhenpo Namkha Jigme, Kathok Kuntu Zangpo, and Ngadak Sempa Chhenpo — who had also performed the coronation of the first Chogyal of Sikkim. The monastery perches atop a hill above the historic town of Yuksom, Sikkim's first capital (1642). The site radiates immense spiritual power — it was here that a divinely guided union of religion and kingship created an entire civilization. The monastery contains an ancient thangka of Guru Rimpoche and what are believed to be some of the original religious items brought by the three lamas. The 30-minute trek uphill through forest is itself a meditative pilgrimage.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. 30-min trek from Yuksom town square. Most historically significant site in Sikkim.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "./img/Yuksom Dubdi Monastery8.jpg",
    lat: 27.3784,
    lng: 88.2321,
    rating: 4.8,
  },
  {
    id: 11,
    name: "Phodong Monastery",
    region: "North",
    location: "Phodong, North Sikkim",
    yearBuilt: 1740,
    builtBy: "4th Chogyal Gyurmed Namgyal",
    altitude: "1390m",
    sect: "Karma Kagyu",
    significance:
      "One of six main monasteries of Sikkim; spectacular Chaam in November",
    history:
      "Phodong Monastery, established in 1740 during the reign of the fourth Chogyal Gyurmed Namgyal, is one of the six most important monasteries of Sikkim and the principal Karma Kagyu establishment in North Sikkim. It was recently restored with support from the Archaeological Survey of India. Phodong commands sweeping views of the Teesta Valley from its hilltop position on the Gangtok–Mangan highway. The monastery houses a remarkable collection of ancient thangka paintings, bronze statues, and ceremonial objects. Its most anticipated event is the annual Chaam masked dance performed in November on the 28th and 29th days of the ninth Tibetan month — a performance of extraordinary colour and ritual energy. A short walk above Phodong stands the ruins of the much older Labrang monastery.",
    visitors:
      "Open daily 9 AM–5 PM. Free entry. Annual Chaam: November. 38 km from Gangtok on NH-10.",
    entry: "Free",
    timings: "9 AM – 5 PM",
    image: "img/phodong_monastery.jpg",
    lat: 27.5276,
    lng: 88.5443,
    rating: 4.5,
  },
  {
    id: 12,
    name: "Phensang Monastery",
    region: "North",
    location: "Phensang, North Sikkim",
    yearBuilt: 1721,
    builtBy: "Ngadak Phuntsog Rigdzin",
    altitude: "1350m",
    sect: "Nyingma",
    significance:
      "Most important Nyingma monastery in North Sikkim; Kagyat masked dance",
    history:
      "Phensang Monastery — the most important of the Nyingma monasteries in North Sikkim — was established in 1721 by Ngadak Phuntsog Rigdzin, a great-grandson of the revered Lhatsun Chhenpo. The monastery hosts three major festivals each year, the most spectacular of which is the Kagyat dance in December — a sequence of eighteen different masked dances, each representing a deity of the Kagyu protective pantheon. The performance, accompanied by the crashing of cymbals and the deep resonance of dungchen horns, lasts two full days. The monastery has been repeatedly rebuilt and expanded over three centuries and today houses an impressive library of Tibetan canonical texts, intricate clay stupas, and richly carved wooden pillars. The surrounding countryside of rural North Sikkim adds greatly to its pastoral charm.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Kagyat festival: December. 78 km from Gangtok via Mangan.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/phasang_monastery.jpg",
    lat: 27.5374,
    lng: 88.5512,
    rating: 4.6,
  },
  {
    id: 13,
    name: "Khecheopalri Monastery",
    region: "West",
    location: "Khecheopalri Lake, West Sikkim",
    yearBuilt: 1700,
    builtBy: "Lhatsun Chhenpo",
    altitude: "1700m",
    sect: "Nyingma",
    significance:
      "Sacred wish-fulfilling lake; birds keep surface leaf-free; Hindu-Buddhist pilgrimage",
    history:
      "Khecheopalri Monastery stands beside the most sacred lake in Sikkim — Khecheopalri, the 'Wish Fulfilling Lake' — sacred to both Hindus and Buddhists. The monastery and lake were consecrated around 1700 by Lhatsun Chhenpo. According to deeply held local tradition, birds perch in the trees surrounding the lake and pick up any leaf that falls onto its surface, ensuring it remains perpetually clean — a miracle observed by every visitor. Tibetan Buddhists regard the lake as the abode of Tara, while Hindus worship a deity they identify with Parvati on its banks. The monastery overlooks the still, dark-green waters from a forested hillside. Pilgrims carry butter lamps to the lake shore at twilight during the Lhabsol festival. The surrounding forest is home to rare orchids, butterflies, and Himalayan birds including the fire-tailed sunbird.",
    visitors:
      "Open daily sunrise to sunset. Free entry. Sacred lake nearby — walking is mandatory (no vehicles to lakeside). Lhabsol festival: September–October.",
    entry: "Free",
    timings: "Sunrise – Sunset",
    image: "./img/Khecheopalri Monastery9.jpg",
    lat: 27.3826,
    lng: 88.2174,
    rating: 4.8,
  },
  {
    id: 14,
    name: "Lachen Gompa",
    region: "North",
    location: "Lachen, North Sikkim",
    yearBuilt: 1858,
    builtBy: "Lachen Gomchen",
    altitude: "2750m",
    sect: "Nyingma",
    significance:
      "Gateway to sacred Gurudongmar Lake; unique Dzumsa governance",
    history:
      "Lachen Gompa, situated in the high-altitude village of Lachen, was established in 1858 and belongs to the Nyingma tradition. The village of Lachen — located at 2750m at the confluence of mountain rivers — is the gateway to the sacred Gurudongmar Lake (5183m), one of the highest lakes in the world. The Lachen Gomchen (head monk) has historically served dual roles as both the spiritual and administrative leader of the village, maintaining a unique self-governance system. The gompa features classical Tibetan architecture with ornate woodwork, brilliant murals of protective deities, and a large assembly hall. Visiting Lachen and its monastery offers an authentic experience of high-altitude Buddhist life, with yak herders, nomadic traditions, and the dramatic landscape of the greater Himalayas as backdrop.",
    visitors:
      "Inner Line Permit required for Lachen. Open daily. Free entry. Best visited May–October. Gurudongmar Lake tour available from here.",
    entry: "Free (ILP required)",
    timings: "8 AM – 5 PM",
    image: "img/lachen_monastery.jpg",
    lat: 27.7265,
    lng: 88.5523,
    rating: 4.6,
  },
  {
    id: 15,
    name: "Lachung Gompa",
    region: "North",
    location: "Lachung, North Sikkim",
    yearBuilt: 1880,
    builtBy: "Lachung Gomchen",
    altitude: "2870m",
    sect: "Nyingma",
    significance: "Gateway to Yumthang Valley of Flowers; Dzumsa governance",
    history:
      "Lachung Gompa, set in the high-altitude village of Lachung at the edge of the celebrated Yumthang Valley (Valley of Flowers), was established in the late 19th century. Like Lachen, the village of Lachung is governed by the traditional Dzumsa system — a democratic council of elders whose decisions override even government authority in certain local matters. The monastery is built in classical Tibetan style with timber galleries, painted exterior walls, and a gilded roof visible from the valley below. The interior features fine thangka paintings and a collection of copper ritual vessels. Visiting the gompa is usually paired with the magnificent Yumthang Valley, which erupts into a carpet of primulas, rhododendrons, and alpine flowers in April–May. In spring, the sight of snow-capped peaks beyond a valley of wildflowers, with prayer flags above the monastery, is incomparable.",
    visitors:
      "ILP required for Lachung. Open daily. Free entry. Combine with Yumthang Valley. Best April–June, September–November.",
    entry: "Free (ILP required)",
    timings: "8 AM – 5 PM",
    image: "img/lachung_monastery.jpg",
    lat: 27.6882,
    lng: 88.5361,
    rating: 4.5,
  },
  {
    id: 16,
    name: "Namgyal Institute of Tibetology",
    region: "East",
    location: "Gangtok, East Sikkim",
    yearBuilt: 1958,
    builtBy: "Chogyal Tashi Namgyal",
    altitude: "1700m",
    sect: "Multi-sect",
    significance:
      "World-class Tibetan Buddhist research centre; rare manuscripts collection",
    history:
      "The Namgyal Institute of Tibetology — though primarily a research institute — functions in close association with the monastic community and is recognized as one of the most significant centres of Tibetan Buddhist scholarship outside Tibet. Founded in 1958 by Chogyal Tashi Namgyal with blessings from the Dalai Lama and support from the Government of India, the building itself is a masterwork of Tibetan architecture, with intricate carved woodwork and gilded decoration. Its collections include over 30,000 books and manuscripts, priceless antique thangka paintings, sacred ritual objects, and hundreds of rare texts that survived the destruction in Tibet. The institute has published landmark journals and monographs on Tibetan culture. No serious student of Buddhism or Himalayan culture can miss this repository of living tradition.",
    visitors:
      "Open Mon–Sat 10 AM–4 PM. Entry ₹10. Museum included. Guided tour available on request. Photography of exhibits with permission.",
    entry: "₹10",
    timings: "10 AM – 4 PM (Mon–Sat)",
    image: "./img/Namgyal Institute of Tibetology10.jpg",
    lat: 27.3267,
    lng: 88.6034,
    rating: 4.7,
  },
  {
    id: 17,
    name: "Sakyamuni Buddha Park, Ravangla",
    region: "South",
    location: "Ravangla, South Sikkim",
    yearBuilt: 2013,
    builtBy: "Sikkim Government",
    altitude: "2150m",
    sect: "Buddhist",
    significance:
      "130-ft bronze Buddha; blessed by Dalai Lama; underground gallery",
    history:
      "The Tathagata Tsal (Buddha Park) in Ravangla, South Sikkim, was completed in 2013 and enshrines a majestic 130-foot bronze statue of Sakyamuni Buddha — the most serene and photogenic religious monument in Sikkim. The site was consecrated by His Holiness the Dalai Lama himself. The statue is surrounded by 108 prayer wheels and beautifully landscaped gardens with water features. At the base of the statue, an underground gallery contains life-size dioramas depicting scenes from the life of Prince Siddhartha — from his birth to his enlightenment — serving as both a place of devotion and an educational journey. On clear days the entire sweep of the Kanchenjunga massif frames the Buddha in a sublime composition. The site is one of the most visited in Sikkim.",
    visitors:
      "Open daily 8 AM–6 PM. Entry ₹15. Photography allowed everywhere. Nearest town: Ravangla (3 km). Excellent sunrise views.",
    entry: "₹15",
    timings: "8 AM – 6 PM",
    image: "./img/Sakyamuni Buddha Park, Ravangla11.jpg",
    lat: 27.3012,
    lng: 88.3598,
    rating: 4.6,
  },
  {
    id: 18,
    name: "Samdruptse, Namchi",
    region: "South",
    location: "Namchi, South Sikkim",
    yearBuilt: 2004,
    builtBy: "Sikkim Government",
    altitude: "1370m",
    sect: "Nyingma",
    significance:
      "World's tallest Guru Padmasambhava statue (135 ft); hilltop panorama",
    history:
      "Samdruptse Hill in Namchi, South Sikkim, hosts the tallest statue of Guru Padmasambhava (Guru Rimpoche) in the world — a towering 135-foot copper-bronze figure seated in meditation, its golden features visible from miles around. The word 'Samdruptse' means 'Wish-Fulfilling Mountain'. Construction of the statue and the surrounding complex began in 1997 and was completed in 2004. At the base of the hill is a traditional monastery housing monks and offering prayers daily. The complex commands a 360-degree panoramic view of South Sikkim — on clear days you can see Kanchenjunga, the plains of Bengal, and even the silver thread of the Teesta River far below. The site receives over 200,000 visitors annually and has become the defining symbol of Sikkim's Buddhist identity.",
    visitors:
      "Open daily 8 AM–6 PM. Entry ₹15. Ropeway available from Namchi town (₹80). Photography everywhere allowed.",
    entry: "₹15",
    timings: "8 AM – 6 PM",
    image: "img/Samdruptse, Namchi12.jpg",
    lat: 27.1658,
    lng: 88.3589,
    rating: 4.5,
  },
  {
    id: 19,
    name: "Tharpa Choling Monastery",
    region: "East",
    location: "Kalimpong Road, East Sikkim",
    yearBuilt: 1937,
    builtBy: "Gelugpa Monks from Tibet",
    altitude: "1680m",
    sect: "Gelug",
    significance:
      "One of very few Gelugpa monasteries in Sikkim; Maitreya Buddha image",
    history:
      "Tharpa Choling Monastery is one of the rare Gelugpa (Yellow Hat sect) monasteries in Sikkim — the tradition of His Holiness the Dalai Lama — founded in 1937 by Tibetan Gelug monks who fled to Sikkim. The vast majority of Sikkim's monasteries belong to the Nyingma and Karma Kagyu traditions, making this monastery a theologically and aesthetically distinct site. The principal statue is of Maitreya — the Future Buddha — depicted in the traditional Gelug style with characteristic iconography. The monastery houses an important collection of Tibetan canonical texts including volumes of the Kangyur and Tengyur. Monks here pursue the rigorous Gelug curriculum including philosophical debate, scripture memorisation, and tantric study.",
    visitors:
      "Open daily 9 AM–5 PM. Free entry. Located 22 km from Gangtok towards Kalimpong.",
    entry: "Free",
    timings: "9 AM – 5 PM",
    image: "img/tharpacholing_monastery.jpg",
    lat: 27.2612,
    lng: 88.5856,
    rating: 4.2,
  },
  {
    id: 20,
    name: "Martam Monastery",
    region: "East",
    location: "Martam Valley, East Sikkim",
    yearBuilt: 1945,
    builtBy: "Local Bhutia Community",
    altitude: "1650m",
    sect: "Nyingma",
    significance:
      "Authentic village monastery; organic cardamom region; community Buddhism",
    history:
      "Martam Monastery is a community monastery in the serene Martam Valley of East Sikkim, built and maintained by the local Bhutia community. Established around 1945, it reflects the grassroots Nyingma tradition of village Buddhist life in Sikkim. The valley itself is renowned for organic cardamom cultivation and represents a Sikkim that hasn't been transformed by mass tourism. The monastery hosts prayer sessions morning and evening for the local community — a deeply authentic religious experience quite unlike the more formal tourist sites. The surrounding landscape of terraced fields, rhododendron forests, and small farmhouses dotted with prayer flags captures the essence of traditional Sikkimese rural culture. Martam is part of a rural homestay and village tourism circuit.",
    visitors:
      "Open daily 6 AM–7 PM. Free entry. Combine with Martam rural village tourism homestays. 19 km from Gangtok.",
    entry: "Free",
    timings: "6 AM – 7 PM",
    image: "./img/Martam Monastery13.jpg",
    lat: 27.2534,
    lng: 88.6012,
    rating: 4.0,
  },
  {
    id: 21,
    name: "Kabi Lungchok Site Monastery",
    region: "North",
    location: "Kabi, North Sikkim",
    yearBuilt: 1900,
    builtBy: "Nyingma Community",
    altitude: "1800m",
    sect: "Nyingma",
    significance:
      "Site of historic Lepcha-Bhutia blood-brotherhood pact (1641)",
    history:
      "Kabi Lungchok is a historically sacred site where, in 1641, the legendary blood brotherhood pact was signed between the first Chogyal of Sikkim, Phuntsog Namgyal, and the Lepcha chief Thekong Tek — forming the foundation covenant of the Sikkimese state. The site is marked by an ancient monolith. A small Nyingma monastery was established here around 1900 to consecrate this hallowed ground and offer regular prayers at this founding site of Sikkim's civilisation. The monastery is modest in scale but immense in historical significance. Kabi is also a fine birdwatching location — the forest around it supports the spectacular Blood Pheasant and numerous Himalayan species. The combined historical and natural appeal makes it a worthwhile detour on the Gangtok–Mangan road.",
    visitors:
      "Open daily. Free entry. Historical monolith on site. 17 km from Gangtok on NH-10.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "./img/Kabi Lungchok Site Monastery14.jpg",
    lat: 27.4512,
    lng: 88.5784,
    rating: 4.1,
  },
  {
    id: 22,
    name: "Chungthang Gompa",
    region: "North",
    location: "Chungthang, North Sikkim",
    yearBuilt: 1875,
    builtBy: "Nyingma Monks",
    altitude: "1600m",
    sect: "Nyingma",
    significance:
      "Sacred river confluence; Guru Padmasambhava meditation cave nearby",
    history:
      "Chungthang Gompa stands at the confluence of the Lachen Chu and Lachung Chu rivers in North Sikkim — a historically and strategically important location that has been considered sacred for centuries. The monastery was established in 1875 by Nyingma monks. Local tradition holds that Guru Padmasambhava meditated in a cave near Chungthang on his historic journey from India to Tibet, and the waters of the river confluence here are considered particularly pure and powerful. Pilgrims perform ritual bathing at the confluence. The monastery contains ancient ritual musical instruments — including the massive dungchen long horns and the resonant gyaling oboes — and an impressive collection of ceremonial masks used in Chaam performances. Chungthang is the gateway to both Lachen and Lachung valleys.",
    visitors:
      "Open daily 7 AM–6 PM. Free entry. River confluence bathing spot nearby. 95 km from Gangtok.",
    entry: "Free",
    timings: "7 AM – 6 PM",
    image: "./img/Chungthang Gompa15.jpg",
    lat: 27.6287,
    lng: 88.6401,
    rating: 4.4,
  },
  {
    id: 23,
    name: "Sangchen Dorjee Monastery",
    region: "North",
    location: "Mangan, North Sikkim",
    yearBuilt: 1947,
    builtBy: "Karma Kagyu Monks",
    altitude: "1100m",
    sect: "Karma Kagyu",
    significance: "District headquarters monastery; gateway to North Sikkim",
    history:
      "Sangchen Dorjee Monastery, located in Mangan — the headquarters of North Sikkim district — was established in 1947 and belongs to the Karma Kagyu tradition. As the principal monastery of the district town, it serves the administrative, cultural, and spiritual centre of North Sikkim. The monastery's prayer hall contains beautiful murals painted in the classical Kagyu style and houses a large statue of Shakyamuni Buddha flanked by Guru Rimpoche and Chenrezig. The monastery's location in Mangan town makes it easily accessible and is typically the first religious site visitors encounter on their way into the spectacular mountain scenery of North Sikkim. The annual monastery festival draws participants from across the district.",
    visitors:
      "Open daily 8 AM–6 PM. Free entry. Located in Mangan town. 64 km from Gangtok.",
    entry: "Free",
    timings: "8 AM – 6 PM",
    image: "img/sangchendorjee_monastery.jpg",
    lat: 27.5068,
    lng: 88.5222,
    rating: 4.2,
  },
  {
    id: 24,
    name: "Rinchenpong Monastery",
    region: "West",
    location: "Rinchenpong, West Sikkim",
    yearBuilt: 1730,
    builtBy: "Nyingma Lamas",
    altitude: "1465m",
    sect: "Nyingma",
    significance: "Best Kanchenjunga panoramic views; overlooks Rangit Valley",
    history:
      "Rinchenpong Monastery, perched on a ridge above the Rangit Valley in western Sikkim, was founded in the 18th century by Nyingma lamas. The monastery overlooks a landscape of cardamom forests and tea gardens with the great snowy wall of Kanchenjunga rising dramatically to the north. The view from the monastery terrace — arguably the finest Kanchenjunga panorama in all of Sikkim — is considered a sacred vision that inspires and purifies the mind. Local legends associate Rinchenpong with visits by Guru Padmasambhava himself, who is said to have rested here on his way north. The monastery contains ancient thangkas, butter lamps maintained by the local Bhutia community, and traditional wooden carvings. The village of Rinchenpong has excellent eco-lodge accommodation.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Stunning Kanchenjunga views — best at dawn. Nearest town: Legship (12 km).",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "./img/Rinchenpong Monastery16.jpg",
    lat: 27.2235,
    lng: 88.2189,
    rating: 4.4,
  },
  {
    id: 25,
    name: "Ngor Ewam Choden Monastery",
    region: "West",
    location: "Gyalshing, West Sikkim",
    yearBuilt: 1880,
    builtBy: "Ngor Tibetan Monks",
    altitude: "1450m",
    sect: "Sakya / Ngor",
    significance:
      "Rare Ngor sub-sect Sakya monastery; finest Sakya-style architecture in Sikkim",
    history:
      "Ngor Ewam Choden is a monastery of the Ngor sub-sect of the Sakyapa tradition — one of the four main schools of Tibetan Buddhism — making it theologically rare in Sikkim where the Nyingma and Kagyu schools dominate. Established in the late 19th century by Ngor monks who came from Tibet's famous Ngor Monastery, its architecture follows the distinctive Sakya style with grey-and-white striped walls, deep ochre doors, and intricate carved cornices. The monastery houses excellent examples of Sakya-style thangka paintings, bronze sculptures, and torma (ritual offering sculptures). The unique visual vocabulary of Sakya art — quite different from Nyingma aesthetics — makes this monastery a fascinating stop for students of Tibetan Buddhist art.",
    visitors:
      "Open daily 9 AM–5 PM. Free entry. Located in Gyalshing (district HQ). 120 km from Gangtok.",
    entry: "Free",
    timings: "9 AM – 5 PM",
    image: "img/ngorewamchoden_monastery.jpg",
    lat: 27.2974,
    lng: 88.2597,
    rating: 4.3,
  },
  {
    id: 26,
    name: "Temi Monastery",
    region: "South",
    location: "Temi Tea Estate, South Sikkim",
    yearBuilt: 1895,
    builtBy: "Karma Kagyu Monks",
    altitude: "1585m",
    sect: "Karma Kagyu",
    significance:
      "Overlooks Temi Tea Estate; unique tea-garden monastery landscape",
    history:
      "Temi Monastery occupies a uniquely picturesque position overlooking the Temi Tea Estate — the largest and most famous organic tea garden in Sikkim. The combination of the monastery with its fluttering prayer flags above rows of manicured green tea bushes, with the snowy crown of Kanchenjunga visible on clear days, creates one of the most visually distinctive sacred landscapes in the entire Himalayan region. The monastery belongs to the Karma Kagyu tradition and was founded in 1895 to serve the local Bhutia and Tibetan communities. It is typically visited as part of a Temi tea estate tour, combining spiritual pilgrimage with the sensory experience of fresh Sikkim tea.",
    visitors:
      "Open daily 9 AM–5 PM. Free entry. Combine with Temi Tea Garden tour and tea tasting. 20 km from Namchi.",
    entry: "Free",
    timings: "9 AM – 5 PM",
    image: "img/temi_monastery.jpg",
    lat: 27.2345,
    lng: 88.4178,
    rating: 4.2,
  },
  {
    id: 27,
    name: "Tendong Monastery",
    region: "South",
    location: "Tendong Hill, South Sikkim",
    yearBuilt: 1880,
    builtBy: "Nyingma Monks",
    altitude: "2621m",
    sect: "Nyingma / Lepcha",
    significance:
      "Sacred Lepcha flood-legend hill; Tendong Lho Rum Faat festival",
    history:
      "Tendong Monastery sits atop Tendong Hill — the highest accessible peak in South Sikkim at 2621 metres — a sacred summit with extraordinary significance to the Lepcha people, Sikkim's original indigenous inhabitants. The name 'Tendong' means 'standing upright like a raised thumb'. According to ancient Lepcha oral tradition, when a great primordial flood engulfed the Himalayan region, this hill alone rose above the waters, offering refuge to Lepchas and their animals. The small monastery on the summit was established in the 1880s and is sacred to both Lepchas and Tibetan Buddhists. The annual Tendong Lho Rum Faat festival, celebrated on the 8th day of the 8th lunar month (typically August), commemorates the salvation from the legendary flood with singing, dancing, and offerings.",
    visitors:
      "Trekking required to summit (3–4 hours from base). Free entry. Tendong Lho Rum Faat: August. Best Oct–May.",
    entry: "Free",
    timings: "Daylight hours",
    image: "img/Tendong_monastery.jpg",
    lat: 27.1523,
    lng: 88.4123,
    rating: 4.3,
  },
  // *** new one monastery tracing
  {
    id: 28,
    name: "Bon Monastery, Tinkitam",
    region: "South",
    location: "Tinkitam, South Sikkim",
    yearBuilt: 1978,
    builtBy: "Bon Community",
    altitude: "1500m",
    sect: "Bon",
    significance: "One of very few Bon (pre-Buddhist) monasteries in Sikkim",
    history:
      "The Bon Monastery at Tinkitam in South Sikkim is one of the extremely rare Bonpo institutions in the state — a practitioner of Bon, the ancient indigenous religion of Tibet that predates and coexisted alongside Buddhism. Bon shares many visual similarities with Buddhism (stupas, prayer wheels, thangkas) but maintains distinct theological, cosmological, and ritual traditions. Bon practitioners circumambulate stupas counterclockwise — the opposite of Buddhist practice. The monastery was established in 1978 to preserve Bon traditions for the small Bon community in South Sikkim. It receives occasional scholars and religious tourists interested in understanding the deep differences and historical interplay between Bon and Buddhism in the Tibetan world.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Phone ahead recommended: small community. 35 km south of Namchi.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/BonMonastery15.jpeg",
    lat: 27.1987,
    lng: 88.3456,
    rating: 4.0,
  },
  {
    id: 29,
    name: "Dzongri Monastery",
    region: "West",
    location: "Dzongri Trek, West Sikkim",
    yearBuilt: 1980,
    builtBy: "Trekking Route Monks",
    altitude: "4030m",
    sect: "Nyingma",
    significance:
      "Highest monastery in Sikkim; base for Goecha La; sublime Kanchenjunga views",
    history:
      "Dzongri Monastery is positioned at the high-altitude camping plateau of Dzongri at 4030 metres — making it the highest monastery in Sikkim and among the highest accessible in the entire Himalayan region. The small but powerfully located gompa sits on the classical trekking route from Yuksom to Goecha La, offering directly facing views of the Kanchenjunga massif — the third highest mountain on Earth and guardian deity of Sikkim. The area is considered especially holy as it lies at the feet of the sacred mountain. The monastery serves trekkers and pilgrims making the arduous journey. Overnight at Dzongri on a clear night — with a sky full of stars and the snow giants luminous around you — is one of the most transcendent experiences available anywhere on Earth.",
    visitors:
      "Accessible only by trekking (3–4 days from Yuksom). Trekking permit required. Open trekking season: October–May.",
    entry: "Permit required",
    timings: "Trekking season only",
    image: "img/dzongritrek.webp",
    lat: 27.4523,
    lng: 88.3012,
    rating: 4.8,
  },
  {
    id: 30,
    name: "Tashigang Monastery",
    region: "West",
    location: "Tashigang, West Sikkim",
    yearBuilt: 1825,
    builtBy: "Bhutia Community",
    altitude: "1800m",
    sect: "Nyingma",
    significance:
      "Historic Bhutia community monastery; traditional masked dances",
    history:
      "Tashigang Monastery was built in 1825 by the Bhutia community of the Tashigang area in West Sikkim and belongs to the Nyingma tradition. The monastery is architecturally handsome, with its traditional whitewashed walls, red-painted woodwork, and golden finial gleaming against the green hillside. The interior contains traditional wall paintings, a collection of copper ritual bowls and butter lamps, and carved wooden offering tables. Local community festivals are celebrated here with traditional Sikkimese music played on flutes, drums, and cymbals, followed by masked dances (Chaam). The monastery is surrounded by forests and mountain streams, creating an atmosphere of profound tranquillity. It represents an important strand of local Buddhist identity in West Sikkim that operates entirely outside the tourist circuit.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Off the tourist trail — authentic community experience.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/spiti_P1556.webp",
    lat: 27.3012,
    lng: 88.2534,
    rating: 4.1,
  },
  {
    id: 31,
    name: "Tolung Monastery",
    region: "North",
    location: "Tolung, North Sikkim",
    yearBuilt: 1860,
    builtBy: "Karma Kagyu Monks",
    altitude: "2200m",
    sect: "Karma Kagyu",
    significance:
      "Unique Milarepa life-story Chaam dance; exceptional Teesta valley views",
    history:
      "Tolung Monastery stands in a beautiful meadow above the Teesta River in North Sikkim. Established around 1860, this Karma Kagyu monastery is distinguished by wall paintings depicting the complete life story of Milarepa — the 11th-century Tibetan yogi-saint-poet who is one of the most beloved figures in all of Himalayan Buddhism. The monastery's most unique tradition is a Chaam masked dance performed annually in August that dramatizes scenes from Milarepa's life story — including his early crimes, his penance under the guru Marpa, and his final enlightenment — a performance unique to this monastery in all of Sikkim. The meadow on which the monastery stands offers spectacular views of distant snow peaks. The remoteness of Tolung ensures it remains genuinely uncrowded.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Unique Milarepa Chaam: August. Remote — 4WD vehicle required for final stretch.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/TholungGonpa.jpg",
    lat: 27.5834,
    lng: 88.5345,
    rating: 4.3,
  },
  {
    id: 32,
    name: "Kongri Monastery",
    region: "North",
    location: "Kongri, North Sikkim",
    yearBuilt: 1888,
    builtBy: "Nyingma Monks",
    altitude: "2000m",
    sect: "Nyingma",
    significance:
      "Ancient Padmasambhava cycle murals; forest monastery atmosphere",
    history:
      "Kongri Monastery, deep in the forested hills of North Sikkim, was established in 1888 by Nyingma monks and is renowned for its extraordinary cycle of ancient murals depicting the life and miracles of Guru Padmasambhava (Guru Rimpoche) — the 8th-century Indian master who brought Tantric Buddhism to Tibet and Sikkim. The walls of the main prayer hall are covered floor to ceiling with these paintings, creating an immersive visual narrative. Kongri hosts the Gu-Tor festival annually — a ceremony of expelling evil and purifying accumulated negative karma before the Tibetan New Year — with energetic ritual dances and the ceremonial burning of a torma effigy. The dense forest of oak, maple, and rhododendron surrounding the monastery creates an atmosphere of deep seclusion.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Remote; guided visit recommended. 15 km from Mangan on forest road.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/kongrimonastery.webp",
    lat: 27.5623,
    lng: 88.5145,
    rating: 4.2,
  },
  {
    id: 33,
    name: "Ralang Old Monastery",
    region: "South",
    location: "Old Ralang, South Sikkim",
    yearBuilt: 1768,
    builtBy: "4th Chogyal Tenzing Namgyal",
    altitude: "1670m",
    sect: "Karma Kagyu",
    significance:
      "Original 1768 monastery; 300-year-old thangkas and Buddha statues",
    history:
      "The Old Ralang Monastery is the original 1768 structure built by the 4th Chogyal of Sikkim, distinct from the large new monastery built adjacent to it in modern times. The old building is a more intimate space with blackened rafters of ancient timber and walls covered in 18th-century thangka paintings of extraordinary beauty and spiritual power. Unlike the grander new monastery, the old gompa maintains the feel of genuine antiquity and living practice. The gilded brass statues inside date to the original construction and are considered among the finest 18th-century Buddhist art in Sikkim. The old monastery is in ongoing use by the monks from the adjacent new gompa for specific ritual functions.",
    visitors:
      "Open daily 7 AM–5 PM. Free entry. Visit both old and new Ralang in one trip. 12 km from Ravangla.",
    entry: "Free",
    timings: "7 AM – 5 PM",
    image: "img/Ralong_monastery.jpg",
    lat: 27.2098,
    lng: 88.3234,
    rating: 4.4,
  },
  {
    id: 34,
    name: "Sinon Monastery",
    region: "South",
    location: "Sinon, South Sikkim",
    yearBuilt: 1935,
    builtBy: "Karma Kagyu Monks",
    altitude: "1620m",
    sect: "Karma Kagyu",
    significance:
      "Peaceful off-beaten rural monastery; traditional architecture",
    history:
      "Sinon Monastery is a serene and little-visited monastery in the rural landscape of South Sikkim, established in 1935. It belongs to the Karma Kagyu sect and is situated amid a landscape of forested hills and terraced fields. The monastery is accessed by a path lined with colourful prayer flags that snap in the mountain breeze. The architecture is traditional Sikkimese, with a carved wooden entrance gate, whitewashed walls, and the distinctive red and yellow painted trim of the Kagyu order. The local monks maintain a simple, unpretentious life of prayer and practice. For visitors fatigued by more crowded sites, Sinon offers a genuinely peaceful experience of Sikkimese village Buddhism.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Relatively little-visited — authentic and peaceful. 25 km from Namchi.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/Sinon Monastery.webp",
    lat: 27.1834,
    lng: 88.3278,
    rating: 4.1,
  },
  {
    id: 35,
    name: "Kagyu Thekchen Ling Monastery",
    region: "East",
    location: "Rumtek area, East Sikkim",
    yearBuilt: 1985,
    builtBy: "Kagyu Monastic Body",
    altitude: "1500m",
    sect: "Karma Kagyu",
    significance:
      "Kagyu Institute for Higher Buddhist Studies; Mahamudra and Six Yogas teachings",
    history:
      "Kagyu Thekchen Ling Monastery is part of the broader Rumtek monastic complex and was established in 1985 to accommodate the growing monastic community and provide a dedicated centre for higher Buddhist studies. The institute is one of the few places in the Himalayan region where authentic Kagyu philosophical and practical training — including the Six Yogas of Naropa and Mahamudra (the Kagyu path to direct enlightenment) — is transmitted in its original form. Monks come from Bhutan, Nepal, and all parts of India to study here. The monastery contributes significantly to the preservation of the Karma Kagyu tradition in the face of the disruptions caused by the Chinese occupation of Tibet.",
    visitors:
      "Open daily 9 AM–5 PM. Free entry. Academic visitors and practitioners welcome. 20 km from Gangtok near Rumtek.",
    entry: "Free",
    timings: "9 AM – 5 PM",
    image: "img/kagyu.webp",
    lat: 27.3178,
    lng: 88.5456,
    rating: 4.3,
  },
  {
    id: 36,
    name: "Solophok Chardham",
    region: "South",
    location: "Namchi, South Sikkim",
    yearBuilt: 2011,
    builtBy: "Sikkim Government",
    altitude: "1370m",
    sect: "Hindu-Buddhist",
    significance:
      "33m Shiva statue; replicas of four dhams; symbol of Sikkim's religious pluralism",
    history:
      "The Solophok Chardham complex on Solophok Hill in Namchi, South Sikkim, represents a unique expression of Sikkim's deep religious pluralism. The complex's centrepiece is a monumental 33-metre statue of Lord Shiva — one of the tallest Shiva statues in the world — seated in meditation atop the hill. Surrounding the statue are the four shrines representing the Chardham pilgrimage circuit of India: Badrinath, Puri Jagannath, Dwarka, and Rameswaram. Though primarily a Hindu pilgrimage complex, it stands in the heart of Buddhist Sikkim and symbolizes the two traditions' centuries of peaceful coexistence. The view from the hilltop encompasses the entire Namchi valley, tea gardens, and distant snowpeaks.",
    visitors:
      "Open daily 8 AM–6 PM. Entry ₹20. Ropeway from Namchi ₹80. Photography allowed everywhere.",
    entry: "₹20",
    timings: "8 AM – 6 PM",
    image: "img/solophok-chardhM.jpg",
    lat: 27.1652,
    lng: 88.3612,
    rating: 4.4,
  },
  {
    id: 37,
    name: "Doling Monastery",
    region: "West",
    location: "Near Pelling, West Sikkim",
    yearBuilt: 1955,
    builtBy: "Nyingma Monks",
    altitude: "2000m",
    sect: "Nyingma",
    significance:
      "Forest meditation monastery; butter lamp offerings; monsoon mist",
    history:
      "Doling Monastery is a meditation monastery situated within the subtropical forest above Pelling in West Sikkim. Established in 1955, it belongs to the Nyingma tradition and was specifically designed as a retreat environment for monks engaged in extended meditation practice. The main prayer hall contains detailed painted murals and is kept alive by the flickering light of hundreds of butter lamps maintained in rows before the altar. The forest surrounding Doling — full of oak, magnolia, and alder — creates a quality of silence that is rare. During monsoon season, when mist rolls through the trees and the prayer flags drip with moisture, the monastery takes on an atmosphere of haunting beauty quite unlike any other season.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Forest walk from Pelling. Particularly magical in monsoon (June–September).",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/doling_monastery.jpg",
    lat: 27.3456,
    lng: 88.2012,
    rating: 4.1,
  },
  {
    id: 38,
    name: "Labrang Monastery",
    region: "East",
    location: "Below Gangtok, East Sikkim",
    yearBuilt: 1760,
    builtBy: "First Chogyal's Lineage",
    altitude: "1620m",
    sect: "Nyingma",
    significance:
      "One of oldest monasteries in Sikkim; Chogyal royal priest residence",
    history:
      "Labrang Monastery, situated below Gangtok in a forested valley, is one of the oldest monasteries in Sikkim, built around 1760 by lamas associated with the Chogyal's royal lineage. The monastery served as the private residence of the Chogyal's personal chaplain and royal religious advisor. Its age is apparent in the architecture — massive hand-hewn timber beams, low ceilings blackened by centuries of butter-lamp smoke, and floor-level cushioned platforms worn smooth by generations of meditators. The walls are covered in ancient painted imagery. A small but important library of religious manuscripts is maintained here. The monastery is peaceful, receives few visitors, and offers an intimate, unmediated encounter with Sikkim's religious antiquity.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Below Gangtok main town — 10-min drive.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/labrang_monastery.jpg",
    lat: 27.3156,
    lng: 88.5978,
    rating: 4.3,
  },
  {
    id: 39,
    name: "Gurudongmar Shrine",
    region: "North",
    location: "Gurudongmar Lake, North Sikkim",
    yearBuilt: 1950,
    builtBy: "Local Buddhist Community",
    altitude: "5183m",
    sect: "Nyingma",
    significance:
      "World's highest sacred lake; Guru Rimpoche blessed spot; unfreezing miracle",
    history:
      "The small shrine at Gurudongmar Lake, at 5183 metres, sits beside one of the highest and most spiritually potent bodies of water on Earth. The lake is revered by Buddhists, Hindus, and Sikhs alike. According to legend, Guru Padmasambhava touched a portion of this lake as he passed through on his way to Tibet, and that particular section never freezes even in the deepest winter — a phenomenon that generations of pilgrims and soldiers have witnessed and attested to. The shrine serves as a resting and prayer point for the small number of devotees who make the arduous high-altitude journey each year. The view of the lake — its improbable deep blue set against glaciers, tundra, and snow mountains at the roof of the world — induces awe and spiritual overwhelming in almost every visitor.",
    visitors:
      "Restricted Area Permit required. Best visited May–November. Risk of altitude sickness — acclimatize in Lachen first. No overnight stay at lake.",
    entry: "Free (special restricted area permit)",
    timings: "Daylight hours only",
    image: "img/Gurdwara_Dongmaar.webp",
    lat: 28.0254,
    lng: 88.7241,
    rating: 4.9,
  },
  {
    id: 40,
    name: "Do-ngak Choling Monastery",
    region: "West",
    location: "Pemyangtse area, West Sikkim",
    yearBuilt: 1963,
    builtBy: "Nyingma Community",
    altitude: "2100m",
    sect: "Nyingma",
    significance:
      "Post-Tibet diaspora monastery; refuge for Nyingma refugees from Tibet",
    history:
      "Do-ngak Choling Monastery in West Sikkim was established in 1963 to provide a refuge for Nyingma monks and nuns who fled Tibet following the Chinese military occupation. The monastery represents one of the last waves of traditional Tibetan Buddhist culture to be transplanted to Sikkim's soil before the borders closed permanently. The monks who established it brought with them texts, ritual objects, and artistic traditions that were being systematically destroyed across the border. The monastery contains a precious archive of texts salvaged from Tibet. Its very existence is an act of cultural preservation under duress. The dedication with which the refugees rebuilt their religious life in this Sikkimese hillside — creating a fully functioning monastery within years of arrival — is itself a powerful story of spiritual resilience.",
    visitors:
      "Open daily 8 AM–5 PM. Free entry. Located near Pemayangtse. Cultural significance as a Tibetan diaspora institution.",
    entry: "Free",
    timings: "8 AM – 5 PM",
    image: "img/Do-ngak_Choling.jpg",
    lat: 27.3312,
    lng: 88.2098,
    rating: 4.2,
  },
];

// *** Testimonial section code in js

const TESTI = [
  {
    q: "Visiting Rumtek was transformative. The golden stupa of the 16th Karmapa left me in absolute awe. Monastery360 gave me detailed history that made every corner come alive — I knew exactly what I was looking at.",
    nm: "Priya Sharma",
    role: "Spiritual Traveller, Mumbai",
    s: 5,
    img: "./testimonial/priya1.jpg",
  },
  {
    q: "Pemayangtse at dawn with Kanchenjunga behind it — that image will stay with me for the rest of my life. The historical depth on this platform is unlike anything else I found online when researching Sikkim.",
    nm: "Rajesh Kumar",
    role: "History Professor, New Delhi",
    s: 5,
    img: "./testimonial/rajesh2.jpg",
  },
  {
    q: "I never imagined I'd find such detailed and accurate monastery information in one place. The Bumchu festival at Tashiding was the most profound spiritual experience of my life. Monastery360 guided me there.",
    nm: "Sarah Mitchell",
    role: "Travel Photographer, London",
    s: 5,
    img: "./testimonial/sarah3.jpg",
  },
  {
    q: "The Heritage Circuit tour package was worth every rupee. Our guide Tenzin knew every monastery deeply and the experience of Khecheopalri Lake at twilight — with butter lamps on the water — was pure magic.",
    nm: "Amit Bose",
    role: "Freelance Writer, Kolkata",
    s: 5,
    img: "./testimonial/amit4.jpg",
  },
  {
    q: "As a Tibetan Buddhist practitioner, Monastery360 has been invaluable for my Sikkim pilgrimage. The reverence with which the content is written shows genuine respect for the tradition, not just tourism.",
    nm: "Bhanu Pratap",
    role: "Buddhist Practitioner, Gangtok",
    s: 5,
    img: "./testimonial/bhanu5.jpg",
  },
];

// *** Tour packages plan payment section code in js

const PLANS = [
  {
    nm: "Day Seeker",
    ico: "🌅",
    price: 1499,
    ds: "One-day curated monastery tour around Gangtok covering the main Buddhist heritage sites with expert local guide.",
    feats: [
      "Rumtek + Enchey + Do-drul Chorten",
      "Certified local guide",
      "Lunch at monastery café",
      "Transport from Gangtok hotel",
    ],
    feat: false,
  },
  {
    nm: "Heritage Circuit",
    ico: "🏔️",
    price: 4999,
    ds: "3-day immersive West Sikkim heritage tour covering the oldest monasteries in the state with Kanchenjunga views.",
    feats: [
      "Pemayangtse + Tashiding + Yuksom Dubdi",
      "Expert heritage scholar guide",
      "2 nights eco-lodge stay",
      "All meals included",
      "Kanchenjunga sunrise viewing",
    ],
    feat: true,
  },
  {
    nm: "Pilgrimage Trail",
    ico: "☸️",
    price: 8999,
    ds: "5-day deep pilgrimage through sacred West and North Sikkim sites with lama-guided spiritual narration.",
    feats: [
      "10 monasteries over 5 days",
      "Senior lama as guide",
      "4 nights accommodation",
      "All meals + permits",
      "Khecheopalri Lake at twilight",
    ],
    feat: false,
  },
  {
    nm: "Photography Tour",
    ico: "📷",
    price: 12999,
    ds: "7-day professional photography tour of Sikkim's most photogenic monasteries with golden-hour and dawn access.",
    feats: [
      "All 4 districts of Sikkim",
      "Drone permit assistance",
      "Pre-dawn & dusk access",
      "Expert photography guide",
      "All logistics fully managed",
    ],
    feat: false,
  },
];

// ═══════════════════════ STATE ═══════════════════════
let CUR_FILTER = "All",
  CUR_SEARCH = "",
  RV_STAR = 0,
  CUR_MON = null,
  T_IDX = 0,
  MC_IDX = 0,
  MC_TIMER = null,
  SEL_PLAN = null,
  PENDING_SIGNUP = null,
  OTP_TIMER = null;

const API_URL = "https://sikkimmonastery.onrender.com/api";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAy99E3DU7Gv9pcILQEG4vtGTWTz_aqhpg",
  authDomain: "authentication-c0fa8.firebaseapp.com",
  projectId: "authentication-c0fa8",
  storageBucket: "authentication-c0fa8.firebasestorage.app",
  messagingSenderId: "908473570563",
  appId: "1:908473570563:web:300a533b9252cfbe860536",
  measurementId: "G-E2JT26DH7Y",
};

function initFirebaseAuth() {
  if (!window.firebase || firebase.apps?.length) return;
  firebase.initializeApp(FIREBASE_CONFIG);
}

// ═══════════════════════ INIT ═══════════════════════
window.addEventListener("load", () => {
  setTimeout(skipSplash, 5000);
  initCookieConsent(); // Initialize cookie consent
  initFirebaseAuth();
  initExperience();
  rndMons();
  rndTesti();
  rndPlans();
  initMonCarousel();
  updNav();
  updCounts();
  setTimeout(
    () =>
      document.querySelectorAll(".rv").forEach((e) => {
        if (e.getBoundingClientRect().top < window.innerHeight - 80)
          e.classList.add("vis");
      }),
    200,
  );
});

function skipSplash() {
  document.getElementById("loader")?.classList.add("hide");
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) document.getElementById("nb").classList.add("sc");
  else document.getElementById("nb").classList.remove("sc");
  document.getElementById("bt").classList.toggle("show", window.scrollY > 400);
  document.querySelectorAll(".rv").forEach((e) => {
    if (e.getBoundingClientRect().top < window.innerHeight - 80)
      e.classList.add("vis");
  });
});

function ss(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
function cl() {
  document.getElementById("mmenu").classList.remove("open");
}

function initMonCarousel() {
  const shell = document.getElementById("monCarousel");
  const slides = document.querySelectorAll(".car-slide");
  const dots = document.getElementById("monCarouselDots");
  if (!shell || !slides.length || !dots) return;

  dots.innerHTML = Array.from(slides)
    .map(
      (_, i) =>
        `<button class="${i === 0 ? "active" : ""}" type="button" aria-label="Show slide ${i + 1}" onclick="goMonCarousel(${i})"></button>`,
    )
    .join("");

  startMonCarousel();
  shell.addEventListener("mouseenter", stopMonCarousel);
  shell.addEventListener("mouseleave", startMonCarousel);
}

function startMonCarousel() {
  stopMonCarousel();
  MC_TIMER = setInterval(() => moveMonCarousel(1), 2000);
}

function stopMonCarousel() {
  if (MC_TIMER) clearInterval(MC_TIMER);
}

function moveMonCarousel(dir) {
  const slides = document.querySelectorAll(".car-slide");
  if (!slides.length) return;
  goMonCarousel((MC_IDX + dir + slides.length) % slides.length);
}

function goMonCarousel(index) {
  const slides = document.querySelectorAll(".car-slide");
  const dots = document.querySelectorAll("#monCarouselDots button");
  if (!slides.length) return;

  MC_IDX = index;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === MC_IDX));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === MC_IDX));
}

// *** Corausal section default data in js

const DEFAULT_CAROUSEL = [
  {
    src: "./img/pemayangtse-monastery1.jpg",
    alt: "Pemayangtse Monastery",
    caption: "Pemayangtse Monastery",
  },
  {
    src: "./img/enchy_monastery2.jpeg",
    alt: "Enchey Monastery",
    caption: "Enchey Monastery",
  },
  {
    src: "./img/3228827Gangtok_Tsuk_La_Khang_Main3.jpg",
    alt: "Tsuk La Khang",
    caption: "Tsuk La Khang",
  },
  {
    src: "./img/Tashiding Monastery44.jpg",
    alt: "Tashiding Monastery",
    caption: "Tashiding Monastery",
  },
  {
    src: "./img/Ralang Monastery55.jpg",
    alt: "Ralang Monastery",
    caption: "Ralang Monastery",
  },
  {
    src: "./img/Do-drul Chorten6.webp",
    alt: "Do-drul Chorten",
    caption: "Do-drul Chorten",
  },
  {
    src: "./img/lingdum-monastery7.jpg",
    alt: "Lingdum Monastery",
    caption: "Lingdum Monastery",
  },
  {
    src: "./img/Yuksom Dubdi Monastery8.jpg",
    alt: "Dubdi Monastery",
    caption: "Yuksom Dubdi Monastery",
  },
  {
    src: "./img/Khecheopalri Monastery9.jpg",
    alt: "Khecheopalri Monastery",
    caption: "Khecheopalri Monastery",
  },
  {
    src: "./img/Namgyal Institute of Tibetology10.jpg",
    alt: "Namgyal Institute of Tibetology",
    caption: "Namgyal Institute of Tibetology",
  },
  {
    src: "./img/Sakyamuni Buddha Park, Ravangla11.jpg",
    alt: "Sakyamuni Buddha Park",
    caption: "Sakyamuni Buddha Park",
  },
  {
    src: "./img/Samdruptse, Namchi12.jpg",
    alt: "Samdruptse Namchi",
    caption: "Samdruptse, Namchi",
  },
  {
    src: "./img/Martam Monastery13.jpg",
    alt: "Martam Monastery",
    caption: "Martam Monastery",
  },
  {
    src: "./img/Kabi Lungchok Site Monastery14.jpg",
    alt: "Kabi Lungchok Site",
    caption: "Kabi Lungchok Site",
  },
  {
    src: "./img/Chungthang Gompa15.jpg",
    alt: "Chungthang Gompa",
    caption: "Chungthang Gompa",
  },
  {
    src: "./img/Rinchenpong Monastery16.jpg",
    alt: "Rinchenpong Monastery",
    caption: "Rinchenpong Monastery",
  },
];

const CMS_DEFAULTS = {
  landingTitle: "Discover sacred Sikkim with a living digital guide.",
  landingSubtitle:
    "Explore monasteries, plan guided tours, save favourites, and let your team update every important page detail without touching code.",
  heroBadge: "☸  Sacred Sikkim · Digital Heritage",
  heroTitle: "Explore the <em>Sacred</em><br />Monasteries of Sikkim",
  heroSubtitle:
    "Journey through centuries of Tibetan Buddhist heritage, ancient prayer halls, and living spiritual traditions nestled in the Himalayas.",
  gold: "#c9a84c",
  deep: "#1e2a38",
  carousel: DEFAULT_CAROUSEL,
};

function initExperience() {
  applyStoredTheme();
  consumeGoogleCallback();
  seedAdminUser();
  applyCmsContent();
  updateAppShell();
  updNav();
}

function updateAppShell() {
  const isAuthed = Boolean(getU());
  document.body.classList.toggle("app-authenticated", isAuthed);
  document.body.classList.toggle("app-public", !isAuthed);
  if (location.hash === "#landing") ss("hero");
}

function seedAdminUser() {
  const us = getUs();
  if (!us.find((u) => u.email === "admin@monastery360.local")) {
    us.push({
      name: "Admin",
      email: "admin@monastery360.local",
      password: "monastery360",
      role: "admin",
      joined: new Date().toLocaleDateString("en-IN"),
      rc: 0,
    });
    localStorage.setItem("m360_users", JSON.stringify(us));
  }
}

function getCms() {
  return {
    ...CMS_DEFAULTS,
    ...JSON.parse(localStorage.getItem("m360_cms") || "{}"),
  };
}

function setCms(cms) {
  localStorage.setItem("m360_cms", JSON.stringify({ ...getCms(), ...cms }));
  applyCmsContent();
}

function getDefaultCarousel() {
  const slides = Array.from(document.querySelectorAll(".car-slide"));
  if (!slides.length) return DEFAULT_CAROUSEL;
  return slides.map((slide) => ({
    src: slide.querySelector("img")?.getAttribute("src") || "",
    alt: slide.querySelector("img")?.getAttribute("alt") || "",
    caption: slide.querySelector("figcaption")?.textContent || "",
  }));
}

function applyCmsContent() {
  const cms = getCms();
  document.documentElement.style.setProperty("--gold", cms.gold);
  document.documentElement.style.setProperty("--deep", cms.deep);
  document.querySelector('[data-cms="landingTitle"]') &&
    (document.querySelector('[data-cms="landingTitle"]').textContent =
      cms.landingTitle);
  document.querySelector('[data-cms="landingSubtitle"]') &&
    (document.querySelector('[data-cms="landingSubtitle"]').textContent =
      cms.landingSubtitle);
  const heroBadge = document.querySelector("#hero .hb");
  const heroTitle = document.querySelector("#hero .ht");
  const heroSubtitle = document.querySelector("#hero .hs");
  if (heroBadge) heroBadge.textContent = cms.heroBadge;
  if (heroTitle) heroTitle.innerHTML = cms.heroTitle;
  if (heroSubtitle) heroSubtitle.textContent = cms.heroSubtitle;

  const carousel = cms.carousel?.length ? cms.carousel : getDefaultCarousel();
  renderCarouselFromCms(carousel);
}

function renderCarouselFromCms(items) {
  const track = document.querySelector("#monCarousel .car-track");
  if (!track || !items.length) return;
  track.innerHTML = items
    .map(
      (item, i) => `
        <figure class="car-slide ${i === 0 ? "active" : ""}">
          <img src="${item.src}" alt="${item.alt || item.caption}" />
          <figcaption>${item.caption}</figcaption>
        </figure>
      `,
    )
    .join("");
  MC_IDX = 0;
}

function toggleThemeDrawer() {
  document.getElementById("themeDrawer")?.classList.toggle("open");
}

function setThemeMode(mode) {
  localStorage.setItem("m360_theme", mode);
  applyStoredTheme();
}

function applyStoredTheme() {
  const mode = localStorage.getItem("m360_theme") || "light";
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  ).matches;
  document.body.dataset.theme =
    mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
}

function previewAccent(color) {
  document.documentElement.style.setProperty("--gold", color);
  if (canEditSite()) setCms({ gold: color });
}

function switchLandingAuth(mode, btn) {
  document.getElementById("landLogin").style.display =
    mode === "login" ? "block" : "none";
  document.getElementById("landSignup").style.display =
    mode === "signup" ? "block" : "none";
  btn.parentElement
    .querySelectorAll("button")
    .forEach((b) => b.classList.remove("act"));
  btn.classList.add("act");
}

function doLandingLogin() {
  document.getElementById("lem").value =
    document.getElementById("lemHero").value;
  document.getElementById("lpw").value =
    document.getElementById("lpwHero").value;
  doLogin();
}

function doLandingSignup() {
  document.getElementById("snm").value =
    document.getElementById("snmHero").value;
  document.getElementById("sem").value =
    document.getElementById("semHero").value;
  document.getElementById("spw").value =
    document.getElementById("spwHero").value;
  document.getElementById("sph").value =
    document.getElementById("sphHero").value;
  doSignup();
}

async function continueGuest() {
  ss("hero");
  showT(
    "You can explore freely. Please signup or login to book, review, or save favourites.",
    "gold",
  );
}

function startGoogleLogin() {
  window.location.href = "https://sikkimmonastery.onrender.com/auth/google";
}

async function startGithubLogin() {
  try {
    initFirebaseAuth();
    if (!window.firebase) throw new Error("Firebase SDK is not loaded");

    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("user:email");
    const result = await firebase.auth().signInWithPopup(provider);
    await finishSocialLogin(result.user, "github");
  } catch (err) {
    showT(err.message || "GitHub login failed", "error");
  }
}

async function finishSocialLogin(firebaseUser, provider) {
  const res = await fetch(`${API_URL}/auth/social-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: firebaseUser.displayName || `${provider} User`,
      email: firebaseUser.email,
      provider,
      providerId: firebaseUser.uid,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Social login failed");

  localStorage.setItem("token", data.token);
  const user = {
    ...data.user,
    provider,
    joined: new Date().toLocaleDateString("en-IN"),
    rc: 0,
  };
  upsertUser(user);
  localStorage.setItem("m360_sess", JSON.stringify(user));
  syncStoredCookieConsent();
  cm("authOv");
  updateAppShell();
  updNav();
  ss("hero");
  showT(`Welcome, ${user.name}!`, "success");
}

function consumeGoogleCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) return;
  const user = {
    name: params.get("name") || "Google User",
    email: params.get("email") || "google-user@monastery360.local",
    provider: "google",
    role: params.get("role") || "user",
    joined: new Date().toLocaleDateString("en-IN"),
    rc: 0,
  };
  localStorage.setItem("token", token);
  upsertUser(user);
  localStorage.setItem("m360_sess", JSON.stringify(user));
  updateAppShell();
  window.history.replaceState({}, document.title, window.location.pathname);
  showT("Welcome, " + user.name + "!", "success");
}

function upsertUser(user) {
  const us = getUs();
  const i = us.findIndex((u) => u.email === user.email);
  if (i > -1) us[i] = { ...us[i], ...user };
  else us.push(user);
  localStorage.setItem("m360_users", JSON.stringify(us));
}

function canEditSite() {
  const u = getU();
  return (
    localStorage.getItem("m360_adm") === "1" ||
    ["admin", "editor"].includes(u?.role)
  );
}

function openAdmCms() {
  openAdm();
  setTimeout(() => {
    const fake = document.createElement("a");
    fake.textContent = "CMS Studio";
    sas("cms", fake);
  }, 0);
}

function hydrateCmsPanel() {
  const cms = getCms();
  const map = {
    cmsLandingTitle: cms.landingTitle,
    cmsLandingSubtitle: cms.landingSubtitle,
    cmsHeroBadge: cms.heroBadge,
    cmsHeroTitle: cms.heroTitle,
    cmsHeroSubtitle: cms.heroSubtitle,
    cmsGold: cms.gold,
    cmsDeep: cms.deep,
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });
  const items = cms.carousel?.length ? cms.carousel : getDefaultCarousel();
  document.getElementById("cmsCarouselList").innerHTML = items
    .map(
      (item, i) => `
      <div class="cms-row">
        <input class="cms-input cms-cap" value="${item.caption}" placeholder="Caption" />
        <input class="cms-input cms-src" value="${item.src}" placeholder="Image path or URL" />
        <button class="bs" onclick="previewCmsImage(${i})">Preview</button>
      </div>
    `,
    )
    .join("");
}

function saveCmsContent() {
  if (!canEditSite()) {
    showT("Admin/editor access required", "error");
    return;
  }
  const rows = document.querySelectorAll("#cmsCarouselList .cms-row");
  const carousel = Array.from(rows).map((row) => ({
    caption: row.querySelector(".cms-cap").value.trim(),
    src: row.querySelector(".cms-src").value.trim(),
    alt: row.querySelector(".cms-cap").value.trim(),
  }));
  setCms({
    landingTitle: document.getElementById("cmsLandingTitle").value.trim(),
    landingSubtitle: document.getElementById("cmsLandingSubtitle").value.trim(),
    heroBadge: document.getElementById("cmsHeroBadge").value.trim(),
    heroTitle: document.getElementById("cmsHeroTitle").value.trim(),
    heroSubtitle: document.getElementById("cmsHeroSubtitle").value.trim(),
    gold: document.getElementById("cmsGold").value,
    deep: document.getElementById("cmsDeep").value,
    carousel,
  });
  initMonCarousel();
  showT("Website updated from CMS", "success");
}

function resetCmsContent() {
  localStorage.removeItem("m360_cms");
  applyCmsContent();
  hydrateCmsPanel();
  initMonCarousel();
  showT("CMS reset to defaults", "gold");
}

function previewCmsImage(i) {
  const rows = document.querySelectorAll("#cmsCarouselList .cms-row");
  const src = rows[i]?.querySelector(".cms-src")?.value;
  if (src) {
    rows[i].style.backgroundImage =
      `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.35)), url("${src}")`;
    rows[i].style.backgroundSize = "cover";
  }
}

function renderPowerPanel() {
  const list = document.getElementById("powerList");
  if (!list) return;
  list.innerHTML =
    getUs()
      .map(
        (u) => `
      <div class="power-row">
        <strong>${u.name}</strong>
        <span>${u.email}</span>
        <select onchange="setUserRole('${u.email}', this.value)">
          <option value="user" ${!u.role || u.role === "user" ? "selected" : ""}>User</option>
          <option value="editor" ${u.role === "editor" ? "selected" : ""}>Editor</option>
          <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </div>
    `,
      )
      .join("") || '<p class="cms-help">No registered users yet.</p>';
}

function setUserRole(email, role) {
  const us = getUs().map((u) => (u.email === email ? { ...u, role } : u));
  localStorage.setItem("m360_users", JSON.stringify(us));
  const cur = getU();
  if (cur?.email === email)
    localStorage.setItem("m360_sess", JSON.stringify({ ...cur, role }));
  updNav();
  showT("User power updated", "success");
}

// ═══════════════════════ COUNTS ═══════════════════════
function updCounts() {
  ["East", "West", "North", "South"].forEach((r) => {
    const c = MD.filter((m) => m.region === r).length;
    document.getElementById("c" + r[0]).textContent = c + " Monasteries";
  });
}

// ═══════════════════════ RENDER GRID ═══════════════════════
function rndMons() {
  const g = document.getElementById("mg");
  const data = MD.filter((m) => {
    const rm = CUR_FILTER === "All" || m.region === CUR_FILTER;
    const q = CUR_SEARCH.toLowerCase();
    const sm =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.region.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      m.sect.toLowerCase().includes(q);
    return rm && sm;
  });
  if (!data.length) {
    g.innerHTML =
      '<div class="nor">No monasteries found. Try a different search or filter.</div>';
    return;
  }
  const bms = getBMs();
  g.innerHTML = data
    .map(
      (m) => `
    <div class="mc rv" onclick="openDet(${m.id})">
      <div class="ci">
        <img src="${m.image}" alt="${m.name}" loading="lazy">
        <span class="rb">${m.region} Sikkim</span>
        <button class="cbm ${bms.includes(m.id) ? "sv" : ""}" onclick="event.stopPropagation();togBM(${m.id},this)">${bms.includes(m.id) ? "🔖" : "🏷️"}</button>
      </div>
      <div class="cb">
        <div class="ct2">${m.name}</div>
        <div class="cm2"><span>📍 ${m.location}</span><span>🏛️ Est. ${m.yearBuilt}</span></div>
        <div class="cd">${m.history.substring(0, 140)}…</div>
        <div class="cf">
          <div class="cr">★ ${m.rating}<span>(${getRvCnt(m.id)} reviews)</span></div>
          <button class="bs" onclick="event.stopPropagation();openDet(${m.id})">Explore →</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
  setTimeout(
    () =>
      document.querySelectorAll(".rv").forEach((e) => {
        if (e.getBoundingClientRect().top < window.innerHeight - 80)
          e.classList.add("vis");
      }),
    80,
  );
}

function doS() {
  CUR_SEARCH = document.getElementById("si2").value;
  rndMons();
}
function sf(r, b) {
  CUR_FILTER = r;
  document.querySelectorAll(".fbt").forEach((x) => x.classList.remove("act"));
  b && b.classList.add("act");
  rndMons();
}
function frg(r, c) {
  CUR_FILTER = r;
  document.querySelectorAll(".rgcd").forEach((x) => x.classList.remove("act"));
  c && c.classList.add("act");
  document.querySelectorAll(".fbt").forEach((b) => {
    if (b.textContent === r || (r === "All" && b.textContent === "All"))
      b.classList.add("act");
    else b.classList.remove("act");
  });
  rndMons();
  ss("explore");
}
function frg2(r) {
  CUR_FILTER = r;
  document.querySelectorAll(".fbt").forEach((b) => {
    if (b.textContent === r) b.classList.add("act");
    else b.classList.remove("act");
  });
  document.querySelectorAll(".rgcd").forEach((c, i) => {
    const rs = ["All", "East", "West", "North", "South"];
    c.classList.toggle("act", rs[i] === r);
  });
  rndMons();
  ss("explore");
}

// ═══════════════════════ DETAIL MODAL ═══════════════════════
function openDet(id) {
  const m = MD.find((x) => x.id === id);
  if (!m) return;
  CUR_MON = id;
  document.getElementById("dI").src = m.image;
  document.getElementById("dN").textContent = m.name;
  document.getElementById("dRg").textContent = m.region + " Sikkim";
  document.getElementById("dYr").textContent = "Est. " + m.yearBuilt;
  document.getElementById("dIG").innerHTML = `
    <div class="ii"><div class="il">Location</div><div class="iv">${m.location}</div></div>
    <div class="ii"><div class="il">Year Founded</div><div class="iv">${m.yearBuilt} CE</div></div>
    <div class="ii"><div class="il">Founded By</div><div class="iv">${m.builtBy}</div></div>
    <div class="ii"><div class="il">Buddhist Sect</div><div class="iv">${m.sect}</div></div>
    <div class="ii"><div class="il">Altitude</div><div class="iv">${m.altitude}</div></div>
    <div class="ii"><div class="il">Significance</div><div class="iv">${m.significance.split(";")[0]}</div></div>
    <div class="ii culture-note"><div class="il">Culture Message</div><div class="iv">${buildCultureMessage(m)}</div></div>
  `;
  document.getElementById("dSD").textContent =
    m.history.substring(0, 240) + "…";
  document.getElementById("dHs").textContent = m.history;
  document.getElementById("dVG").innerHTML = `
    <div class="ii"><div class="il">Entry Fee</div><div class="iv">${m.entry}</div></div>
    <div class="ii"><div class="il">Timings</div><div class="iv">${m.timings}</div></div>
    <div class="ii" style="grid-column:1/-1"><div class="il">Visitor Notes</div><div class="iv" style="font-size:13px;font-weight:400;color:#555">${m.visitors}</div></div>
  `;
  document.getElementById("dMp").src =
    `https://maps.google.com/maps?q=${m.lat},${m.lng}&z=14&output=embed`;
  document
    .querySelectorAll(".mta")
    .forEach((t, i) => t.classList.toggle("act", i === 0));
  document
    .querySelectorAll(".mtc")
    .forEach((t, i) => t.classList.toggle("act", i === 0));
  RV_STAR = 0;
  document
    .querySelectorAll("#sts span")
    .forEach((s) => s.classList.remove("act"));
  document.getElementById("rvtx").value = "";
  rndRvs(id);
  om("dtOv");
}

function buildCultureMessage(m) {
  const regionMood = {
    East: "a gateway where Gangtok's living Buddhist practice meets modern Sikkim travel",
    West: "a heritage belt tied to early Sikkimese history, royal memory, and Kanchenjunga views",
    North:
      "a quieter Himalayan route shaped by high valleys, prayer flags, and deep monastic tradition",
    South:
      "a warm cultural circuit where monasteries, hill towns, and community festivals come together",
  };
  return `${m.name} represents ${regionMood[m.region] || "Sikkim's sacred heritage"}. Visit with a calm pace, respect prayer spaces, and notice how art, chants, architecture, and local hospitality keep Sikkim's monastery culture alive.`;
}

function swT(nm, btn) {
  document.querySelectorAll(".mta").forEach((t) => t.classList.remove("act"));
  btn.classList.add("act");
  document
    .querySelectorAll(".mtc")
    .forEach((t) => t.classList.toggle("act", t.id === "tc-" + nm));
}

// ═══════════════════════ REVIEWS ═══════════════════════
function getRvs(mid) {
  return JSON.parse(localStorage.getItem("m360_rv_" + mid) || "[]");
}
function getRvCnt(mid) {
  return getRvs(mid).length;
}
function setSt(n) {
  RV_STAR = n;
  document
    .querySelectorAll("#sts span")
    .forEach((s, i) => s.classList.toggle("act", i < n));
}
function subRv() {
  const u = getU();
  if (!u) {
    showT("Login to post a review", "gold");
    showA("login");
    return;
  }
  if (!RV_STAR) {
    showT("Please select a star rating", "gold");
    return;
  }
  const t = document.getElementById("rvtx").value.trim();
  if (!t) {
    showT("Please write your review", "gold");
    return;
  }
  const rvs = getRvs(CUR_MON);
  rvs.unshift({
    user: u.name,
    text: t,
    stars: RV_STAR,
    date: new Date().toLocaleDateString("en-IN"),
  });
  localStorage.setItem("m360_rv_" + CUR_MON, JSON.stringify(rvs));
  document.getElementById("rvtx").value = "";
  RV_STAR = 0;
  document
    .querySelectorAll("#sts span")
    .forEach((s) => s.classList.remove("act"));
  rndRvs(CUR_MON);
  showT("Review posted! Thank you ✦", "success");
  const us = getUs(),
    ui = us.findIndex((x) => x.email === u.email);
  if (ui > -1) {
    us[ui].rc = (us[ui].rc || 0) + 1;
    localStorage.setItem("m360_users", JSON.stringify(us));
    localStorage.setItem("m360_sess", JSON.stringify(us[ui]));
  }
}
function rndRvs(mid) {
  const rvs = getRvs(mid),
    l = document.getElementById("rvl");
  if (!rvs.length) {
    l.innerHTML =
      '<p style="color:#aaa;font-style:italic;font-size:14px">No reviews yet. Be the first to share your experience!</p>';
    return;
  }
  const avg = (rvs.reduce((s, r) => s + r.stars, 0) / rvs.length).toFixed(1);
  l.innerHTML =
    `<div style="background:var(--cream);border-radius:10px;padding:14px;margin-bottom:14px;display:flex;align-items:center;gap:16px">
    <div style="font-family:'Cinzel',serif;font-size:32px;color:var(--gold)">${avg}</div>
    <div><div style="color:var(--gold);font-size:18px">${"★".repeat(Math.round(avg))}</div><div style="font-size:12px;color:#888">${rvs.length} review${rvs.length > 1 ? "s" : ""}</div></div>
  </div>` +
    rvs
      .map(
        (r) =>
          `<div class="rvc"><div class="rvh"><span class="rvau">${r.user}</span><span class="rvst">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</span></div><div class="rvtx">${r.text}</div><div class="rvdt">${r.date}</div></div>`,
      )
      .join("");
}

// ═══════════════════════ BOOKMARKS ═══════════════════════
function getBMs() {
  const u = getU();
  if (!u) return [];
  return JSON.parse(localStorage.getItem("m360_bm_" + u.email) || "[]");
}
function togBM(id, btn) {
  const u = getU();
  if (!u) {
    showT("Login to bookmark monasteries", "gold");
    showA("login");
    return;
  }
  const k = "m360_bm_" + u.email;
  let bm = JSON.parse(localStorage.getItem(k) || "[]");
  if (bm.includes(id)) {
    bm = bm.filter((x) => x !== id);
    btn.classList.remove("sv");
    btn.textContent = "🏷️";
    showT("Bookmark removed", "gold");
  } else {
    bm.push(id);
    btn.classList.add("sv");
    btn.textContent = "🔖";
    showT("Monastery bookmarked! ✦", "success");
  }
  localStorage.setItem(k, JSON.stringify(bm));
}

// ═══════════════════════ AUTH ═══════════════════════
function getUs() {
  return JSON.parse(localStorage.getItem("m360_users") || "[]");
}
function getU() {
  return JSON.parse(localStorage.getItem("m360_sess") || "null");
}
function showA(mode) {
  ensureCookieConsentVisible();
  document.getElementById("lf").style.display =
    mode === "login" ? "block" : "none";
  document.getElementById("sf2").style.display =
    mode === "signup" ? "block" : "none";
  document.getElementById("adf").style.display =
    mode === "admin" ? "block" : "none";
  document.getElementById("ati").textContent =
    mode === "login"
      ? "Welcome Back"
      : mode === "signup"
        ? "Create Account"
        : "Admin Login";
  document.getElementById("asu").textContent =
    mode === "login"
      ? "Login to explore sacred monasteries"
      : mode === "signup"
        ? "Join thousands of monastery explorers"
        : "Enter admin credentials";
  document.getElementById("aerr").classList.remove("show");
  om("authOv");
}
async function doLogin() {
  const e = document.getElementById("lem").value.trim(),
    p = document.getElementById("lpw").value;
  let u = null;
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e, password: p }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      u = {
        ...data.user,
        password: p,
        joined: new Date().toLocaleDateString("en-IN"),
        rc: 0,
      };
      upsertUser(u);
    }
  } catch (err) {
    u = null;
  }
  if (!u) u = getUs().find((x) => x.email === e && x.password === p);
  if (!u) {
    showAErr("Invalid email or password");
    return;
  }
  localStorage.setItem("m360_sess", JSON.stringify(u));
  syncStoredCookieConsent();
  cm("authOv");
  updateAppShell();
  updNav();
  ss("hero");
  showT("Welcome back, " + u.name + " ✦", "success");
}
async function doSignup() {
  const n = document.getElementById("snm").value.trim(),
    e = document.getElementById("sem").value.trim(),
    p = document.getElementById("spw").value,
    ph = document.getElementById("sph").value.trim();
  if (!n || !e || !p || !ph) {
    showAErr("Please fill name, email, password and mobile number");
    return;
  }
  if (p.length < 6) {
    showAErr("Password must be at least 6 characters");
    return;
  }
  const us = getUs();
  if (us.find((x) => x.email === e)) {
    showAErr("Email already registered");
    return;
  }

  PENDING_SIGNUP = { name: n, email: e, phone: ph, password: p };
  await requestSignupOtp();
}

async function requestSignupOtp() {
  if (!PENDING_SIGNUP?.email || !PENDING_SIGNUP?.phone) {
    showAErr("Enter signup details first");
    return;
  }
  setOtpResendState(60);
  try {
    const res = await fetch(`${API_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: PENDING_SIGNUP.email,
        phone: PENDING_SIGNUP.phone,
        purpose: "signup",
      }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || data.error || "Unable to send OTP");
    document.getElementById("otpHint").textContent =
      "Enter the OTP sent to " +
      PENDING_SIGNUP.email +
      " and " +
      PENDING_SIGNUP.phone +
      ". Both expire in 5 minutes.";
    document.getElementById("emailOtpCode").value = "";
    document.getElementById("mobileOtpCode").value = "";
    document.getElementById("otpErr").classList.remove("show");
    cm("authOv");
    om("otpOv");
    showT("OTP sent to email and mobile", "success");
  } catch (err) {
    clearOtpResendTimer();
    showAErr(err.message + " Check backend email/Twilio .env setup if needed.");
  }
}

async function verifySignupOtp() {
  const emailOtp = document.getElementById("emailOtpCode").value.trim();
  const mobileOtp = document.getElementById("mobileOtpCode").value.trim();
  if (!PENDING_SIGNUP || emailOtp.length !== 6 || mobileOtp.length !== 6) {
    showOtpErr("Please enter both 6-digit OTP codes");
    return;
  }
  try {
    const res = await fetch(`${API_URL}/auth/verify-signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...PENDING_SIGNUP, emailOtp, mobileOtp }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || data.error || "OTP verification failed");
    const user = {
      ...data.user,
      password: PENDING_SIGNUP.password,
      joined: new Date().toLocaleDateString("en-IN"),
      rc: 0,
    };
    localStorage.setItem("token", data.token || "");
    upsertUser(user);
    localStorage.setItem("m360_sess", JSON.stringify(user));
    PENDING_SIGNUP = null;
    clearOtpResendTimer();
    cm("otpOv");
    updateAppShell();
    updNav();
    ss("hero");
    showT("Account verified. Welcome!", "success");
  } catch (err) {
    showOtpErr(err.message);
  }
}

function setOtpResendState(seconds) {
  const btn = document.getElementById("otpResendBtn");
  if (!btn) return;
  clearOtpResendTimer();
  let left = seconds;
  btn.disabled = true;
  btn.textContent = `Resend OTP in ${String(left).padStart(2, "0")}s`;
  OTP_TIMER = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      clearOtpResendTimer();
      return;
    }
    btn.textContent = `Resend OTP in ${String(left).padStart(2, "0")}s`;
  }, 1000);
}

function clearOtpResendTimer() {
  if (OTP_TIMER) clearInterval(OTP_TIMER);
  OTP_TIMER = null;
  const btn = document.getElementById("otpResendBtn");
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Resend OTP";
  }
}
function showOtpErr(msg) {
  const e = document.getElementById("otpErr");
  e.textContent = msg;
  e.classList.add("show");
}

function doAdm() {
  const u = document.getElementById("admu").value.trim(),
    p = document.getElementById("admp").value;
  if (u === "admin" && p === "monastery360") {
    localStorage.setItem("m360_adm", "1");
    const adminUser = {
      name: "Admin",
      email: "admin@monastery360.local",
      password: "monastery360",
      role: "admin",
      joined: new Date().toLocaleDateString("en-IN"),
      rc: 0,
    };
    upsertUser(adminUser);
    localStorage.setItem("m360_sess", JSON.stringify(adminUser));
    cm("authOv");
    updateAppShell();
    updNav();
    showT("Admin access granted ✦", "success");
  } else showAErr("Invalid admin credentials — try admin / monastery360");
}
function doLogout() {
  localStorage.removeItem("m360_sess");
  localStorage.removeItem("m360_adm");
  localStorage.removeItem("token");
  closeProf();
  updateAppShell();
  updNav();
  showT("Logged out successfully", "gold");
}
function showAErr(msg) {
  const e = document.getElementById("aerr");
  e.textContent = msg;
  e.classList.add("show");
}
function updNav() {
  const u = getU(),
    adm = localStorage.getItem("m360_adm") === "1" || u?.role === "admin",
    editor = adm || u?.role === "editor";
  document.getElementById("lgBtn").style.display = u ? "none" : "inline-flex";
  document.getElementById("loBtn").style.display = "none";
  document.getElementById("pBtn").style.display = u ? "flex" : "none";
  document.getElementById("bBtn").style.display = u ? "flex" : "none";
  document.getElementById("aBtn").style.display = editor ? "flex" : "none";
  document.getElementById("cmsQuickBtn").style.display = editor
    ? "inline-flex"
    : "none";
  document.getElementById("navUserName").style.display = u
    ? "inline-block"
    : "none";
  document.getElementById("navUserName").textContent = u ? `Hi, ${u.name}` : "";
  document.getElementById("pBtn").textContent = u
    ? u.name.charAt(0).toUpperCase()
    : "U";
}

// ═══════════════════════ PROFILE ═══════════════════════
function showProf() {
  const u = getU();
  if (!u) {
    showA("login");
    return;
  }
  document.getElementById("prav").textContent = u.name.charAt(0).toUpperCase();
  document.getElementById("prnm").textContent = u.name;
  document.getElementById("prem").textContent = u.email;
  document.getElementById("prEditName").value = u.name || "";
  document.getElementById("prEditEmail").value = u.email || "";
  document.getElementById("prEditPass").value = "";
  const bms = getBMs();
  document.getElementById("pbmc").textContent = bms.length;
  document.getElementById("prvc").textContent = u.rc || 0;
  document.getElementById("pvsc").textContent = Math.min(bms.length + 2, 12);
  const g = document.getElementById("bmg");
  if (!bms.length) {
    g.innerHTML =
      '<p style="color:#aaa;font-style:italic;font-size:14px;grid-column:1/-1">No bookmarks yet. Explore and save your favourites!</p>';
  } else
    g.innerHTML = bms
      .map((id) => {
        const m = MD.find((x) => x.id === id);
        return m
          ? `<div class="bmi" onclick="closeProf();openDet(${m.id})"><div class="bi"><img src="${m.image}" alt="${m.name}" loading="lazy"></div><div class="bif"><p>${m.name}</p><small>${m.region} · ${m.yearBuilt}</small></div></div>`
          : "";
      })
      .join("");
  document.getElementById("prP").style.display = "flex";
  document.getElementById("prP").classList.add("open");
}
function closeProf() {
  document.getElementById("prP").classList.remove("open");
  document.getElementById("prP").style.display = "none";
}

function saveProfileSettings() {
  const u = getU();
  if (!u) return;
  const next = {
    ...u,
    name: document.getElementById("prEditName").value.trim() || u.name,
    email: document.getElementById("prEditEmail").value.trim() || u.email,
  };
  const pass = document.getElementById("prEditPass").value.trim();
  if (pass) next.password = pass;
  const us = getUs().map((item) =>
    item.email === u.email ? { ...item, ...next } : item,
  );
  localStorage.setItem("m360_users", JSON.stringify(us));
  localStorage.setItem("m360_sess", JSON.stringify(next));
  updNav();
  showProf();
  showT("Profile updated", "success");
}

// ═══════════════════════ ADMIN ═══════════════════════
function openAdm() {
  if (!canEditSite()) {
    showA("admin");
    return;
  }
  loadAdmData();
  hydrateCmsPanel();
  renderPowerPanel();
  document.getElementById("adP").classList.add("open");
  document.getElementById("adP").style.display = "flex";
}
function closeAdm() {
  document.getElementById("adP").classList.remove("open");
  document.getElementById("adP").style.display = "none";
}
function sas(nm, lnk) {
  document.querySelectorAll(".asec").forEach((s) => s.classList.remove("act"));
  document.getElementById("as-" + nm).classList.add("act");
  document
    .querySelectorAll(".asd nav a")
    .forEach((a) => a.classList.remove("act"));
  lnk.classList.add("act");
  if (nm === "cms") hydrateCmsPanel();
  if (nm === "power") renderPowerPanel();
  document.getElementById("adtl").textContent = lnk.textContent
    .trim()
    .replace(/^[^\w]+/, "");
}
function loadAdmData() {
  const us = getUs(),
    bks = JSON.parse(localStorage.getItem("m360_bkgs") || "[]"),
    msgs = JSON.parse(localStorage.getItem("m360_msgs") || "[]");
  let allRvs = [];
  MD.forEach((m) => {
    const r = getRvs(m.id);
    allRvs = allRvs.concat(r.map((x) => ({ ...x, mon: m.name })));
  });
  const rev = bks.reduce((s, b) => s + (parseInt(b.amt) || 0), 0);
  document.getElementById("asc").innerHTML = [
    { n: MD.length, l: "Monasteries" },
    { n: us.length, l: "Users" },
    { n: bks.length, l: "Bookings" },
    { n: "₹" + rev.toLocaleString("en-IN"), l: "Revenue" },
    { n: allRvs.length, l: "Reviews" },
    { n: msgs.length, l: "Messages" },
  ]
    .map(
      (s) =>
        `<div class="asc"><div class="n">${s.n}</div><div class="l">${s.l}</div></div>`,
    )
    .join("");
  document.getElementById("arbt").innerHTML =
    bks
      .slice(-5)
      .reverse()
      .map(
        (b) =>
          `<tr><td>${b.nm}</td><td>${b.plan}</td><td>${b.dt}</td><td>${b.gs}</td><td>₹${parseInt(b.amt).toLocaleString("en-IN")}</td><td><span class="sba sba-ok">Confirmed</span></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="6" style="color:#aaa;text-align:center">No bookings yet</td></tr>';
  document.getElementById("amtb").innerHTML = MD.map(
    (m) =>
      `<tr><td>${m.id}</td><td><strong>${m.name}</strong></td><td>${m.region}</td><td>${m.yearBuilt}</td><td>${m.sect}</td><td>★ ${m.rating}</td></tr>`,
  ).join("");
  document.getElementById("autb").innerHTML =
    us
      .map(
        (u) =>
          `<tr><td>${u.name}</td><td>${u.email}</td><td>${JSON.parse(localStorage.getItem("m360_bm_" + u.email) || "[]").length}</td><td>${u.rc || 0}</td><td>${u.joined}</td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="5" style="color:#aaa;text-align:center">No users yet</td></tr>';
  document.getElementById("abtb").innerHTML =
    bks
      .map(
        (b) =>
          `<tr><td>${b.nm}</td><td>${b.plan}</td><td>${b.dt}</td><td>${b.gs}</td><td>₹${parseInt(b.amt).toLocaleString("en-IN")}</td><td>${b.mth}</td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="6" style="color:#aaa;text-align:center">No bookings yet</td></tr>';
  document.getElementById("artb").innerHTML =
    allRvs
      .map(
        (r) =>
          `<tr><td>${r.user}</td><td>${"★".repeat(r.stars)}</td><td>${r.text.substring(0, 60)}…</td><td>${r.date}</td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="4" style="color:#aaa;text-align:center">No reviews yet</td></tr>';
  document.getElementById("amsg").innerHTML =
    msgs
      .map(
        (m) =>
          `<tr><td>${m.nm}</td><td>${m.em}</td><td>${m.su || "—"}</td><td>${m.ms.substring(0, 60)}</td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="4" style="color:#aaa;text-align:center">No messages yet</td></tr>';
}

// ═══════════════════════ TESTIMONIALS ═══════════════════════
function rndTesti() {
  const tr = document.getElementById("ttr"),
    td = document.getElementById("tdt");
  tr.innerHTML = TESTI.map(
    (t) =>
      `<div class="tcd"><div class="tin"><div class="tst2">${"★".repeat(t.s)}</div><div class="tq">"${t.q}"</div><img class="tav" src="${t.img}" alt="${t.nm}" loading="lazy"><div class="tnm">${t.nm}</div><div class="trl">${t.role}</div></div></div>`,
  ).join("");
  td.innerHTML = TESTI.map(
    (_, i) =>
      `<button class="${i === 0 ? "act" : ""}" onclick="goT(${i})"></button>`,
  ).join("");
  setInterval(() => movT(1), 5200);
}
function movT(d) {
  T_IDX = (T_IDX + d + TESTI.length) % TESTI.length;
  goT(T_IDX);
}
function goT(i) {
  T_IDX = i;
  document.getElementById("ttr").style.transform = `translateX(-${i * 100}%)`;
  document
    .querySelectorAll("#tdt button")
    .forEach((b, j) => b.classList.toggle("act", j === i));
}

// ═══════════════════════ PLANS ═══════════════════════
function rndPlans() {
  document.getElementById("pgrid").innerHTML = PLANS.map(
    (p, i) => `
    <div class="pc ${p.feat ? "feat" : ""}">
      ${p.feat ? '<div class="pbg">Most Popular</div>' : ""}
      <div class="pico">${p.ico}</div>
      <div class="pnm">${p.nm}</div>
      <div class="ppr">₹${p.price.toLocaleString("en-IN")} <span>/ person</span></div>
      <div class="pds">${p.ds}</div>
      <ul class="pfl">${p.feats.map((f) => `<li>${f}</li>`).join("")}</ul>
      <button class="pbt" onclick="openPay(${i})">Book Now ✦</button>
    </div>
  `,
  ).join("");
}
function openPay(i) {
  if (!getU()) {
    showT("Please signup or login before booking a tourism package", "gold");
    showA("signup");
    return;
  }
  SEL_PLAN = PLANS[i];
  document.getElementById("ptit").textContent = "Book: " + SEL_PLAN.nm;
  const gst = Math.round(SEL_PLAN.price * 0.05);
  document.getElementById("psum").innerHTML = `
    <div class="psr"><span>${SEL_PLAN.nm}</span><span>₹${SEL_PLAN.price.toLocaleString("en-IN")}</span></div>
    <div class="psr"><span>GST (5%)</span><span>₹${gst}</span></div>
    <div class="pst"><span>Total</span><span>₹${(SEL_PLAN.price + gst).toLocaleString("en-IN")}</span></div>
  `;
  const u = getU();
  if (u) {
    document.getElementById("pynm").value = u.name;
    document.getElementById("pyem").value = u.email;
  }
  om("payOv");
}
function procPay() {
  if (!getU()) {
    showT("Please signup or login before booking", "gold");
    cm("payOv");
    showA("signup");
    return;
  }
  const nm = document.getElementById("pynm").value.trim(),
    em = document.getElementById("pyem").value.trim(),
    ph = document.getElementById("pyph").value.trim(),
    dt = document.getElementById("pydt").value.trim(),
    gs = document.getElementById("pygs").value.trim(),
    mth = document.getElementById("pymth").value;
  if (!nm || !em || !ph || !dt || !gs || !mth) {
    showT("Please fill all payment fields", "gold");
    return;
  }
  const gst = Math.round(SEL_PLAN.price * 0.05);
  const bk = {
    nm,
    em,
    ph,
    plan: SEL_PLAN.nm,
    dt,
    gs,
    amt: SEL_PLAN.price + gst,
    mth,
    on: new Date().toLocaleDateString("en-IN"),
  };
  saveConfirmedBooking(bk);
  cm("payOv");
  showT("Booking confirmed! We'll contact you soon. ✦", "success");
}

// ═══════════════════════ CONTACT ═══════════════════════
function saveConfirmedBooking(booking) {
  const bks = JSON.parse(localStorage.getItem("m360_bkgs") || "[]");
  bks.push({
    ...booking,
    on: booking.on || new Date().toLocaleDateString("en-IN"),
  });
  localStorage.setItem("m360_bkgs", JSON.stringify(bks));
  if (document.getElementById("asc")) loadAdmData();
}

async function sendContactToBackend(nm, em, ms, su = "Monastery360 enquiry") {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nm, email: em, subject: su, message: ms }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.msg || data.error || "Contact email failed");
  return data;
}

async function submitLandingContact(e) {
  e.preventDefault();
  const nm = document.getElementById("lcName").value.trim();
  const em = document.getElementById("lcEmail").value.trim();
  const ms = document.getElementById("lcMessage").value.trim();
  if (!nm || !em || !ms) {
    showT("Please fill name, email and message", "gold");
    return;
  }
  try {
    await sendContactToBackend(nm, em, ms);
    document.getElementById("lcName").value = "";
    document.getElementById("lcEmail").value = "";
    document.getElementById("lcMessage").value = "";
    showT("Message emailed to admin", "success");
  } catch (err) {
    showT(err.message + ". Saved locally for demo.", "gold");
    const msgs = JSON.parse(localStorage.getItem("m360_msgs") || "[]");
    msgs.push({
      nm,
      em,
      su: "Landing enquiry",
      ms,
      dt: new Date().toLocaleDateString("en-IN"),
    });
    localStorage.setItem("m360_msgs", JSON.stringify(msgs));
  }
}

function subCon() {
  const nm = document.getElementById("cn").value.trim(),
    em = document.getElementById("ce").value.trim(),
    su = document.getElementById("cs").value.trim(),
    ms = document.getElementById("cm").value.trim();
  if (!nm || !em || !ms) {
    showT("Please fill name, email and message", "gold");
    return;
  }
  const msgs = JSON.parse(localStorage.getItem("m360_msgs") || "[]");
  msgs.push({
    nm,
    em,
    su,
    ms,
    dt: new Date().toLocaleDateString("en-IN"),
  });
  localStorage.setItem("m360_msgs", JSON.stringify(msgs));
  document.getElementById("cn").value = "";
  document.getElementById("ce").value = "";
  document.getElementById("cs").value = "";
  document.getElementById("cm").value = "";
  showT("Message sent! We'll get back to you within 24 hours ✦", "success");
}

// ═══════════════════════ MODAL HELPERS ═══════════════════════
function om(id) {
  document.getElementById(id).classList.add("open");
}
function cm(id) {
  document.getElementById(id).classList.remove("open");
}
function cio(e, id) {
  if (e.target === document.getElementById(id)) cm(id);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") ["dtOv", "authOv", "payOv"].forEach(cm);
});

// ═══════════════════════ TOAST ═══════════════════════
let TT;
function showT(msg, type = "success") {
  clearTimeout(TT);
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast " + type + " show";
  TT = setTimeout(() => t.classList.remove("show"), 3200);
}

// Premium local tour assistant. It answers from the app's own monastery/tour data.
function toggleAiAssistant() {
  document.getElementById("aiAssistant")?.classList.toggle("open");
}

function askAiSuggestion(question) {
  const input = document.getElementById("aiQuestion");
  if (!input) return;
  input.value = question;
  askAiAssistant();
}

function askAiAssistant(event) {
  event?.preventDefault();
  const input = document.getElementById("aiQuestion");
  const question = input?.value.trim();
  if (!question) return;

  appendAiMessage(question, "user");
  input.value = "";
  setTimeout(() => appendAiMessage(buildAiAnswer(question), "bot"), 220);
}

function appendAiMessage(text, type) {
  const box = document.getElementById("aiMessages");
  if (!box) return;
  const msg = document.createElement("div");
  msg.className = "ai-msg " + type;
  msg.textContent = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function buildAiAnswer(question) {
  const q = question.toLowerCase();
  const region = ["east", "west", "north", "south"].find((r) => q.includes(r));
  const matchedMonastery = MD.find(
    (m) =>
      q.includes(m.name.toLowerCase().split(" ")[0]) ||
      q.includes(m.name.toLowerCase()),
  );

  if (matchedMonastery) {
    return `${matchedMonastery.name} is in ${matchedMonastery.location}. It belongs to the ${matchedMonastery.sect || "Buddhist"} tradition, is rated ${matchedMonastery.rating}/5, and is known for ${matchedMonastery.significance || "its spiritual heritage"}. Visitor timing: ${matchedMonastery.timings || "daytime hours"}.`;
  }

  if (q.includes("price") || q.includes("package") || q.includes("tour")) {
    const plans = PLANS.map(
      (p) => `${p.nm}: Rs ${p.price.toLocaleString("en-IN")} per person`,
    ).join("; ");
    return `Current guided tour options are ${plans}. For first-time visitors I suggest the popular heritage/circuit plan if you want a balanced monastery experience.`;
  }

  if (q.includes("payment") || q.includes("razorpay") || q.includes("book")) {
    return "To book, open Book Your Monastery Tour, choose a package, fill your details, and pay through Razorpay test checkout. After successful verification, the booking is saved in MongoDB and shown in the dashboard/admin booking data.";
  }

  if (
    q.includes("photo") ||
    q.includes("photography") ||
    q.includes("camera")
  ) {
    const photoPlan = PLANS.find((p) => p.nm.toLowerCase().includes("photo"));
    return photoPlan
      ? `${photoPlan.nm} is best for photography. It costs Rs ${photoPlan.price.toLocaleString("en-IN")} per person and includes ${photoPlan.feats.slice(0, 3).join(", ")}.`
      : "For photography, choose sunrise or golden-hour monastery routes such as Rumtek, Pemayangtse, Tashiding, Lingdum, and Ravangla side circuits.";
  }

  if (region) {
    const picks = MD.filter((m) => m.region.toLowerCase() === region)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    return `Top ${region} Sikkim picks: ${picks.map((m) => `${m.name} (${m.rating}/5)`).join(", ")}. Start with the highest-rated one if your time is limited.`;
  }

  if (q.includes("best") || q.includes("recommend") || q.includes("first")) {
    const picks = [...MD].sort((a, b) => b.rating - a.rating).slice(0, 5);
    return `Best starting route: ${picks.map((m) => m.name).join(", ")}. These are strong choices because they combine rating, heritage value, and visitor appeal.`;
  }

  if (q.includes("time") || q.includes("timing") || q.includes("open")) {
    return "Most monastery visits are best planned between morning and late afternoon. For exact timing, ask with a monastery name, for example: Rumtek timing or Pemayangtse timing.";
  }

  return "I can help with monastery details, regions, best routes, tour prices, booking steps, Razorpay payment, and photography plans. Try asking: best east monasteries, tour prices, or Rumtek details.";
}

// ═══════════════════════ API INTEGRATION EXAMPLE (SIGNUP) ═══════════════════════

// ═══════════════════════ API INTEGRATION EXAMPLE (LOGIN) ═══════════════════════

// ═════════════════════ LOCATION FEATURES ═════════════════════
// Get user's current location
function getUserLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Gangtok if geolocation fails
          resolve({ lat: 27.3314, lng: 88.6138 });
        },
      );
    } else {
      resolve({ lat: 27.3314, lng: 88.6138 }); // Default to Gangtok
    }
  });
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

// Get nearby restaurants, hotels, etc
function getNearbyAmenities(monasteryLat, monasteryLng) {
  return {
    restaurants: [
      {
        name: "Café Gangtok",
        type: "Restaurant",
        distance: calculateDistance(
          monasteryLat,
          monasteryLng,
          27.3327,
          88.6082,
        ),
        icon: "🍽️",
      },
      {
        name: "Tibetan Tea House",
        type: "Café",
        distance: calculateDistance(monasteryLat, monasteryLng, 27.333, 88.612),
        icon: "☕",
      },
      {
        name: "Heritage Restaurant",
        type: "Fine Dining",
        distance: calculateDistance(monasteryLat, monasteryLng, 27.332, 88.61),
        icon: "🍴",
      },
    ],
    hotels: [
      {
        name: "Kanchenjunga Resorts",
        type: "5-Star Hotel",
        distance: calculateDistance(monasteryLat, monasteryLng, 27.333, 88.614),
        icon: "🏨",
      },
      {
        name: "Monastery View Lodge",
        type: "3-Star Hotel",
        distance: calculateDistance(monasteryLat, monasteryLng, 27.331, 88.609),
        icon: "🏩",
      },
      {
        name: "Eco-Retreat Guesthouse",
        type: "Budget Hotel",
        distance: calculateDistance(monasteryLat, monasteryLng, 27.334, 88.615),
        icon: "🏠",
      },
    ],
  };
}

// Transport cost calculator
function calculateTransportCost(distanceKm) {
  return {
    motorbike: {
      icon: "🏍️",
      name: "Motorbike",
      costPerKm: 8,
      total: Math.ceil(distanceKm * 8),
    },
    car: {
      icon: "🚗",
      name: "Car (4 seater)",
      costPerKm: 15,
      total: Math.ceil(distanceKm * 15),
    },
    taxi: {
      icon: "🚕",
      name: "Taxi",
      costPerKm: 18,
      total: Math.ceil(distanceKm * 18),
    },
    bus: {
      icon: "🚌",
      name: "Bus",
      costPerKm: 5,
      total: Math.ceil(distanceKm * 5),
    },
  };
}

// Enhanced detail modal with location features
async function openDetWithLocation(id) {
  const m = MD.find((x) => x.id === id);
  if (!m) return;

  openDet(id);

  // Get user location
  const userLoc = await getUserLocation();
  const distance = calculateDistance(userLoc.lat, userLoc.lng, m.lat, m.lng);
  const transportCosts = calculateTransportCost(distance);
  const amenities = getNearbyAmenities(m.lat, m.lng);

  // Add location badge
  const detailModal = document.querySelector(".mb");
  if (detailModal) {
    const locBadge = document.createElement("div");
    locBadge.className = "location-badge";
    locBadge.innerHTML = `📍 ${distance} km from your location`;
    detailModal.querySelector(".mhi").appendChild(locBadge);
  }

  // *** Add transport costs
  const viTab = document.getElementById("tc-vi");
  const transportHTML = `
    <div style="margin: 20px 0;">
      <h4 style="font-family: 'Cinzel', serif; color: var(--deep); margin-bottom: 12px;">🚗 Transport Cost from Your Location (${distance} km)</h4>
      <div class="transport-grid">
        ${Object.entries(transportCosts)
          .map(
            ([key, option]) => `
          <div class="transport-option">
            <div class="transport-icon">${option.icon}</div>
            <div class="transport-name">${option.name}</div>
            <div class="transport-price">₹${option.total}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
  viTab.insertAdjacentHTML("beforeend", transportHTML);

  // Add amenities
  const amenitiesHTML = `
    <div style="margin: 20px 0;">
      <h4 style="font-family: 'Cinzel', serif; color: var(--deep); margin-bottom: 12px;">🏨 Nearby Hotels & Restaurants</h4>
      <div class="amenities-grid">
        ${amenities.hotels
          .map(
            (hotel) => `
          <div class="amenity-item">
            <div class="amenity-icon">${hotel.icon}</div>
            <div class="amenity-name">${hotel.name}</div>
            <div class="amenity-distance">${hotel.distance} km away</div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="amenities-grid">
        ${amenities.restaurants
          .map(
            (rest) => `
          <div class="amenity-item">
            <div class="amenity-icon">${rest.icon}</div>
            <div class="amenity-name">${rest.name}</div>
            <div class="amenity-distance">${rest.distance} km away</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
  viTab.insertAdjacentHTML("beforeend", amenitiesHTML);
}

// ═════════════════════ RAZORPAY INTEGRATION ═════════════════════
// **Initialize Razorpay

let RAZORPAY_LOAD_PROMISE = null;
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  if (RAZORPAY_LOAD_PROMISE) return RAZORPAY_LOAD_PROMISE;
  const script = document.createElement("script");
  script.id = "razorpay-sdk";
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  RAZORPAY_LOAD_PROMISE = new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Razorpay checkout could not load"));
  });
  document.body.appendChild(script);
  return RAZORPAY_LOAD_PROMISE;
}

// *** Process payment with Razorpay
async function processRazorpayPayment() {
  if (!SEL_PLAN) {
    showT("Please select a plan first", "gold");
    return;
  }
  if (!getU()) {
    showT("Please signup or login before payment", "gold");
    cm("payOv");
    showA("signup");
    return;
  }

  const nm = document.getElementById("pynm").value.trim();
  const em = document.getElementById("pyem").value.trim();
  const ph = document.getElementById("pyph").value.trim();
  const dt = document.getElementById("pydt").value.trim();
  const gs = document.getElementById("pygs").value.trim();
  const mth = document.getElementById("pymth").value;

  if (!nm || !em || !ph || !dt || !gs || !mth) {
    showT("Please fill all payment fields", "gold");
    return;
  }

  if (
    mth !== "UPI (GPay / PhonePe)" &&
    mth !== "Net Banking" &&
    mth !== "Credit / Debit Card"
  ) {
    procPay(); // Local payment for other methods
    return;
  }

  const gst = Math.round(SEL_PLAN.price * 0.05);
  const totalAmount = SEL_PLAN.price + gst;

  try {
    // Step 1: Create order on backend
    const orderRes = await fetch(`${API_URL}/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalAmount,
        plan: SEL_PLAN.nm,
        guests: gs,
        date: dt,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderData.success) {
      throw new Error(orderData.error || "Failed to create order");
    }
    if (orderData.demo) {
      saveConfirmedBooking({
        nm,
        em,
        ph,
        plan: SEL_PLAN.nm,
        dt,
        gs,
        amt: totalAmount,
        mth,
        paymentId: orderData.paymentId || "demo_payment",
        orderId: orderData.orderId,
        status: "confirmed-demo",
      });
      cm("payOv");
      showT(
        "Demo booking confirmed. Add Razorpay keys in server/.env for live checkout.",
        "success",
      );
      return;
    }
    await loadRazorpay();

    // Step 2: Open Razorpay checkout
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: "INR",
      name: "Monastery360",
      description: `${SEL_PLAN.nm} - ${gs} guests`,
      order_id: orderData.orderId,
      prefill: {
        name: nm,
        email: em,
        contact: ph,
      },
      notes: {
        plan: SEL_PLAN.nm,
        date: dt,
        guests: gs,
      },
      theme: {
        color: "#c9a84c",
      },
      handler: async function (response) {
        // Step 3: Verify payment on backend
        try {
          const verifyRes = await fetch(`${API_URL}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(localStorage.getItem("token")
                ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
                : {}),
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerName: nm,
              customerEmail: em,
              customerPhone: ph,
              plan: SEL_PLAN.nm,
              date: dt,
              guests: parseInt(gs),
              amount: SEL_PLAN.price,
              gst: gst,
              paymentMethod: mth,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Save booking locally and to server
            const booking = {
              nm,
              em,
              ph,
              plan: SEL_PLAN.nm,
              dt,
              gs,
              amt: totalAmount,
              mth,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              on: new Date().toLocaleDateString("en-IN"),
              status: "completed",
            };

            saveConfirmedBooking(booking);

            cm("payOv");
            showT(
              "🎉 Payment successful! Booking confirmed. We'll contact you soon.",
              "success",
            );

            // Send confirmation email
            sendBookingConfirmation(booking);
          } else {
            throw new Error(verifyData.error || "Payment verification failed");
          }
        } catch (verifyErr) {
          console.error("Verification error:", verifyErr);
          showT(
            "Payment received but verification failed. Please contact support.",
            "gold",
          );
        }
      },
      modal: {
        ondismiss: function () {
          showT("Payment cancelled", "gold");
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error:", err);
    showT(err.message || "Payment processing failed", "error");
  }
}

// *** Send booking confirmation email
async function sendBookingConfirmation(booking) {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: booking.nm,
        email: booking.em,
        subject: `Monastery360 Booking Confirmation - ${booking.plan}`,
        message: `Your booking for ${booking.plan} has been confirmed. Date: ${booking.dt}, Guests: ${booking.gs}. We'll contact you shortly.`,
      }),
    });

    if (response.ok) {
      console.log("Confirmation email sent");
    }
  } catch (error) {
    console.log(
      "Confirmation email could not be sent, but booking is saved locally",
    );
  }
}

// Load Razorpay when page loads
window.addEventListener("load", () => {
  loadRazorpay();
});

// *** Reels section code ***
