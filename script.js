// Optional embeds stay disconnected until the visitor gives consent.
(() => {
  const key = "valcore-cookie-choice-v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let preference = null;
  let returnFocus = null;
  const readPreference = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && typeof saved.accepted === "boolean" && Number.isFinite(saved.expires) && saved.expires > Date.now()) return saved;
    } catch (_) { /* Keep optional services off if storage is unavailable. */ }
    return null;
  };

  const notice = document.createElement("section");
  notice.className = "cookie-notice";
  notice.setAttribute("aria-label", "Cookie preferences");
  notice.innerHTML = `
    <div class="cookie-copy">
      <h2>Your cookie choices</h2>
      <p>Allow optional cookies for Google Maps?</p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="consent-control" data-cookie-choice="deny">Deny optional cookies</button>
      <button type="button" class="consent-control" data-cookie-choice="accept">Accept optional cookies</button>
    </div>`;
  document.body.append(notice);

  const applyPreference = () => {
    const accepted = preference?.accepted === true;
    document.querySelectorAll("iframe[data-consent-src]").forEach((frame) => {
      if (accepted) {
        if (!frame.hasAttribute("src")) frame.setAttribute("src", frame.dataset.consentSrc);
      } else {
        frame.removeAttribute("src");
      }
      frame.hidden = !accepted;
    });
    const placeholder = document.querySelector("#map-consent-placeholder");
    if (placeholder) placeholder.hidden = accepted;
  };
  const resizeNotice = () => {
    document.body.style.setProperty("--cookie-notice-height", `${notice.hidden ? 0 : notice.offsetHeight}px`);
  };
  const openNotice = (trigger) => {
    returnFocus = trigger;
    notice.hidden = false;
    resizeNotice();
    notice.querySelector("button").focus();
  };
  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "cookie-settings-link";
  settings.textContent = "Cookie settings";
  settings.addEventListener("click", () => openNotice(settings));
  (document.querySelector(".footer-actions") || document.body).append(settings);
  document.querySelectorAll("[data-open-consent]").forEach((button) => {
    button.addEventListener("click", () => openNotice(button));
  });
  notice.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      preference = { accepted: button.dataset.cookieChoice === "accept", expires: Date.now() + lifetime };
      try { localStorage.setItem(key, JSON.stringify(preference)); } catch (_) { /* Apply for this page even without persistence. */ }
      applyPreference();
      notice.hidden = true;
      resizeNotice();
      (returnFocus && !returnFocus.closest("[hidden]") ? returnFocus : settings).focus();
    });
  });
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) {
      preference = readPreference();
      applyPreference();
      notice.hidden = preference !== null;
      resizeNotice();
    }
  });
  preference = readPreference();
  applyPreference();
  notice.hidden = preference !== null;
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(resizeNotice).observe(notice);
  window.addEventListener("resize", resizeNotice);
  resizeNotice();
})();

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const weatherGrid = document.querySelector("#weather-grid");
const logoImages = document.querySelectorAll(".brand-mark img");
const revealSteps = document.querySelectorAll(".reveal-step");
const homeInsightCards = document.querySelectorAll(".home-insight-card");

const weatherCities = [
  { name: "Baltimore", state: "MD", latitude: 39.2904, longitude: -76.6122 },
  { name: "Washington", state: "DC", latitude: 38.9072, longitude: -77.0369 },
  { name: "Philadelphia", state: "PA", latitude: 39.9526, longitude: -75.1652 },
  { name: "New York", state: "NY", latitude: 40.7128, longitude: -74.006 },
  { name: "Wilmington", state: "DE", latitude: 39.7391, longitude: -75.5398 },
  { name: "Richmond", state: "VA", latitude: 37.5407, longitude: -77.436 },
  { name: "Norfolk", state: "VA", latitude: 36.8508, longitude: -76.2859 }
];

const weatherCodeText = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorms"
};

function renderWeatherError() {
  if (!weatherGrid) return;
  weatherGrid.innerHTML = `<article class="weather-card loading">Regional forecast is unavailable right now.</article>`;
}

function renderWeatherCard(city, forecast) {
  const current = forecast.current || {};
  const daily = forecast.daily || {};
  const high = Math.round(daily.temperature_2m_max?.[0] ?? current.temperature_2m ?? 0);
  const low = Math.round(daily.temperature_2m_min?.[0] ?? current.temperature_2m ?? 0);
  const rain = Math.round(daily.precipitation_probability_max?.[0] ?? 0);
  const temp = Math.round(current.temperature_2m ?? high);
  const wind = Math.round(current.wind_speed_10m ?? 0);
  const condition = weatherCodeText[current.weather_code] || "Forecast";

  return `
    <article class="weather-card">
      <span>${city.state}</span>
      <strong>${city.name}</strong>
      <div class="weather-temp">${temp} F</div>
      <p>${condition}</p>
      <dl>
        <div><dt>High / Low</dt><dd>${high} / ${low} F</dd></div>
        <div><dt>Rain risk</dt><dd>${rain}%</dd></div>
        <div><dt>Wind</dt><dd>${wind} mph</dd></div>
      </dl>
    </article>
  `;
}

async function loadRegionalWeather() {
  if (!weatherGrid) return;
  try {
    const cards = await Promise.all(
      weatherCities.map(async (city) => {
        const params = new URLSearchParams({
          latitude: String(city.latitude),
          longitude: String(city.longitude),
          current: "temperature_2m,weather_code,wind_speed_10m",
          daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
          temperature_unit: "fahrenheit",
          wind_speed_unit: "mph",
          timezone: "auto",
          forecast_days: "3"
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) throw new Error("Weather request failed");
        return renderWeatherCard(city, await response.json());
      })
    );
    weatherGrid.innerHTML = cards.join("");
  } catch (error) {
    renderWeatherError();
  }
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

loadRegionalWeather();

logoImages.forEach((image) => {
  image.addEventListener("error", () => {
    image.style.display = "none";
  });
});


if (revealSteps.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.32 });

  revealSteps.forEach((step) => observer.observe(step));
}

if (homeInsightCards.length) {
  const setActiveHomeCard = (card) => {
    homeInsightCards.forEach((item) => item.classList.toggle("active", item === card));
  };

  homeInsightCards.forEach((card) => {
    card.addEventListener("click", () => setActiveHomeCard(card));
    card.addEventListener("focus", () => setActiveHomeCard(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveHomeCard(card);
      }
    });
  });
}
