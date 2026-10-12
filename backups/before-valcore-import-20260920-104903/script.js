const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const tonsInput = document.querySelector("#tons");
const truckCountInput = document.querySelector("#truck-count");
const productSelect = document.querySelector("#product");
const capacitySelect = document.querySelector("#capacity");
const loadsOutput = document.querySelector("#loads");
const plannerNote = document.querySelector("#planner-note");
const productionTimeOutput = document.querySelector("#production-time");
const productionNote = document.querySelector("#production-note");
const loadingTimeOutput = document.querySelector("#loading-time");
const loadingNote = document.querySelector("#loading-note");
const totalTimeOutput = document.querySelector("#total-time");
const timerNote = document.querySelector("#timer-note");
const weatherGrid = document.querySelector("#weather-grid");
const terminalImage = document.querySelector(".terminal-photo img");
const logoImages = document.querySelectorAll(".brand-mark img");
const revealSteps = document.querySelectorAll(".reveal-step");
const processNodes = document.querySelectorAll(".process-node");
const processCount = document.querySelector("#process-count");
const processTitle = document.querySelector("#process-title");
const processText = document.querySelector("#process-text");
const processMeter = document.querySelector(".process-meter span");
const homeInsightCards = document.querySelectorAll(".home-insight-card");

const processStepsData = [
  {
    title: "Heat & Transfer",
    text: "Base asphalt is transferred from service storage into the PMB plant through heated pumps and hot-oil jacketed piping."
  },
  {
    title: "Weigh & Feed",
    text: "Bitumen and polymer are weighed and introduced into the mixing system with controlled feeding, load cells, and agitation."
  },
  {
    title: "Mix & Mill",
    text: "Heated mixing tanks and the high-shear mill disperse polymer into the binder for target modification and particle-size control."
  },
  {
    title: "Circulate & Analyze",
    text: "Finished PMB is circulated, stored, and analyzed through certified laboratory testing before shipment documents are issued."
  }
];

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

function formatDuration(hours) {
  const totalMinutes = Math.round(Math.max(hours, 0) * 60);
  const days = Math.floor(totalMinutes / 1440);
  const remainingAfterDays = totalMinutes % 1440;
  const wholeHours = Math.floor(remainingAfterDays / 60);
  const minutes = remainingAfterDays % 60;
  const parts = [];
  if (days) parts.push(`${days}d`);
  parts.push(`${wholeHours}h`);
  parts.push(`${String(minutes).padStart(2, "0")}m`);
  return parts.join(" ");
}

function updateLoads(event) {
  if (!tonsInput || !capacitySelect || !loadsOutput) return;
  const capacity = Number(capacitySelect.value) || 24;
  const loadingMinutes = 20;
  const requestedTrucks = Math.max(Number(truckCountInput?.value) || 0, 0);
  let tons = Math.max(Number(tonsInput.value) || 0, 0);
  let loads = Math.max(Math.ceil(tons / capacity), 1);

  if (event?.target === truckCountInput && requestedTrucks > 0) {
    tons = requestedTrucks * capacity;
    tonsInput.value = tons;
    loads = requestedTrucks;
  } else if (requestedTrucks > 0 && event?.target !== tonsInput) {
    loads = requestedTrucks;
    tons = requestedTrucks * capacity;
    tonsInput.value = tons;
  } else if (truckCountInput && event?.target === tonsInput) {
    truckCountInput.value = "";
  }

  const productionHours = tons / (200 / 12);
  const productionHoursPerTruck = capacity / (200 / 12);
  const loadingHours = (loads * loadingMinutes) / 60;
  const totalHours = productionHours + loadingHours;

  loadsOutput.textContent = loads;
  if (plannerNote) plannerNote.textContent = `Based on ${tons || 0} tons and ${capacity}-ton trucks.`;
  if (productionTimeOutput) productionTimeOutput.textContent = formatDuration(productionHours);
  if (productionNote) productionNote.textContent = `One ${capacity}-ton truck: ${formatDuration(productionHoursPerTruck)} production.`;
  if (loadingTimeOutput) loadingTimeOutput.textContent = formatDuration(loadingHours);
  if (loadingNote) loadingNote.textContent = `${loadingMinutes} minutes per truck.`;
  if (totalTimeOutput) totalTimeOutput.textContent = formatDuration(totalHours);
  if (timerNote) {
    const grade = productSelect?.value || "selected PG grade";
    timerNote.textContent = `For ${grade}, ${tons || 0} tons, ${loads} truck${loads === 1 ? "" : "s"}.`;
  }
}

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

if (tonsInput && capacitySelect) {
  tonsInput.addEventListener("input", updateLoads);
  capacitySelect.addEventListener("change", updateLoads);
  truckCountInput?.addEventListener("input", updateLoads);
  productSelect?.addEventListener("change", updateLoads);
  updateLoads();
}

loadRegionalWeather();

if (terminalImage) {
  terminalImage.addEventListener("error", () => {
    terminalImage.style.display = "none";
  });
}

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

if (processNodes.length && processCount && processTitle && processText && processMeter) {
  processNodes.forEach((node) => {
    node.addEventListener("click", () => {
      const index = Number(node.dataset.step);
      const step = processStepsData[index];
      if (!step) return;

      processNodes.forEach((item) => item.classList.remove("active"));
      node.classList.add("active");
      processCount.textContent = `Step ${index + 1} of ${processStepsData.length}`;
      processTitle.textContent = step.title;
      processText.textContent = step.text;
      processMeter.style.width = `${((index + 1) / processStepsData.length) * 100}%`;
    });
  });
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
