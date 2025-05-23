async function getWeather() {
  const apiKey = "d8cc7951cc520106cd0cdeb6da525195";
  const city = document.getElementById("cityInput").value;
  const weatherDiv = document.getElementById("weather");

  if (!city) {
    weatherDiv.innerHTML = "Please enter a city name.";
    return;
  }

  weatherDiv.innerHTML = "Loading...";

  try {
    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`
    );
    if (!currentRes.ok) throw new Error("City not found");
    const currentData = await currentRes.json();

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}`
    );
    if (!forecastRes.ok) throw new Error("Forecast not available");
    const forecastData = await forecastRes.json();

    // Format current weather
    const tempC = (currentData.main.temp - 273.15).toFixed(1);
    const weatherDesc = currentData.weather[0].description;
    const icon = currentData.weather[0].icon;
    const humidity = currentData.main.humidity;
    const windSpeed = currentData.wind.speed;

    let output = `
      <div class="weather-block">
        <h3>Current Weather in ${currentData.name}, ${currentData.sys.country}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weatherDesc}" />
        <p><strong>🌡️ Temperature:</strong> ${tempC}°C</p>
        <p><strong>☁️ Condition:</strong> ${weatherDesc}</p>
        <p><strong>💧 Humidity:</strong> ${humidity}%</p>
        <p><strong>💨 Wind Speed:</strong> ${windSpeed} m/s</p>
      </div>
      <h3 style="margin-bottom: 10px;">5-Day Forecast</h3>
      <div class="forecast">
    `;

    // Filter forecast to show entries at noon
    const filteredForecast = forecastData.list.filter(f =>
      f.dt_txt.includes("12:00:00")
    );

    filteredForecast.forEach(f => {
      const date = new Date(f.dt_txt);
      const temp = (f.main.temp - 273.15).toFixed(1);
      const desc = f.weather[0].description;
      const icon = f.weather[0].icon;

      output += `
        <div class="weather-block">
          <p><strong>${date.toDateString()}</strong></p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
          <p><strong>${temp}°C</strong></p>
          <p>${desc}</p>
        </div>
      `;
    });

    output += `</div>`;
    weatherDiv.innerHTML = output;
  } catch (error) {
    console.error(error);
    weatherDiv.innerHTML = "Error fetching weather data. Please check the city name.";
  }
}
