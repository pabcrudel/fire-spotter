/** Retrieves weather data based on latitude and longitude coordinates
 * from Open Weather API. */
async function fetchOpenWeatherData(latitude, longitude) {
  const apiPath = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "efd53a1ca3bae9d1aae362ddf19cbbeb";
  const apiUrl = apiPath + `?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  return await response.json();

};

/** Cleared the weather info that is needed */
function clearData(openWeatherData) {
  const windDeg = openWeatherData.wind.deg;
  const windSpeed = openWeatherData.wind.speed;
  const { temp, humidity } = openWeatherData.main;
  const nearbyCity = openWeatherData.name;
  
  return { windDeg, windSpeed, temp, humidity, nearbyCity };
}

/** Gets forecast data by a given point location */
export async function getForecastData(latitude, longitude) {
  const openWeatherData = await fetchOpenWeatherData(latitude, longitude);

  // Return cleared weather data
  return clearData(openWeatherData);
}